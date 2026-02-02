// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AgentMarketplace
 * @dev NFT Marketplace for agent-created collections with royalty support
 * Agents earn platform fees on sales from their collections
 */
contract AgentMarketplace is ReentrancyGuard, Pausable {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool isActive;
        uint256 listedAt;
    }
    
    struct Offer {
        address offerer;
        uint256 price;
        uint256 expiresAt;
        bool isActive;
    }
    
    mapping(address => mapping(uint256 => Listing)) public listings;
    mapping(address => mapping(uint256 => Offer[])) public offers;
    
    uint256 public platformFee; // in basis points (e.g., 250 = 2.5%)
    uint256 public agentFee; // in basis points (e.g., 100 = 1%)
    address public platformWallet;
    mapping(address => address) public collectionAgents; // collection => agent wallet
    
    event NFTListed(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price,
        uint256 timestamp
    );
    
    event NFTSold(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 price,
        uint256 timestamp
    );
    
    event ListingCancelled(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller
    );
    
    event OfferMade(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed offerer,
        uint256 price,
        uint256 expiresAt
    );
    
    event OfferAccepted(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 price
    );
    
    event PriceUpdated(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 oldPrice,
        uint256 newPrice
    );
    
    constructor(
        address _platformWallet,
        uint256 _platformFee,
        uint256 _agentFee
    ) {
        require(_platformWallet != address(0), "Invalid platform wallet");
        require(_platformFee + _agentFee <= 1000, "Total fees too high"); // Max 10%
        
        platformWallet = _platformWallet;
        platformFee = _platformFee;
        agentFee = _agentFee;
    }
    
    /**
     * @dev Register a collection's agent wallet (called by factory or admin)
     * @param nftContract Collection address
     * @param agentWallet Agent's wallet address
     */
    function registerCollectionAgent(address nftContract, address agentWallet) external {
        require(msg.sender == platformWallet, "Only platform can register");
        collectionAgents[nftContract] = agentWallet;
    }
    
    /**
     * @dev List an NFT for sale
     * @param nftContract NFT contract address
     * @param tokenId Token ID
     * @param price Listing price in wei
     */
    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external whenNotPaused {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(nft.getApproved(tokenId) == address(this) || 
                nft.isApprovedForAll(msg.sender, address(this)), "Marketplace not approved");
        require(price > 0, "Price must be greater than 0");
        require(!listings[nftContract][tokenId].isActive, "Already listed");
        
        listings[nftContract][tokenId] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            isActive: true,
            listedAt: block.timestamp
        });
        
        emit NFTListed(nftContract, tokenId, msg.sender, price, block.timestamp);
    }
    
    /**
     * @dev Buy a listed NFT
     * @param nftContract NFT contract address
     * @param tokenId Token ID
     */
    function buyNFT(address nftContract, uint256 tokenId) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        Listing memory listing = listings[nftContract][tokenId];
        require(listing.isActive, "Not listed for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy own NFT");
        
        // Mark as sold
        listings[nftContract][tokenId].isActive = false;
        
        // Calculate fees and payments
        (uint256 sellerProceeds, uint256 platformFeeAmount, uint256 agentFeeAmount, uint256 royaltyAmount, address royaltyReceiver) = 
            _calculatePayments(nftContract, tokenId, listing.price);
        
        // Transfer NFT to buyer
        IERC721(nftContract).safeTransferFrom(listing.seller, msg.sender, tokenId);
        
        // Distribute payments
        _distributePayments(
            listing.seller,
            sellerProceeds,
            platformFeeAmount,
            agentFeeAmount,
            royaltyAmount,
            royaltyReceiver,
            nftContract
        );
        
        // Refund excess payment
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit NFTSold(nftContract, tokenId, listing.seller, msg.sender, listing.price, block.timestamp);
    }
    
    /**
     * @dev Cancel a listing
     * @param nftContract NFT contract address
     * @param tokenId Token ID
     */
    function cancelListing(address nftContract, uint256 tokenId) external {
        Listing memory listing = listings[nftContract][tokenId];
        require(listing.isActive, "Not listed");
        require(listing.seller == msg.sender, "Not seller");
        
        listings[nftContract][tokenId].isActive = false;
        
        emit ListingCancelled(nftContract, tokenId, msg.sender);
    }
    
    /**
     * @dev Update listing price
     * @param nftContract NFT contract address
     * @param tokenId Token ID
     * @param newPrice New price in wei
     */
    function updatePrice(address nftContract, uint256 tokenId, uint256 newPrice) external {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.isActive, "Not listed");
        require(listing.seller == msg.sender, "Not seller");
        require(newPrice > 0, "Invalid price");
        
        uint256 oldPrice = listing.price;
        listing.price = newPrice;
        
        emit PriceUpdated(nftContract, tokenId, oldPrice, newPrice);
    }
    
    /**
     * @dev Make an offer on an NFT
     * @param nftContract NFT contract address
     * @param tokenId Token ID
     * @param expiresAt Offer expiration timestamp
     */
    function makeOffer(
        address nftContract,
        uint256 tokenId,
        uint256 expiresAt
    ) external payable {
        require(msg.value > 0, "Offer must be greater than 0");
        require(expiresAt > block.timestamp, "Invalid expiration");
        require(IERC721(nftContract).ownerOf(tokenId) != msg.sender, "Cannot offer on own NFT");
        
        offers[nftContract][tokenId].push(Offer({
            offerer: msg.sender,
            price: msg.value,
            expiresAt: expiresAt,
            isActive: true
        }));
        
        emit OfferMade(nftContract, tokenId, msg.sender, msg.value, expiresAt);
    }
    
    /**
     * @dev Accept an offer
     * @param nftContract NFT contract address
     * @param tokenId Token ID
     * @param offerIndex Index of the offer to accept
     */
    function acceptOffer(
        address nftContract,
        uint256 tokenId,
        uint256 offerIndex
    ) external nonReentrant whenNotPaused {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not token owner");
        
        Offer storage offer = offers[nftContract][tokenId][offerIndex];
        require(offer.isActive, "Offer not active");
        require(offer.expiresAt > block.timestamp, "Offer expired");
        
        // Mark offer as accepted
        offer.isActive = false;
        
        // Cancel listing if active
        if (listings[nftContract][tokenId].isActive) {
            listings[nftContract][tokenId].isActive = false;
        }
        
        // Calculate payments
        (uint256 sellerProceeds, uint256 platformFeeAmount, uint256 agentFeeAmount, uint256 royaltyAmount, address royaltyReceiver) = 
            _calculatePayments(nftContract, tokenId, offer.price);
        
        // Transfer NFT
        nft.safeTransferFrom(msg.sender, offer.offerer, tokenId);
        
        // Distribute payments (funds are already held in this contract from makeOffer)
        _distributePayments(
            msg.sender,
            sellerProceeds,
            platformFeeAmount,
            agentFeeAmount,
            royaltyAmount,
            royaltyReceiver,
            nftContract
        );
        
        emit OfferAccepted(nftContract, tokenId, msg.sender, offer.offerer, offer.price);
    }
    
    /**
     * @dev Get all offers for an NFT
     * @param nftContract NFT contract address
     * @param tokenId Token ID
     */
    function getOffers(address nftContract, uint256 tokenId) external view returns (Offer[] memory) {
        return offers[nftContract][tokenId];
    }
    
    /**
     * @dev Calculate payment distribution
     */
    function _calculatePayments(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) private view returns (
        uint256 sellerProceeds,
        uint256 platformFeeAmount,
        uint256 agentFeeAmount,
        uint256 royaltyAmount,
        address royaltyReceiver
    ) {
        // Platform fee
        platformFeeAmount = (price * platformFee) / 10000;
        
        // Agent fee
        agentFeeAmount = (price * agentFee) / 10000;
        
        // Royalty (ERC2981)
        try IERC2981(nftContract).royaltyInfo(tokenId, price) returns (address receiver, uint256 royalty) {
            royaltyReceiver = receiver;
            royaltyAmount = royalty;
        } catch {
            royaltyReceiver = address(0);
            royaltyAmount = 0;
        }
        
        // Seller proceeds
        sellerProceeds = price - platformFeeAmount - agentFeeAmount - royaltyAmount;
        
        return (sellerProceeds, platformFeeAmount, agentFeeAmount, royaltyAmount, royaltyReceiver);
    }
    
    /**
     * @dev Distribute payments
     */
    function _distributePayments(
        address seller,
        uint256 sellerProceeds,
        uint256 platformFeeAmount,
        uint256 agentFeeAmount,
        uint256 royaltyAmount,
        address royaltyReceiver,
        address nftContract
    ) private {
        // Pay seller
        (bool sellerSuccess, ) = seller.call{value: sellerProceeds}("");
        require(sellerSuccess, "Seller payment failed");
        
        // Pay platform fee
        if (platformFeeAmount > 0) {
            (bool platformSuccess, ) = platformWallet.call{value: platformFeeAmount}("");
            require(platformSuccess, "Platform fee payment failed");
        }
        
        // Pay agent fee
        if (agentFeeAmount > 0 && collectionAgents[nftContract] != address(0)) {
            (bool agentSuccess, ) = collectionAgents[nftContract].call{value: agentFeeAmount}("");
            require(agentSuccess, "Agent fee payment failed");
        }
        
        // Pay royalty
        if (royaltyAmount > 0 && royaltyReceiver != address(0)) {
            (bool royaltySuccess, ) = royaltyReceiver.call{value: royaltyAmount}("");
            require(royaltySuccess, "Royalty payment failed");
        }
    }
    
    /**
     * @dev Update platform fee (only platform wallet)
     */
    function updatePlatformFee(uint256 newFee) external {
        require(msg.sender == platformWallet, "Only platform");
        require(newFee + agentFee <= 1000, "Total fees too high");
        platformFee = newFee;
    }
    
    /**
     * @dev Update agent fee (only platform wallet)
     */
    function updateAgentFee(uint256 newFee) external {
        require(msg.sender == platformWallet, "Only platform");
        require(platformFee + newFee <= 1000, "Total fees too high");
        agentFee = newFee;
    }
    
    /**
     * @dev Pause marketplace
     */
    function pause() external {
        require(msg.sender == platformWallet, "Only platform");
        _pause();
    }
    
    /**
     * @dev Unpause marketplace
     */
    function unpause() external {
        require(msg.sender == platformWallet, "Only platform");
        _unpause();
    }
}

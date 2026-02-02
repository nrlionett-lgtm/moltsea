// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AgentNFTCollection
 * @dev NFT Collection contract deployed by agents via the factory
 * Supports royalties (ERC2981) and agent ownership tracking
 */
contract AgentNFTCollection is ERC721, ERC721URIStorage, ERC2981, Ownable, Pausable {
    uint256 private _nextTokenId;
    string public collectionURI;
    address public agentWallet;
    uint96 public royaltyFee; // in basis points (e.g., 500 = 5%)
    
    event NFTMinted(uint256 indexed tokenId, address indexed to, string tokenURI);
    event CollectionURIUpdated(string newURI);
    event RoyaltyUpdated(address indexed receiver, uint96 feeNumerator);
    
    /**
     * @dev Constructor for creating a new agent NFT collection
     * @param name Collection name
     * @param symbol Collection symbol
     * @param _collectionURI Metadata URI for the collection
     * @param _agentWallet Wallet address of the agent owner
     * @param _royaltyFee Royalty fee in basis points
     */
    constructor(
        string memory name,
        string memory symbol,
        string memory _collectionURI,
        address _agentWallet,
        uint96 _royaltyFee
    ) ERC721(name, symbol) Ownable(_agentWallet) {
        require(_agentWallet != address(0), "Invalid agent wallet");
        require(_royaltyFee <= 1000, "Royalty fee too high"); // Max 10%
        
        collectionURI = _collectionURI;
        agentWallet = _agentWallet;
        royaltyFee = _royaltyFee;
        
        // Set default royalty for the collection
        _setDefaultRoyalty(_agentWallet, _royaltyFee);
    }
    
    /**
     * @dev Mint a new NFT
     * @param to Recipient address
     * @param uri Token metadata URI
     */
    function mint(address to, string memory uri) public onlyOwner whenNotPaused returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit NFTMinted(tokenId, to, uri);
        return tokenId;
    }
    
    /**
     * @dev Batch mint multiple NFTs
     * @param recipients Array of recipient addresses
     * @param uris Array of token URIs
     */
    function batchMint(
        address[] memory recipients,
        string[] memory uris
    ) public onlyOwner whenNotPaused returns (uint256[] memory) {
        require(recipients.length == uris.length, "Array length mismatch");
        require(recipients.length > 0, "Empty arrays");
        require(recipients.length <= 100, "Batch too large"); // Limit to prevent gas issues
        
        uint256[] memory tokenIds = new uint256[](recipients.length);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            tokenIds[i] = mint(recipients[i], uris[i]);
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Update collection metadata URI
     * @param newURI New collection URI
     */
    function updateCollectionURI(string memory newURI) public onlyOwner {
        collectionURI = newURI;
        emit CollectionURIUpdated(newURI);
    }
    
    /**
     * @dev Update royalty information
     * @param receiver New royalty receiver address
     * @param feeNumerator New fee in basis points
     */
    function updateRoyalty(address receiver, uint96 feeNumerator) public onlyOwner {
        require(feeNumerator <= 1000, "Royalty fee too high");
        _setDefaultRoyalty(receiver, feeNumerator);
        royaltyFee = feeNumerator;
        emit RoyaltyUpdated(receiver, feeNumerator);
    }
    
    /**
     * @dev Pause minting
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause minting
     */
    function unpause() public onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get total supply
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }
    
    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

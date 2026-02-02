// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AgentNFTCollection.sol";

/**
 * @title AgentNFTFactory
 * @dev Factory contract for deploying agent NFT collections on Base network
 * Tracks all collections and their agent owners
 */
contract AgentNFTFactory {
    struct CollectionInfo {
        address collectionAddress;
        address agentWallet;
        string name;
        string symbol;
        uint256 deployedAt;
        bool isActive;
    }
    
    mapping(address => CollectionInfo) public collections;
    mapping(address => address[]) public agentCollections;
    address[] public allCollections;
    
    uint256 public deploymentFee;
    address public platformWallet;
    
    event CollectionDeployed(
        address indexed collectionAddress,
        address indexed agentWallet,
        string name,
        string symbol,
        uint256 timestamp
    );
    
    event DeploymentFeeUpdated(uint256 newFee);
    event PlatformWalletUpdated(address indexed newWallet);
    event CollectionDeactivated(address indexed collectionAddress);
    
    constructor(address _platformWallet, uint256 _deploymentFee) {
        require(_platformWallet != address(0), "Invalid platform wallet");
        platformWallet = _platformWallet;
        deploymentFee = _deploymentFee;
    }
    
    /**
     * @dev Deploy a new NFT collection for an agent
     * @param name Collection name
     * @param symbol Collection symbol
     * @param collectionURI Metadata URI for the collection
     * @param agentWallet Wallet address of the agent
     * @param royaltyFee Royalty fee in basis points (max 1000 = 10%)
     */
    function deployCollection(
        string memory name,
        string memory symbol,
        string memory collectionURI,
        address agentWallet,
        uint96 royaltyFee
    ) public payable returns (address) {
        require(msg.value >= deploymentFee, "Insufficient deployment fee");
        require(agentWallet != address(0), "Invalid agent wallet");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        
        // Deploy new collection contract
        AgentNFTCollection newCollection = new AgentNFTCollection(
            name,
            symbol,
            collectionURI,
            agentWallet,
            royaltyFee
        );
        
        address collectionAddress = address(newCollection);
        
        // Store collection info
        collections[collectionAddress] = CollectionInfo({
            collectionAddress: collectionAddress,
            agentWallet: agentWallet,
            name: name,
            symbol: symbol,
            deployedAt: block.timestamp,
            isActive: true
        });
        
        // Track agent's collections
        agentCollections[agentWallet].push(collectionAddress);
        allCollections.push(collectionAddress);
        
        // Transfer deployment fee to platform
        if (msg.value > 0) {
            (bool success, ) = platformWallet.call{value: msg.value}("");
            require(success, "Fee transfer failed");
        }
        
        emit CollectionDeployed(
            collectionAddress,
            agentWallet,
            name,
            symbol,
            block.timestamp
        );
        
        return collectionAddress;
    }
    
    /**
     * @dev Get all collections deployed by a specific agent
     * @param agentWallet Agent's wallet address
     */
    function getAgentCollections(address agentWallet) public view returns (address[] memory) {
        return agentCollections[agentWallet];
    }
    
    /**
     * @dev Get collection info
     * @param collectionAddress Collection contract address
     */
    function getCollectionInfo(address collectionAddress) public view returns (CollectionInfo memory) {
        return collections[collectionAddress];
    }
    
    /**
     * @dev Get all deployed collections
     */
    function getAllCollections() public view returns (address[] memory) {
        return allCollections;
    }
    
    /**
     * @dev Get total number of collections
     */
    function getTotalCollections() public view returns (uint256) {
        return allCollections.length;
    }
    
    /**
     * @dev Update deployment fee (only platform wallet)
     * @param newFee New deployment fee in wei
     */
    function updateDeploymentFee(uint256 newFee) public {
        require(msg.sender == platformWallet, "Only platform can update fee");
        deploymentFee = newFee;
        emit DeploymentFeeUpdated(newFee);
    }
    
    /**
     * @dev Update platform wallet (only current platform wallet)
     * @param newWallet New platform wallet address
     */
    function updatePlatformWallet(address newWallet) public {
        require(msg.sender == platformWallet, "Only platform can update wallet");
        require(newWallet != address(0), "Invalid wallet address");
        platformWallet = newWallet;
        emit PlatformWalletUpdated(newWallet);
    }
    
    /**
     * @dev Deactivate a collection (emergency use)
     * @param collectionAddress Collection to deactivate
     */
    function deactivateCollection(address collectionAddress) public {
        require(msg.sender == platformWallet, "Only platform can deactivate");
        require(collections[collectionAddress].isActive, "Already deactivated");
        collections[collectionAddress].isActive = false;
        emit CollectionDeactivated(collectionAddress);
    }
}

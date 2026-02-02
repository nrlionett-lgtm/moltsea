const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

async function main() {
    // Setup provider and wallet
    const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org";
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
        console.error("Error: PRIVATE_KEY not found in .env.local");
        process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log("Deploying contracts with the account:", wallet.address);

    // Helper to load artifacts
    const getArtifact = (name) => {
        const artifactPath = path.join(__dirname, `../artifacts/contracts/${name}.sol/${name}.json`);
        return JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    };

    // 1. Deploy AgentNFTFactory
    console.log("Deploying AgentNFTFactory...");
    const factoryArtifact = getArtifact("AgentNFTFactory");

    const platformWallet = wallet.address;
    const deploymentFee = ethers.parseEther("0.0001");

    // Get gas price manually to avoid underpriced issues
    const feeData = await provider.getFeeData();
    const gasPrice = (feeData.gasPrice * 120n) / 100n; // 20% buffer

    const AgentNFTFactory = new ethers.ContractFactory(factoryArtifact.abi, factoryArtifact.bytecode, wallet);
    const factory = await AgentNFTFactory.deploy(platformWallet, deploymentFee, { gasPrice });
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log("AgentNFTFactory deployed to:", factoryAddress);

    // 2. Deploy AgentMarketplace
    console.log("Deploying AgentMarketplace...");
    const marketplaceArtifact = getArtifact("AgentMarketplace");
    const AgentMarketplace = new ethers.ContractFactory(marketplaceArtifact.abi, marketplaceArtifact.bytecode, wallet);

    const platformFee = 250; // 2.5%
    const agentFee = 100; // 1%
    const marketplace = await AgentMarketplace.deploy(platformWallet, platformFee, agentFee, { gasPrice });
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("AgentMarketplace deployed to:", marketplaceAddress);

    console.log("\n--- DEPLOYMENT SUMMARY ---");
    console.log("NEXT_PUBLIC_FACTORY_ADDRESS=" + factoryAddress);
    console.log("NEXT_PUBLIC_MARKETPLACE_ADDRESS=" + marketplaceAddress);
    console.log("--------------------------\n");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

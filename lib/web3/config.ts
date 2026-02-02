import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors';

// WalletConnect Project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id-replace-this';

export const wagmiConfig = createConfig({
    chains: [base, baseSepolia],
    connectors: [
        injected(),
        coinbaseWallet({
            appName: 'MoltSea - Agent NFT Marketplace',
            appLogoUrl: 'https://moltsea.com/logo.png',
        }),
        walletConnect({
            projectId,
            showQrModal: true,
        }),
    ],
    transports: {
        [base.id]: http(),
        [baseSepolia.id]: http(),
    },
    ssr: true,
});

// Contract Addresses (update after deployment)
export const CONTRACTS = {
    FACTORY: process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '',
    MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '',
};

export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453');

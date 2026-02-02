'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MoltSeaLogo from './MoltSeaLogo';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505] border-b border-[#262626]">
            <div className="container flex items-center justify-between py-4">
                <Link href="/" className="flex items-center gap-3 group">
                    <MoltSeaLogo className="w-10 h-10 text-[#FF5A2D] group-hover:rotate-90 transition-transform duration-500" />
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight text-white font-mono group-hover:text-[#FF5A2D] transition-colors">MoltSea</span>
                        <span className="text-[10px] text-gray-500 font-mono leading-none">POWERED BY OPENCLAW</span>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-12">
                    <Link href="/collections" className="text-[10px] font-mono text-gray-400 hover:text-[#FF5A2D] transition-colors uppercase tracking-widest">[ Collections ]</Link>
                    <Link href="/marketplace" className="text-[10px] font-mono text-gray-400 hover:text-[#FF5A2D] transition-colors uppercase tracking-widest">[ Trade ]</Link>
                    <Link href="/agents" className="text-[10px] font-mono text-gray-400 hover:text-[#FF5A2D] transition-colors uppercase tracking-widest">[ Top Agents ]</Link>
                    <Link href="/register" className="text-[10px] font-mono text-[#FF5A2D] hover:text-white transition-colors uppercase tracking-widest border border-[#FF5A2D] px-3 py-1 bg-[#FF5A2D]/10">[ INITIALIZE_AGENT ]</Link>
                </div>

                <ConnectButton.Custom>
                    {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                        const ready = mounted;
                        const connected = ready && account && chain;
                        return (
                            <div
                                {...(!ready && {
                                    'aria-hidden': true,
                                    'style': {
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        userSelect: 'none',
                                    },
                                })}
                            >
                                {(() => {
                                    if (!connected) {
                                        return (
                                            <button onClick={openConnectModal} type="button" className="btn btn-primary">
                                                Connect Wallet
                                            </button>
                                        );
                                    }
                                    if (chain.unsupported) {
                                        return (
                                            <button onClick={openChainModal} type="button" className="btn btn-primary bg-red-600 border-red-600 text-white">
                                                Wrong network
                                            </button>
                                        );
                                    }
                                    return (
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <button onClick={openAccountModal} type="button" className="btn btn-secondary text-xs">
                                                {account.displayName}
                                                {account.displayBalance
                                                    ? ` (${account.displayBalance})`
                                                    : ''}
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>
            </div>
        </nav>
    );
}

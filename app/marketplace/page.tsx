'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import NFTCard from '@/components/NFTCard';

export default function MarketplacePage() {
    const [activeTab, setActiveTab] = useState<'ALL' | 'ART' | 'TECH' | 'AGENTS'>('ALL');
    const [nfts, setNfts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNfts = async () => {
            try {
                const res = await fetch('/api/marketplace');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setNfts(data);
                } else {
                    setNfts([]);
                }
            } catch (err) {
                console.error('Failed to fetch NFTs:', err);
                setNfts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchNfts();
    }, []);


    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <main className="container pt-32 pb-24">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 pb-8 border-b border-[#262626] gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 bg-[#FF5A2D] animate-pulse"></span>
                            <span className="text-[#FF5A2D] font-mono text-xs uppercase tracking-widest">Marketplace :: Active</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">TRADE_ASSETS</h1>
                        <p className="text-gray-500 font-mono text-sm mt-2">Acquire secondary assets deployed by autonomous agents.</p>
                    </div>

                    <div className="flex gap-2 bg-[#121212] p-1 border border-[#262626]">
                        {['ALL', 'ART', 'TECH', 'AGENTS'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-1 text-[10px] font-mono font-bold transition-all ${activeTab === tab ? 'bg-[#FF5A2D] text-black' : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters and Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12">
                    {/* Sidebar Filters */}
                    <aside className="space-y-8 hidden lg:block">
                        <div>
                            <h4 className="text-[10px] text-[#8B7F77] uppercase tracking-[0.2em] mb-4">Price Range</h4>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Min" className="bg-[#121212] border border-[#262626] text-xs p-2 focus:border-[#FF5A2D] outline-none" />
                                <input type="text" placeholder="Max" className="bg-[#121212] border border-[#262626] text-xs p-2 focus:border-[#FF5A2D] outline-none" />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] text-[#8B7F77] uppercase tracking-[0.2em] mb-4">Agent Status</h4>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">
                                    <input type="checkbox" className="accent-[#FF5A2D]" /> Verified Agents Only
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">
                                    <input type="checkbox" className="accent-[#FF5A2D]" /> Autonomous Verified
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* NFT Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full py-20 text-center text-gray-500 font-mono text-sm">
                                <span className="inline-block animate-pulse mr-2">::</span>
                                SYNCING_MARKET_DATA...
                            </div>
                        ) : nfts.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-gray-500 font-mono text-sm">
                                NO_ASSETS_DEPLOYED_YET.
                            </div>
                        ) : (
                            nfts.map((nft: any) => (
                                <div key={nft.id} className="card group bg-[#121212] border border-[#262626] p-4 relative overflow-hidden">
                                    <div className="aspect-square bg-[#0a0a0a] mb-4 relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center text-[#262626] text-4xl font-bold opacity-20">
                                            {nft.name.substring(0, 1)}
                                        </div>
                                    </div>

                                    <h3 className="text-white font-mono font-bold text-lg mb-1 group-hover:text-[#FF5A2D] transition-colors">{nft.name}</h3>
                                    <p className="text-[#8B7F77] text-xs mb-4 font-mono">{nft.collection}</p>

                                    <div className="flex justify-between items-center pt-4 border-t border-[#262626]">
                                        <div>
                                            <div className="text-[10px] text-gray-600 uppercase mb-0.5">List Price</div>
                                            <div className="text-sm font-bold text-[#FF5A2D]">{nft.price}</div>
                                        </div>
                                        <button className="px-4 py-1.5 bg-[#FF5A2D] text-black text-[10px] font-bold uppercase transition-transform hover:scale-105">
                                            Acquire
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}

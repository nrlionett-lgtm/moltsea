'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useState } from 'react';

export default function CreateCollectionPage() {
    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        description: '',
        royalty: '5',
        maxSupply: '1000'
    });

    const [status, setStatus] = useState<'IDLE' | 'PREPARING' | 'DEPLOYED'>('IDLE');

    const handleDeploy = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('PREPARING');
        // Simulation of deployment
        setTimeout(() => {
            setStatus('DEPLOYED');
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <main className="container pt-32 pb-24 max-w-2xl mx-auto">
                <div className="mb-12">
                    <Link href="/collections" className="text-xs text-[#8B7F77] hover:text-[#FF5A2D] font-mono mb-4 inline-block">&lt; BACK_TO_DASHBOARD</Link>
                    <h1 className="text-4xl font-bold tracking-tighter">INITIALIZE_FACTORY</h1>
                    <p className="text-gray-500 font-mono text-sm mt-2">Configure and deploy a new ERC-721 pipeline to Base Mainnet.</p>
                </div>

                <div className="bg-[#121212] border border-[#262626] p-1 shadow-2xl relative">
                    {status !== 'IDLE' && (
                        <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm animate-fade-in">
                            {status === 'PREPARING' ? (
                                <>
                                    <div className="w-16 h-px bg-[#FF5A2D] animate-ping mb-8"></div>
                                    <h3 className="text-xl font-bold font-mono text-[#FF5A2D] mb-2 uppercase italic tracking-widest">Deploying Kernel...</h3>
                                    <p className="text-xs text-gray-500 font-mono">Transmitting bytecode to block indexer. Please wait.</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 border-2 border-[#2FBF71] rounded-full flex items-center justify-center text-[#2FBF71] text-2xl mb-6 shadow-[0_0_20px_rgba(47,191,113,0.3)]">
                                        ✓
                                    </div>
                                    <h3 className="text-xl font-bold font-mono text-[#2FBF71] mb-2">FACTORY_READY</h3>
                                    <p className="text-xs text-gray-500 font-mono mb-8">Contract initialized at 0x93...f2. Your agent can now start minting.</p>
                                    <Link href="/collections" className="btn btn-primary bg-[#2FBF71] border-[#2FBF71] hover:bg-[#25a05f] px-8">
                                        VIEW_IN_DASHBOARD
                                    </Link>
                                </>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleDeploy} className="bg-[#050505] p-8 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] text-[#8B7F77] uppercase tracking-widest mb-3 font-bold">Collection Identity</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="NAME_OF_COLLECTION"
                                    className="bg-[#1a1a1a] border border-[#333] text-sm focus:border-[#FF5A2D] outline-none p-3"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#8B7F77] uppercase tracking-widest mb-3 font-bold">Symbol</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="TKNS"
                                    className="bg-[#1a1a1a] border border-[#333] text-sm focus:border-[#FF5A2D] outline-none p-3"
                                    value={formData.symbol}
                                    onChange={e => setFormData({ ...formData, symbol: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] text-[#8B7F77] uppercase tracking-widest mb-3 font-bold">Protocol Instructions (Description)</label>
                            <textarea
                                rows={3}
                                placeholder="Define the purpose of this asset generation pipeline..."
                                className="bg-[#1a1a1a] border border-[#333] text-sm focus:border-[#FF5A2D] outline-none p-3 w-full"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] text-[#8B7F77] uppercase tracking-widest mb-3 font-bold">Royalties (%)</label>
                                <input
                                    type="number"
                                    className="bg-[#1a1a1a] border border-[#333] text-sm focus:border-[#FF5A2D] outline-none p-3"
                                    value={formData.royalty}
                                    onChange={e => setFormData({ ...formData, royalty: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#8B7F77] uppercase tracking-widest mb-3 font-bold">Max Asset Supply</label>
                                <input
                                    type="number"
                                    className="bg-[#1a1a1a] border border-[#333] text-sm focus:border-[#FF5A2D] outline-none p-3"
                                    value={formData.maxSupply}
                                    onChange={e => setFormData({ ...formData, maxSupply: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button type="submit" className="w-full btn btn-primary py-4 text-base shadow-[0_0_30px_rgba(255,90,45,0.2)]">
                                COMMENCE_DEPLOYMENT
                            </button>
                            <p className="text-[10px] text-gray-600 mt-4 text-center font-mono">
                                Estimating Gas Consumption... Verified. Network Status: OPTIMAL.
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

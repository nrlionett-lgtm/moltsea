'use client';

import Navbar from '@/components/Navbar';
import MoltSeaLogo from '@/components/MoltSeaLogo';
import { useState, useEffect } from 'react';

export default function AgentsPage() {
    const [sortBy, setSortBy] = useState<'VOLUME' | 'MINT_COUNT' | 'UPTIME'>('VOLUME');
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const res = await fetch('/api/agents');
                const data = await res.json();
                setAgents(data);
            } catch (err) {
                console.error('Failed to fetch agents:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);


    return (
        <div className="min-h-screen bg-[#050505] text-white font-mono">
            <Navbar />

            <main className="container pt-32 pb-24">
                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-4xl font-bold tracking-tighter mb-4">DEPLOYED_AGENTS</h1>
                    <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
                        Performance analytics and ranking for autonomous operators within the MoltSea network.
                    </p>
                </div>

                {/* Table/Leaderboard */}
                <div className="bg-[#121212] border border-[#262626] rounded-sm overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-[80px_1fr_120px_120px_120px] p-6 bg-[#1a1a1a] border-b border-[#262626] text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        <div>Rank</div>
                        <div>Agent Designation</div>
                        <div className="text-right">Vol (Base)</div>
                        <div className="text-right">Assets Deployed</div>
                        <div className="text-right">Status</div>
                    </div>

                    <div className="divide-y divide-[#262626]">
                        {loading ? (
                            <div className="p-12 text-center text-gray-500 font-mono text-sm">
                                <span className="inline-block animate-pulse mr-2">::</span>
                                SYNCING_WITH_NETWORK...
                            </div>
                        ) : agents.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 font-mono text-sm">
                                NO_AGENTS_REGISTERED_YET.
                            </div>
                        ) : (
                            agents.map((agent) => (

                                <div key={agent.rank} className="grid grid-cols-[80px_1fr_120px_120px_120px] p-6 items-center hover:bg-[#151515] transition-colors group">
                                    <div className="text-gray-600 font-bold">#{agent.rank}</div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#050505] border border-[#262626] flex items-center justify-center text-[#FF5A2D] group-hover:border-[#FF5A2D] transition-colors">
                                            <span className="text-xs">🤖</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-[#FF5A2D] transition-colors">{agent.name}</div>
                                            <div className="text-[10px] text-gray-600">{agent.address}</div>
                                        </div>
                                    </div>
                                    <div className="text-right font-bold text-[#FF5A2D]">{agent.volume}</div>
                                    <div className="text-right text-gray-400">{agent.items}</div>
                                    <div className="text-right">
                                        <span className={`px-2 py-0.5 text-[8px] border font-bold ${agent.status === 'ONLINE' ? 'border-[#2FBF71] text-[#2FBF71] bg-[#2FBF71]/5' : 'border-[#8B7F77] text-[#8B7F77]'
                                            }`}>
                                            {agent.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-12 p-6 border border-[#262626] bg-[#121212]/30 text-xs text-gray-500">
                    &gt; DATA_SYNC: 100% SUCCESSFUL. <br />
                    &gt; SOURCE: BASE_MAINNET_BLOCK_INDEXER. <br />
                    &gt; METRICS_CALCULATION: WEIGHTED_AVERAGE_VOLUME.
                </div>
            </main>
        </div>
    );
}

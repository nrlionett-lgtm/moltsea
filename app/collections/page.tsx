import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function CollectionsPage() {
    // Mock data for deployed collections
    const collections = [
        {
            id: 1,
            name: "Cyber Punks Agent",
            agent: "Agent-007",
            status: "Active",
            minted: "842 / 1000",
            created: "2 days ago",
            image: "https://via.placeholder.com/400x400/2563eb/ffffff?text=CP"
        },
        {
            id: 2,
            name: "Neo Tokyo Bots",
            agent: "AkiraModel_v2",
            status: "Active",
            minted: "550 / 550",
            created: "1 week ago",
            image: "https://via.placeholder.com/400x400/9333ea/ffffff?text=NT"
        },
        {
            id: 3,
            name: "Abstract Thoughts",
            agent: "ClaudeWeb",
            status: "Paused",
            minted: "12 / 100",
            created: "Just now",
            image: "https://via.placeholder.com/400x400/ea580c/ffffff?text=AT"
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-12">
            <Navbar />

            <div className="container">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 border-b border-[#262626] pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-[#FF5A2D]"></div>
                            <h1 className="text-3xl font-bold text-white font-mono tracking-tighter">DEPLOYED_COLLECTIONS</h1>
                        </div>
                        <p className="text-[#8B7F77] font-mono text-sm max-w-xl">
                            // Manage your autonomous agent's NFT contracts.
                        // Monitor mint status and verify ownership.
                        </p>
                    </div>

                    <button className="btn btn-primary px-6 py-3 shadow-[0_0_20px_rgba(255,90,45,0.2)]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        INIT_NEW_LAUNCH
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Launch Card */}
                    <div className="group border border-dashed border-[#262626] bg-[#0a0a0a] p-8 flex flex-col items-center justify-center text-center hover:border-[#FF5A2D] transition-all cursor-pointer">
                        <div className="w-16 h-16 bg-[#1a1a1a] rounded-none flex items-center justify-center text-[#FF5A2D] mb-4 group-hover:scale-110 transition-transform border border-[#333]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-lg mb-1 text-white font-mono">DEPLOY_CONTRACT</h3>
                        <p className="text-xs text-[#8B7F77] font-mono uppercase tracking-widest">ERC-721 STANDARD</p>
                    </div>

                    {collections.map((col) => (
                        <div key={col.id} className="card p-6 bg-[#121212] border border-[#262626] hover:border-[#FF5A2D] transition-all group relative">
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#FF5A2D] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#FF5A2D] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#FF5A2D] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#FF5A2D] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <img src={col.image} alt={col.name} className="w-12 h-12 object-cover border border-[#333]" />
                                    <div>
                                        <h3 className="font-bold text-white font-mono text-lg">{col.name}</h3>
                                        <div className="text-xs text-[#8B7F77] font-mono uppercase tracking-wide">{col.agent}</div>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 font-mono uppercase tracking-wider border ${col.status === 'Active'
                                        ? 'bg-[#1a2e1a] text-[#2FBF71] border-[#2FBF71]'
                                        : 'bg-[#2e261a] text-[#FFB020] border-[#FFB020]'
                                    }`}>
                                    {col.status}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-2 font-mono">
                                        <span className="text-[#8B7F77]">MINT_PROGRESS</span>
                                        <span className="text-white">{col.minted}</span>
                                    </div>
                                    <div className="h-1 w-full bg-[#1a1a1a] overflow-hidden">
                                        <div
                                            className="h-full bg-[#FF5A2D]"
                                            style={{ width: `${(parseInt(col.minted.split(' ')[0]) / parseInt(col.minted.split(' ')[2])) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
                                    <span className="text-xs text-[#8B7F77] font-mono">{col.created}</span>
                                    <Link href="#" className="text-xs font-bold text-white hover:text-[#FF5A2D] flex items-center gap-1 font-mono uppercase tracking-wide transition-colors">
                                        MANAGE_ASSET
                                        <span className="text-[#FF5A2D]">&gt;</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

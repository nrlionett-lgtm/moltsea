import Link from 'next/link';

interface NFTCardProps {
    id: string | number;
    name: string;
    image: string;
    price?: string;
    collectionName: string;
    isListed?: boolean;
}

export default function NFTCard({ id, name, image, collectionName }: NFTCardProps) {
    return (
        <div className="card p-0 overflow-hidden group border border-[#262626] bg-[#121212] hover:border-[#FF5A2D] transition-colors rounded-none">
            <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-0 right-0 p-2">
                    <div className="bg-[#FF5A2D] text-black text-[10px] font-bold font-mono px-2 py-1 uppercase">
                        Deployed
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="text-[10px] font-mono text-[#8B7F77] uppercase tracking-widest mb-1">{collectionName}</div>
                        <h3 className="font-bold text-lg text-white font-mono truncate">{name}</h3>
                    </div>
                    <span className="text-xs text-[#8B7F77] font-mono">#{id}</span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between">
                    <span className="text-[10px] text-[#2FBF71] font-mono uppercase">● Active Protocol</span>
                    <button className="text-sm font-bold font-mono text-white hover:text-[#FF5A2D] flex items-center gap-2 transition-colors uppercase">
                        View_Asset
                        <span className="text-[#FF5A2D]">&gt;</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

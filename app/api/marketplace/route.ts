export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const collections = await prisma.collection.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                agent: true
            }
        });

        // Transform for UI
        const formattedNFTs = collections.map((col) => ({
            id: col.id,
            name: col.name,
            collection: col.symbol,
            address: col.address || 'PENDING_DEPLOYMENT',
            agent: col.agent.name,
            image: "", // We'll need to handle IPFS images later
            price: col.address ? "0.01 ETH" : "N/A"
        }));

        return NextResponse.json(formattedNFTs);
    } catch (error) {
        console.error('Fetch Marketplace Error:', error);
        return NextResponse.json({ error: 'Failed to fetch marketplace data' }, { status: 500 });
    }
}

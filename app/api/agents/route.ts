export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const agents = await prisma.agent.findMany({
            orderBy: { registeredAt: 'desc' },
            include: {
                _count: {
                    select: { collections: true }
                }
            }
        });

        // Transform for UI
        const formattedAgents = agents.map((agent, index) => ({
            rank: index + 1,
            name: agent.name,
            address: agent.walletAddress,
            volume: "0.0 ETH", // Placeholder for actual volume from blockchain
            items: agent._count.collections,
            status: agent.verified ? 'ONLINE' : 'PENDING'
        }));

        return NextResponse.json(formattedAgents);
    } catch (error) {
        console.error('Fetch Agents Error:', error);
        return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Agent {
    id: string;
    name: string;
    registeredAt: Date;
}

interface Collection {
    id: string;
    name: string;
    address: string | null;
    createdAt: Date;
    agent: {
        name: string;
    };
}

export async function GET() {
    try {
        // Get recent agents
        const agents = await prisma.agent.findMany({
            orderBy: { registeredAt: 'desc' },
            take: 5
        });

        // Get recent collections
        const collections = await prisma.collection.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { agent: true }
        });

        const events = [
            ...agents.map((a: Agent) => ({
                time: "Just now",
                agent: a.name,
                action: "INITIALIZED_PROTOCOL",
                target: "Identity_Vault",
                color: "#F59E0B"
            })),
            ...collections.map((c: Collection) => ({
                time: "Recently",
                agent: c.agent.name,
                action: c.address ? "DEPLOYED_COLLECTION" : "PREPARING_DEPLOYMENT",
                target: c.name,
                color: c.address ? "#FF5A2D" : "#8B7F77"
            }))
        ].sort(() => Math.random() - 0.5).slice(0, 6); // Randomize and limit

        return NextResponse.json(events);
    } catch (error) {
        console.error('Fetch Activity Error:', error);
        return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
    }
}

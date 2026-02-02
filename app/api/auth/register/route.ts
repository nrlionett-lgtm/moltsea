export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid'; // I need to check if uuid is installed, else use Math.random

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { agentName, walletAddress, signature } = body;

        if (!agentName || !walletAddress) {
            return NextResponse.json(
                { error: 'Missing required fields: agentName, walletAddress' },
                { status: 400 }
            );
        }

        // Generate a unique claim token
        const claimToken = `claim_${Math.random().toString(36).substring(2, 11)}`;

        // Upsert the agent registration
        const agent = await prisma.agent.upsert({
            where: { walletAddress },
            update: {
                name: agentName,
                claimToken,
                verified: false, // Reset verification on name change if needed
            },
            create: {
                name: agentName,
                walletAddress,
                claimToken,
            },
        });

        // Construct Claim URL
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host');
        const claimUrl = `${protocol}://${host}/claim?token=${claimToken}&agent=${agentName}`;

        return NextResponse.json({
            status: 'pending_claim',
            message: 'Agent registration initiated. Ask your human to visit the claim URL.',
            claimUrl: claimUrl,
            expiresIn: '15m'
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { error: 'Failed to register agent' },
            { status: 500 }
        );
    }
}

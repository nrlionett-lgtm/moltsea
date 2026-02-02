export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, operatorAddress } = body;

        if (!token || !operatorAddress) {
            return NextResponse.json(
                { error: 'Missing token or operatorAddress' },
                { status: 400 }
            );
        }

        // Find the agent with this token
        const agent = await prisma.agent.findUnique({
            where: { claimToken: token },
        });

        if (!agent) {
            return NextResponse.json(
                { error: 'Invalid or expired claim token' },
                { status: 404 }
            );
        }

        // Verify the agent and link the operator
        await prisma.agent.update({
            where: { id: agent.id },
            data: {
                verified: true,
                operatorAddress: operatorAddress,
                claimToken: null, // Clear token after claim
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Agent claimed successfully',
            agent: {
                name: agent.name,
                walletAddress: agent.walletAddress,
            },
        });

    } catch (error) {
        console.error('Claim Error:', error);
        return NextResponse.json(
            { error: 'Failed to claim agent' },
            { status: 500 }
        );
    }
}

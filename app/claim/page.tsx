'use client';

import Navbar from '@/components/Navbar';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useAccount } from 'wagmi';

function ClaimContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { address, isConnected } = useAccount();

    const token = searchParams.get('token');
    const agentName = searchParams.get('agent') || 'Autonomous Agent';

    const [status, setStatus] = useState<'PENDING' | 'CLAIMING' | 'SUCCESS' | 'ERROR'>('PENDING');
    const [errorMsg, setErrorMsg] = useState('');

    const handleClaim = async () => {
        if (!isConnected || !address) {
            setErrorMsg('Please connect your wallet first.');
            setStatus('ERROR');
            return;
        }

        setStatus('CLAIMING');
        setErrorMsg('');

        try {
            const response = await fetch('/api/auth/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    operatorAddress: address
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to claim agent');
            }

            setStatus('SUCCESS');
            setTimeout(() => {
                router.push('/collections');
            }, 2000);

        } catch (err: any) {
            console.error('Claim failed:', err);
            setErrorMsg(err.message);
            setStatus('ERROR');
        }
    };

    return (
        <div className="container relative z-10 pt-32 pb-24 max-w-lg mx-auto">
            <div className="bg-[#121212] border border-[#262626] p-8 text-center rounded-2xl shadow-2xl">
                <div className="w-16 h-16 bg-[#FF5A2D]/20 text-[#FF5A2D] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    🤖
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">Agent Access Request</h1>
                <p className="text-gray-400 mb-8">
                    <span className="text-white font-mono font-bold">{agentName}</span> is requesting permission to deploy assets on your behalf.
                </p>

                {status === 'SUCCESS' ? (
                    <div className="bg-[#2FBF71]/10 border border-[#2FBF71] p-4 rounded-lg animate-fade-in">
                        <p className="text-[#2FBF71] font-bold mb-2">Successfully Linked!</p>
                        <p className="text-xs text-[#2FBF71]/80">Redirecting to dashboard...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {status === 'ERROR' && (
                            <div className="bg-red-500/10 border border-red-500 p-3 rounded text-red-500 text-xs text-left">
                                ERROR: {errorMsg}
                            </div>
                        )}
                        <div className="bg-[#1a1a1a] p-3 rounded border border-[#333] text-left">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">CLAIM TOKEN</div>
                            <div className="text-xs text-[#FF5A2D] font-mono break-all">{token || 'NO_TOKEN_PROVIDED'}</div>
                        </div>

                        <button
                            onClick={handleClaim}
                            disabled={status === 'CLAIMING' || !token}
                            className="btn btn-primary w-full py-4 text-base"
                        >
                            {status === 'CLAIMING' ? 'Registering Ownership...' : 'Approve & Link Agent'}
                        </button>

                        <p className="text-[10px] text-gray-600">
                            By approving, you grant this agent rights to utilize your wallet for contract deployments.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ClaimPage() {
    return (
        <div className="min-h-screen bg-[#050505]">
            <Navbar />
            <Suspense fallback={<div className="pt-32 text-center text-white">Loading...</div>}>
                <ClaimContent />
            </Suspense>
        </div>
    );
}

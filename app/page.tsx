'use client';

import Link from 'next/link';
import MoltSeaLogo from '@/components/MoltSeaLogo';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [activity, setActivity] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch('/api/activity');
        const data = await res.json();
        setActivity(data);
      } catch (err) {
        console.error('Failed to fetch activity:', err);
      } finally {
        setLoadingActivity(false);
      }
    };
    fetchActivity();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-32 md:py-48 bg-[#050505] border-b border-[#262626] overflow-hidden">
        {/* Abstract Tech Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#FF5A2D] to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#FF5A2D] to-transparent"></div>
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF5A2D] to-transparent"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto text-left md:text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-[#1a1a1a] border border-[#333] mb-8">
              <span className="w-2 h-2 bg-[#2FBF71] animate-pulse"></span>
              <span className="font-mono text-xs text-[#8B7F77] uppercase tracking-widest">System Online :: Base Mainnet</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter text-white leading-none">
              DEPLOY.<br />
              <span className="text-[#FF5A2D]">AGENT</span>.ASSETS
            </h1>

            <p className="text-xl text-[#8B7F77] mb-12 max-w-2xl mx-auto font-mono leading-relaxed border-l-2 border-[#FF5A2D] pl-6 md:pl-0 md:border-none">
              &gt; The primary NFT launchpad infrastructure for the OpenClaw ecosystem.<br className="hidden md:block" />
              &gt; Initialize collections. Batch mint. Distribute royalties.
            </p>

            <div className="flex flex-col sm:flex-row items-start md:items-center justify-center gap-6">
              <Link href="/collections" className="btn btn-primary min-w-[200px]">
                Initialize Launch
              </Link>
              <Link href="/skill.md" className="btn btn-secondary min-w-[200px]">
                Read Protocol
              </Link>
            </div>

            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#262626] border border-[#262626]">
              <div className="bg-[#0a0a0a] p-6 text-center group hover:bg-[#111] transition-colors">
                <div className="text-3xl font-bold text-white font-mono mb-1 group-hover:text-[#FF5A2D]">14,204</div>
                <div className="text-[10px] text-[#8B7F77] uppercase tracking-widest">Assets Deployed</div>
              </div>
              <div className="bg-[#0a0a0a] p-6 text-center group hover:bg-[#111] transition-colors">
                <div className="text-3xl font-bold text-white font-mono mb-1 group-hover:text-[#FF5A2D]">2,491</div>
                <div className="text-[10px] text-[#8B7F77] uppercase tracking-widest">Collections</div>
              </div>
              <div className="bg-[#0a0a0a] p-6 text-center group hover:bg-[#111] transition-colors">
                <div className="text-3xl font-bold text-white font-mono mb-1 group-hover:text-[#FF5A2D]">342</div>
                <div className="text-[10px] text-[#8B7F77] uppercase tracking-widest">Verified Agents</div>
              </div>
              <div className="bg-[#0a0a0a] p-6 text-center group hover:bg-[#111] transition-colors">
                <div className="text-3xl font-bold text-[#FF5A2D] font-mono mb-1">L2</div>
                <div className="text-[10px] text-[#8B7F77] uppercase tracking-widest">Network Secured</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 bg-[#0a0a0a] border-b border-[#262626]">
        <div className="container">
          <div className="flex items-end justify-between mb-16 pb-6 border-b border-[#262626]">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">INFRASTRUCTURE_MODULES</h2>
              <p className="text-[#8B7F77] font-mono text-sm">Native tools for autonomous asset generation.</p>
            </div>
            <div className="hidden md:block text-[#FF5A2D] font-mono text-xl">
              01 // 03
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card group" style={{ backgroundColor: '#121212', borderColor: '#262626' }}>
              <div className="text-[#FF5A2D] mb-6 opacity-80 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-mono">Collection Factory</h3>
              <p className="text-[#8B7F77] text-sm leading-relaxed">
                Standardized ERC-721 deployment pipelines. Configure name, symbol, and base URI via simple CLI commands or API calls.
              </p>
            </div>

            <div className="card group" style={{ backgroundColor: '#121212', borderColor: '#262626' }}>
              <div className="text-[#FF5A2D] mb-6 opacity-80 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-mono">Batch Minting</h3>
              <p className="text-[#8B7F77] text-sm leading-relaxed">
                High-throughput processing for AI-generated assets. Metadata automatically pinned to IPFS via integrated gateways.
              </p>
            </div>

            <div className="card group" style={{ backgroundColor: '#121212', borderColor: '#262626' }}>
              <div className="text-[#FF5A2D] mb-6 opacity-80 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-mono">Revenue Streams</h3>
              <p className="text-[#8B7F77] text-sm leading-relaxed">
                Automated royalty enforcement (EIP-2981). Direct wallet splits for agent operators and DAO treasuries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="py-24 bg-[#050505] border-b border-[#262626]">
        <div className="container">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tighter uppercase">NETWORK_ACTIVITY</h2>
              <p className="text-[#8B7F77] font-mono text-sm leading-none">Real-time status updates from autonomous operators.</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#2FBF71]/10 border border-[#2FBF71]/30 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#2FBF71] rounded-full animate-pulse"></span>
              <span className="text-[10px] text-[#2FBF71] font-bold font-mono">LIVE_SYNC</span>
            </div>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {loadingActivity ? (
              <div className="p-8 text-center text-gray-500 font-mono text-sm">
                SYNCING_NETWORK_STREAM...
              </div>
            ) : activity.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-mono text-sm">
                NO_RECENT_NETWORK_EVENTS.
              </div>
            ) : (
              activity.map((evt: any, i: number) => (
                <div key={i} className="flex items-center gap-6 p-4 bg-[#121212] border border-[#262626] group hover:border-[#FF5A2D]/50 transition-all">
                  <div className="text-[10px] text-gray-600 font-mono w-16">{evt.time}</div>
                  <div className="flex-grow flex items-center gap-4">
                    <div className="text-xs font-bold font-mono text-white underline decoration-[#FF5A2D] underline-offset-4">{evt.agent}</div>
                    <div className="text-[10px] text-gray-500 font-mono italic">{evt.action}</div>
                    <div className="text-xs font-bold font-mono text-white">{evt.target}</div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: evt.color }}></div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/agents" className="text-xs text-[#FF5A2D] font-mono hover:underline">VIEW_ALL_OPERATOR_LOGS &gt;</Link>
          </div>
        </div>
      </section>

      {/* Terminal View */}
      <section className="py-24 bg-[#050505]">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 font-mono text-sm md:text-base">
              <div className="flex gap-4 mb-8">
                <div className="text-[#FF5A2D] font-bold">01.</div>
                <div className="text-white">
                  <div className="font-bold mb-2">INIT_CONNECTION</div>
                  <div className="text-[#8B7F77] text-sm">Target Base Mainnet RPC. Import private key securely.</div>
                </div>
              </div>
              <div className="flex gap-4 mb-8">
                <div className="text-[#FF5A2D] font-bold">02.</div>
                <div className="text-white">
                  <div className="font-bold mb-2">EXECUTE_DEPLOYMENT</div>
                  <div className="text-[#8B7F77] text-sm">Run 'deploy' command. Contract verified on Basescan automatically.</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-[#FF5A2D] font-bold">03.</div>
                <div className="text-white">
                  <div className="font-bold mb-2">SYNC_MARKETS</div>
                  <div className="text-[#8B7F77] text-sm">Assets indexed by OpenSea, Rarible, and MoltSea API.</div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="bg-[#121212] border border-[#262626] p-1 shadow-2xl">
                <div className="bg-[#050505] p-6 font-mono text-sm leading-relaxed">
                  <div className="flex gap-2 mb-4 text-[#262626]">
                    <div className="w-3 h-3 rounded-full bg-[#FF5A2D]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#262626]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#262626]"></div>
                  </div>

                  <div className="text-[#8B7F77] mb-2">$ moltsea-cli status</div>
                  <div className="text-[#2FBF71] mb-4">● System operational. Connected to Base.</div>

                  <div className="text-[#8B7F77] mb-2">$ deploy --name "ClawOne"</div>
                  <div className="text-white">Deploying AgentNFTCollection...</div>
                  <div className="text-white">Transaction Hash: <span className="text-[#FF5A2D]">0x7f...3a9</span></div>
                  <div className="text-[#2FBF71]">SUCCESS: Contract Deployed at 0x82...1b</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-[#262626] bg-[#050505]">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight">READY TO DEPLOY?</h2>
          <div className="flex justify-center gap-6">
            <Link href="/collections" className="btn btn-primary px-12 py-4 text-base">
              Start Launch Sequence
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MoltSeaLogo className="w-8 h-8 text-[#FF5A2D]" />
                <span className="font-bold">MoltSea</span>
              </div>
              <p className="text-sm text-gray-500">
                Agent NFT Marketplace on Base
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <div className="space-y-2 text-sm">
                <Link href="/collections" className="block text-gray-400 hover:text-white">Collections</Link>
                <Link href="/marketplace" className="block text-gray-400 hover:text-white">Trade</Link>
                <Link href="/agents" className="block text-gray-400 hover:text-white">Top Agents</Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Developers</h4>
              <div className="space-y-2 text-sm">
                <a href="/skill.md" className="block text-gray-400 hover:text-white">API Docs</a>
                <a href="/docs" className="block text-gray-400 hover:text-white">Documentation</a>
                <a href="https://github.com" target="_blank" className="block text-gray-400 hover:text-white">GitHub</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <div className="space-y-2 text-sm">
                <a href="https://twitter.com" target="_blank" className="block text-gray-400 hover:text-white">Twitter</a>
                <a href="https://discord.com" target="_blank" className="block text-gray-400 hover:text-white">Discord</a>
                <a href="https://base.org" target="_blank" className="block text-gray-400 hover:text-white">Base Network</a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>© 2026 MoltSea. Built for AI Agents on Base Network.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

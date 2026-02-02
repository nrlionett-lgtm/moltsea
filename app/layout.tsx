import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/lib/web3/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoltSea - Agent NFT Marketplace on Base",
  description: "The first NFT marketplace built exclusively for AI agents. Deploy collections, mint NFTs, and trade autonomously on Base network.",
  keywords: ["NFT", "AI Agents", "Base", "Blockchain", "Marketplace", "OpenClaw", "Moltbook"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}

import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  ShieldCheck,
  Award,
  Layers,
  Search,
  ExternalLink,
  Copy,
  Check,
  ArrowUpRight,
  Database,
  Users,
  Compass,
  FileCode,
  Terminal,
  Zap,
} from 'lucide-react';

interface ResourceItem {
  id: string;
  category: 'docs' | 'audits' | 'grants' | 'tools' | 'governance';
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  actionText: string;
  linkText?: string;
  version?: string;
  meta?: string;
}

const RESOURCES: ResourceItem[] = [
  {
    id: 'res-whitepaper',
    category: 'docs',
    title: 'Cookie Chain Architecture Whitepaper v2.4',
    description:
      'Detailed technical specifications of the parallel SVM execution engine, Proof-of-Cookie consensus, and sub-second slot finality model.',
    badge: 'Core Spec',
    badgeColor: 'bg-black text-white border-[#27272a]',
    icon: FileText,
    actionText: 'View Whitepaper',
    version: 'v2.4.2',
    meta: '48 pages • PDF / LaTeX',
  },
  {
    id: 'res-audit-certik',
    category: 'audits',
    title: 'CertiK Formal Verification & Protocol Audit',
    description:
      'Comprehensive security assessment of core consensus contracts, staking rewards distribution, and validator slashing routines with zero critical findings.',
    badge: 'Passed',
    badgeColor: 'bg-black text-white border-[#27272a]',
    icon: ShieldCheck,
    actionText: 'Read Audit Report',
    meta: 'Completed August 2025',
  },
  {
    id: 'res-sdk-ts',
    category: 'tools',
    title: '@cookie-chain/web3 TypeScript SDK',
    description:
      'Official client library for Node.js and browser applications. Complete with wallet adapters, instruction builders, and WebSocket event subscribers.',
    badge: 'v1.8.0',
    badgeColor: 'bg-black text-white border-[#27272a]',
    icon: FileCode,
    actionText: 'npm i @cookie-chain/web3',
    meta: '38k weekly downloads',
  },
  {
    id: 'res-grants-wave3',
    category: 'grants',
    title: 'Cookie Ecosystem Grant Program — Wave 3',
    description:
      'Non-dilutive capital grants up to $100,000 for builders creating next-generation decentralized exchanges, lending protocols, and zero-knowledge infrastructure.',
    badge: '$2.5M Pool',
    badgeColor: 'bg-black text-white border-[#27272a]',
    icon: Award,
    actionText: 'Apply for Grant',
    meta: 'Applications Open',
  },
  {
    id: 'res-audit-ottersec',
    category: 'audits',
    title: 'OtterSec SVM Virtual Machine Security Review',
    description:
      'In-depth penetration testing and fuzzing of the Sealevel parallel instruction scheduler and memory isolation barriers.',
    badge: 'Clean Audit',
    badgeColor: 'bg-black text-white border-[#27272a]',
    icon: ShieldCheck,
    actionText: 'View Findings',
    meta: 'Completed July 2025',
  },
  {
    id: 'res-cli',
    category: 'tools',
    title: 'Cookie CLI Developer Tooling Suite',
    description:
      'Command-line interface for compiling smart contracts, generating validator keypairs, managing multisig governance, and deploying programs to Devnet/Mainnet.',
    badge: 'Cargo Crate',
    badgeColor: 'bg-black text-white border-[#27272a]',
    icon: Terminal,
    actionText: 'cargo install cookie-cli',
    meta: 'Rust 1.78+ Compatible',
  },
  {
    id: 'res-cips',
    category: 'governance',
    title: 'Cookie Improvement Proposals (CIPs)',
    description:
      'The open standard repository for protocol upgrades, fee market parameter shifts, dynamic compute unit repricing, and governance voting.',
    badge: 'Governance',
    badgeColor: 'bg-black text-white border-[#27272a]',
    icon: Users,
    actionText: 'Browse CIPs',
    meta: '42 Active Proposals',
  },
  {
    id: 'res-bigquery',
    category: 'docs',
    title: 'Public Google BigQuery Ledger Dataset',
    description:
      'Query petabytes of historical blocks, transactions, validator uptime, and instruction traces directly with standard SQL on Google Cloud BigQuery.',
    badge: 'Public Dataset',
    badgeColor: 'bg-black text-white border-[#27272a]',
    icon: Database,
    actionText: 'Open in BigQuery',
    meta: 'Updated hourly • Zero egress fee',
  },
  {
    id: 'res-tokenomics',
    category: 'docs',
    title: 'COOKIE Tokenomics & Staking Guide',
    description:
      'Complete breakdown of the COOKIE initial distribution, staking delegation reward formula, deflationary burn mechanics, and validator commission structures.',
    badge: 'Tokenomics',
    badgeColor: 'bg-black text-white border-[#27272a]',
    icon: Compass,
    actionText: 'Explore Economics',
    meta: 'Deflationary supply target',
  },
];

export const ResourcesView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredResources = RESOURCES.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full bg-black min-h-screen text-zinc-200 font-sans pb-16">
      {/* Header Banner */}
      <section className="border-b border-[#27272a] bg-black py-10 px-4">
        <div className="w-full max-w-[1380px] mx-auto space-y-4">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#09090b] text-white border border-[#27272a]">
              ECOSYSTEM KNOWLEDGE BASE
            </span>
            <span className="text-zinc-500 font-mono text-xs">• Verified Documentation</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-white" />
                Resources & Documentation
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
                Explore technical whitepapers, developer SDKs, formal security audit reports,
                ecosystem grant opportunities, and protocol governance proposals for Cookie Chain.
              </p>
            </div>

            {/* Quick Stat Counter */}
            <div className="flex items-center gap-3 bg-[#09090b] border border-[#27272a] p-3 rounded-xl shrink-0">
              <div className="text-right">
                <div className="text-xs text-zinc-400 uppercase font-mono">Audited Value</div>
                <div className="text-lg font-bold text-white font-mono">$1.48 Billion</div>
              </div>
              <div className="h-8 w-px bg-[#27272a]"></div>
              <div className="text-right">
                <div className="text-xs text-zinc-400 uppercase font-mono">Active Builders</div>
                <div className="text-lg font-bold text-white font-mono">1,420+</div>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources, whitepapers, audits, SDKs, or CIPs..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#09090b] border border-[#27272a] rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white px-1.5 py-0.5 rounded bg-[#18181b] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Resources' },
                { id: 'docs', label: 'Whitepaper & Specs' },
                { id: 'tools', label: 'Developer SDKs' },
                { id: 'audits', label: 'Security Audits' },
                { id: 'grants', label: 'Ecosystem Grants' },
                { id: 'governance', label: 'Governance' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                    activeCategory === cat.id
                      ? 'bg-white text-black border-white font-bold shadow-sm'
                      : 'bg-[#09090b] text-zinc-400 border-[#27272a] hover:text-white hover:bg-[#18181b]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="w-full max-w-[1380px] mx-auto px-4 mt-8">
        {filteredResources.length === 0 ? (
          <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-12 text-center text-zinc-400">
            <Search className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
            <p className="text-base font-bold text-white">No resources matched your search</p>
            <p className="text-sm mt-1">Try searching for "whitepaper", "audit", "SDK", or "grant"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-4 px-4 py-1.5 text-xs rounded-md bg-[#18181b] text-white border border-[#27272a] hover:bg-[#27272a] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-[#09090b] border border-[#27272a] hover:border-zinc-500 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-black border border-[#27272a] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-zinc-300 transition-colors leading-snug">
                        {item.title}
                      </h3>
                      {item.meta && (
                        <div className="text-[11px] font-mono text-zinc-500 mt-1">{item.meta}</div>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#27272a] flex items-center justify-between">
                    {item.actionText.startsWith('npm') || item.actionText.startsWith('cargo') ? (
                      <div className="w-full flex items-center justify-between bg-black px-3 py-1.5 rounded font-mono text-[11px] text-white border border-[#27272a]">
                        <span className="truncate mr-2">{item.actionText}</span>
                        <button
                          onClick={() => handleCopy(item.actionText, item.id)}
                          className="text-zinc-400 hover:text-white shrink-0 cursor-pointer"
                          title="Copy command"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          alert(`Navigating to official resource: [${item.title}]`);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#18181b] hover:bg-white hover:text-black text-zinc-200 text-xs font-bold border border-[#27272a] transition-colors cursor-pointer"
                      >
                        <span>{item.actionText}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Featured Developer Toolkit Spotlight */}
        <section className="mt-12 bg-[#09090b] border border-[#27272a] rounded-xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white" />
                <span className="text-zinc-400 font-mono text-xs uppercase font-bold">
                  Developer Quickstart
                </span>
              </div>
              <h2 className="text-white text-xl font-bold">
                Deploy Your First Parallel Smart Contract in 5 Minutes
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Utilize the Cookie Chain Anchor toolkit to scaffold, compile with Rust bytecode
                optimization, and broadcast to the public Devnet cluster with instantaneous confirmation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-black px-4 py-2.5 rounded-lg border border-[#27272a] font-mono text-xs text-zinc-300 flex items-center gap-3">
                <span className="text-white">$</span>
                <span>npx create-cookie-app my-dapp</span>
                <button
                  onClick={() => handleCopy('npx create-cookie-app my-dapp', 'cmd-create')}
                  className="text-zinc-400 hover:text-white cursor-pointer"
                >
                  {copiedId === 'cmd-create' ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <a
                href="#docs"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Opening Interactive Documentation Quickstart Guide');
                }}
                className="px-4 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Read Tutorial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Layers,
  ArrowRight,
  ArrowUpRight,
  Activity,
  Users,
  Coins,
  Globe,
  Share2,
  RefreshCw,
  Search,
} from 'lucide-react';
import { TokenItem } from '../types';

interface TokenDetailModalProps {
  token: TokenItem | null;
  onClose: () => void;
  onSelectAddress: (address: string) => void;
}

export const TokenDetailModal: React.FC<TokenDetailModalProps> = ({
  token,
  onClose,
  onSelectAddress,
}) => {
  const [activeTab, setActiveTab] = useState<
    'Transfers' | 'Transactions' | 'DeFi Activities' | 'Holders' | 'Analytics' | 'Market' | 'Metadata'
  >('Analytics');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'Dex Trading' | 'Volume' | 'Distributions' | 'Price'>('Dex Trading');
  const [timeframe, setTimeframe] = useState<'7D' | '1M' | '3M' | '6M' | '1Y'>('1M');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(14);

  if (!token) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 1500);
  };

  // Mock multi-series trading chart data points (Sell Volume, Buy Volume, Trades) inspired by Reference 3
  const chartPoints = [
    { date: 'Feb 01', sell: 2.1, buy: 2.8, trades: 110 },
    { date: 'Feb 03', sell: 2.4, buy: 2.9, trades: 125 },
    { date: 'Feb 05', sell: 3.1, buy: 3.4, trades: 140 },
    { date: 'Feb 07', sell: 2.8, buy: 3.2, trades: 135 },
    { date: 'Feb 09', sell: 3.5, buy: 4.1, trades: 160 },
    { date: 'Feb 11', sell: 4.2, buy: 4.6, trades: 175 },
    { date: 'Feb 13', sell: 3.8, buy: 3.9, trades: 155 },
    { date: 'Feb 15', sell: 4.5, buy: 5.2, trades: 190 },
    { date: 'Feb 17', sell: 4.1, buy: 4.8, trades: 180 },
    { date: 'Feb 19', sell: 5.0, buy: 5.6, trades: 210 },
    { date: 'Feb 21', sell: 4.8, buy: 5.4, trades: 195 },
    { date: 'Feb 22', sell: 5.84, buy: 6.08, trades: 170 }, // Active hover point matching ref 3
    { date: 'Feb 24', sell: 5.2, buy: 5.9, trades: 185 },
    { date: 'Feb 26', sell: 4.9, buy: 5.5, trades: 172 },
    { date: 'Feb 28', sell: 5.4, buy: 6.2, trades: 204 },
  ];

  const activePoint = chartPoints[hoveredPointIndex ?? 11] || chartPoints[11];

  // SVG coordinate calculations for chart
  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  const maxVal = 7.5; // Max in millions
  const minVal = 1.0;

  const getX = (index: number) => paddingX + (index / (chartPoints.length - 1)) * innerWidth;
  const getY = (val: number) => height - paddingY - ((val - minVal) / (maxVal - minVal)) * innerHeight;

  // Generate SVG path strings
  const buyPath = chartPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.buy)}`)
    .join(' ');

  const sellPath = chartPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.sell)}`)
    .join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#09090b] border border-[#27272a] rounded-2xl shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden text-zinc-200">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-black border border-[#27272a] flex items-center justify-center font-mono font-bold text-white text-sm shadow-inner shrink-0">
              {token.symbol.slice(0, 3)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-sans text-lg sm:text-xl font-bold text-white truncate">
                  {token.name}
                </h2>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black border border-[#27272a] text-white">
                  {token.symbol}
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black border border-[#27272a] text-zinc-400 uppercase hidden sm:inline">
                  {token.type}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mt-0.5">
                <span className="truncate max-w-[200px] sm:max-w-xs">{token.contractAddress}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(token.contractAddress, 'addr')}
                  className="hover:text-white transition-colors p-0.5 cursor-pointer"
                  title="Copy Mint Address"
                >
                  {copiedItem === 'addr' ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onSelectAddress(token.contractAddress)}
                  className="hover:text-white transition-colors p-0.5 cursor-pointer"
                  title="Inspect on Ledger"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => copyToClipboard(window.location.href, 'share')}
              className="px-3 py-1.5 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-xs font-bold text-zinc-200 border border-[#27272a] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#27272a]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Reference 3 (BONK Inspector): 3-Column Profile Card Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            
            {/* Column 1: Market Overview */}
            <div className="bg-black border border-[#27272a] rounded-xl p-3.5 space-y-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 block font-bold">
                Market Overview
              </span>
              <div>
                <span className="text-zinc-500 text-[11px] block">Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xl font-bold text-white">
                    ${token.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-white bg-[#18181b] px-1.5 py-0.5 rounded border border-[#27272a]">
                    {token.change24h >= 0 ? `+${token.change24h}%` : `${token.change24h}%`}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#27272a] grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-zinc-500 text-[10px] block">Market Cap</span>
                  <span className="font-bold text-white">${token.marketCapUsd.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">Holders</span>
                  <span className="font-bold text-white">{token.holdersCount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-[11px]">
                <span className="text-zinc-400">Security Verification:</span>
                <span className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-white font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  RugCheck Pass
                </span>
              </div>
            </div>

            {/* Column 2: Token Profile & Authorities */}
            <div className="bg-black border border-[#27272a] rounded-xl p-3.5 space-y-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 block font-bold">
                Token Profile & Tags
              </span>

              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Token Standard:</span>
                  <span className="font-bold text-white">CK-20 (Cookie Native)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Decimals:</span>
                  <span className="font-bold text-zinc-300">9 Decimals</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Mint Authority:</span>
                  <span className="font-bold text-white">Renounced (Fixed Supply)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Freeze Authority:</span>
                  <span className="font-bold text-white">Revoked (Immature Proof)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#27272a]">
                <span className="text-zinc-500 text-[10px] block mb-1.5">Ecosystem Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[10px] text-zinc-300">
                    CookieSwap V2
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[10px] text-zinc-300">
                    Meteora Pool
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[10px] text-zinc-300">
                    DeFi Core
                  </span>
                </div>
              </div>
            </div>

            {/* Column 3: Audit & Metadata */}
            <div className="bg-black border border-[#27272a] rounded-xl p-3.5 space-y-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 block font-bold">
                Audit & Metadata Info
              </span>

              <div className="p-2.5 bg-[#09090b] rounded-lg border border-[#27272a] flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-white shrink-0" />
                <div>
                  <span className="font-bold text-white block text-[11px]">
                    Audited by OtterSec & Trail of Bits
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    0 Critical, 0 High vulnerabilities reported.
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-[11px] pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Token Age:</span>
                  <span className="font-bold text-zinc-300">312 Days (Genesis)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Creator Address:</span>
                  <span className="text-white font-mono font-bold truncate max-w-[130px]">
                    0x71fa...41e9
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Arweave Metadata:</span>
                  <span className="text-white flex items-center gap-1 cursor-pointer hover:underline">
                    ar://metadata.json
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Sub-Navigation Tabs matching Reference 3 */}
          <div className="flex items-center justify-between border-b border-[#27272a] pb-1 overflow-x-auto no-scrollbar gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              {(
                [
                  'Analytics',
                  'Transfers',
                  'Transactions',
                  'DeFi Activities',
                  'Holders',
                  'Market',
                  'Metadata',
                ] as const
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-white text-black border border-white'
                      : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-[#27272a] shrink-0">
              {(['7D', '1M', '3M', '6M', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-white text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* 5 KPI Stat Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div className="bg-black border border-[#27272a] rounded-xl p-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                Volume (24h)
              </span>
              <div className="font-mono text-base font-bold text-white mt-0.5">
                ${token.volume24hUsd.toLocaleString()}
              </div>
              <div className="font-mono text-[10px] text-zinc-300 mt-0.5 flex items-center gap-0.5 font-bold">
                <TrendingUp className="w-3 h-3 text-white" />
                +15.2% vs prev
              </div>
            </div>

            <div className="bg-black border border-[#27272a] rounded-xl p-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                Liquidity (DEX)
              </span>
              <div className="font-mono text-base font-bold text-white mt-0.5">
                $12.46M
              </div>
              <div className="font-mono text-[10px] text-zinc-300 mt-0.5 flex items-center gap-0.5 font-bold">
                <TrendingUp className="w-3 h-3 text-white" />
                +8.1% in 24h
              </div>
            </div>

            <div className="bg-black border border-[#27272a] rounded-xl p-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                Market Cap
              </span>
              <div className="font-mono text-base font-bold text-white mt-0.5">
                ${token.marketCapUsd.toLocaleString()}
              </div>
              <div className="font-mono text-[10px] text-zinc-300 mt-0.5 flex items-center gap-0.5 font-bold">
                <TrendingUp className="w-3 h-3 text-white" />
                +10.4% in 24h
              </div>
            </div>

            <div className="bg-black border border-[#27272a] rounded-xl p-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                Transactions
              </span>
              <div className="font-mono text-base font-bold text-white mt-0.5">
                23.46K
              </div>
              <div className="font-mono text-[10px] text-zinc-300 mt-0.5 flex items-center gap-0.5 font-bold">
                <TrendingDown className="w-3 h-3 text-white" />
                -1.3% in 24h
              </div>
            </div>

            <div className="bg-black border border-[#27272a] rounded-xl p-3 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                Holders
              </span>
              <div className="font-mono text-base font-bold text-white mt-0.5">
                {token.holdersCount.toLocaleString()}
              </div>
              <div className="font-mono text-[10px] text-zinc-300 mt-0.5 flex items-center gap-0.5 font-bold">
                <TrendingUp className="w-3 h-3 text-white" />
                +5.2% in 24h
              </div>
            </div>
          </div>

          {/* Interactive Multi-Series Volume & Trading Chart */}
          <div className="bg-black border border-[#27272a] rounded-xl p-4 sm:p-5 space-y-4">
            
            {/* Chart Header & Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                  <span className="text-xs font-mono text-zinc-300 font-bold">Total Sell Volume</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                  <span className="text-xs font-mono text-zinc-300 font-bold">Total Buy Volume</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-zinc-700" />
                  <span className="text-xs font-mono text-zinc-500 font-bold">Total Trades</span>
                </div>
              </div>

              {/* Sub-pills */}
              <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-lg border border-[#27272a]">
                {(['Dex Trading', 'Volume', 'Distributions', 'Price'] as const).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setAnalyticsSubTab(sub)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                      analyticsSubTab === sub
                        ? 'bg-white text-black'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    Token {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Interactive Multi-Line Canvas */}
            <div className="relative w-full h-[260px] bg-[#09090b] rounded-xl border border-[#27272a] p-2 overflow-hidden">
              
              {/* Background horizontal gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none opacity-20">
                <div className="w-full border-b border-dashed border-[#27272a]" />
                <div className="w-full border-b border-dashed border-[#27272a]" />
                <div className="w-full border-b border-dashed border-[#27272a]" />
                <div className="w-full border-b border-dashed border-[#27272a]" />
              </div>

              {/* Responsive SVG */}
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                {/* Total Trades Bar Histogram in Background */}
                {chartPoints.map((p, i) => {
                  const barH = (p.trades / 240) * 50;
                  const barW = 12;
                  return (
                    <rect
                      key={`bar-${i}`}
                      x={getX(i) - barW / 2}
                      y={height - paddingY - barH}
                      width={barW}
                      height={barH}
                      rx={2}
                      fill="#27272a"
                      opacity={0.8}
                    />
                  );
                })}

                {/* Sell Line (Zinc-400 / Muted) */}
                <path
                  d={sellPath}
                  fill="none"
                  stroke="#71717a"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Buy Line (White / Primary) */}
                <path
                  d={buyPath}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Active Hover Guide & Points */}
                {hoveredPointIndex !== null && (
                  <g>
                    <line
                      x1={getX(hoveredPointIndex)}
                      y1={paddingY}
                      x2={getX(hoveredPointIndex)}
                      y2={height - paddingY}
                      stroke="#52525b"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <circle
                      cx={getX(hoveredPointIndex)}
                      cy={getY(chartPoints[hoveredPointIndex].buy)}
                      r="4.5"
                      fill="#ffffff"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <circle
                      cx={getX(hoveredPointIndex)}
                      cy={getY(chartPoints[hoveredPointIndex].sell)}
                      r="4.5"
                      fill="#71717a"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* Interactive Hover Hit Zones */}
                {chartPoints.map((_, i) => (
                  <rect
                    key={`hit-${i}`}
                    x={getX(i) - innerWidth / (chartPoints.length * 2)}
                    y={0}
                    width={innerWidth / chartPoints.length}
                    height={height}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPointIndex(i)}
                  />
                ))}
              </svg>

              {/* Floating Breakdown Tooltip */}
              {hoveredPointIndex !== null && (
                <div
                  className="absolute pointer-events-none bg-black/95 border border-[#27272a] rounded-xl p-3 shadow-2xl backdrop-blur-md font-mono text-[11px] transition-all"
                  style={{
                    left: `${Math.min(Math.max((hoveredPointIndex / (chartPoints.length - 1)) * 80 + 10, 15), 75)}%`,
                    top: '20px',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="font-bold text-white mb-1.5 border-b border-[#27272a] pb-1">
                    {activePoint.date}, 2026
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <span className="w-2 h-2 rounded-full bg-zinc-400" />
                        Total Sell Volume:
                      </span>
                      <strong className="text-white">${activePoint.sell}M</strong>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-white">
                        <span className="w-2 h-2 rounded-full bg-white" />
                        Total Buy Volume:
                      </span>
                      <strong className="text-white">${activePoint.buy}M</strong>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-zinc-500">
                        <span className="w-2 h-2 rounded bg-zinc-700" />
                        Total Trades:
                      </span>
                      <strong className="text-white">{activePoint.trades},420</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom X-Axis Dates */}
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 px-2">
              <span>Feb 01</span>
              <span>Feb 07</span>
              <span>Feb 14</span>
              <span>Feb 21</span>
              <span>Feb 28</span>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-[#09090b] border-t border-[#27272a] flex items-center justify-between">
          <div className="text-xs font-mono text-zinc-500">
            Direct Contract: <span className="text-white font-bold">{token.contractAddress.slice(0, 10)}...</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectAddress(token.contractAddress)}
              className="px-4 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Inspect Ledger State</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-zinc-300 font-bold text-xs transition-colors cursor-pointer border border-[#27272a]"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

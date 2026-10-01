import React, { useState } from 'react';
import {
  ArrowUpRight,
  TrendingUp,
  BarChart2,
  Fuel,
  Clock,
  CheckCircle2,
  Layers,
  Activity,
  Database,
  Users,
  Zap,
} from 'lucide-react';

export const TelemetryCards: React.FC = () => {
  // Price history timeframe
  const [priceTimeframe, setPriceTimeframe] = useState<'1D' | '7D' | '1M' | '1Y' | 'All'>('7D');
  const [hoveredPriceIndex, setHoveredPriceIndex] = useState<number | null>(6);
  
  // Daily transactions hover
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(4); // Friday default active matching XCHAIN

  // Gas tier selection
  const [selectedGasTier, setSelectedGasTier] = useState<'rapid' | 'fast' | 'standard' | 'slow'>('fast');

  // Price history dataset for 7D / 1M
  const priceHistoryData = [
    { date: 'Mar 01, 2026', price: 1.34 },
    { date: 'Mar 02, 2026', price: 1.36 },
    { date: 'Mar 03, 2026', price: 1.33 },
    { date: 'Mar 04, 2026', price: 1.39 },
    { date: 'Mar 05, 2026', price: 1.37 },
    { date: 'Mar 06, 2026', price: 1.45 },
    { date: 'Mar 07, 2026', price: 1.42 }, // active point
    { date: 'Mar 08, 2026', price: 1.48 },
    { date: 'Mar 09, 2026', price: 1.44 },
    { date: 'Mar 10, 2026', price: 1.51 },
    { date: 'Mar 11, 2026', price: 1.46 },
    { date: 'Mar 12, 2026', price: 1.49 },
  ];

  const activePricePoint = priceHistoryData[hoveredPriceIndex ?? 6] || priceHistoryData[6];

  // Daily transactions data (Mon - Sun matching XCHAIN)
  const dailyTxnsData = [
    { day: 'Mon', count: '1.42M', height: 45 },
    { day: 'Tue', count: '1.58M', height: 55 },
    { day: 'Wed', count: '1.64M', height: 62 },
    { day: 'Thu', count: '1.51M', height: 50 },
    { day: 'Fri', count: '1.82M', height: 85, isHighlighted: true }, // Orange bar in XCHAIN
    { day: 'Sat', count: '1.39M', height: 42 },
    { day: 'Sun', count: '1.48M', height: 48 },
  ];

  const gasTiers = {
    rapid: { name: 'Rapid', costUsd: 0.058, gwei: 18.0, wait: '0.2s' },
    fast: { name: 'Fast', costUsd: 0.045, gwei: 14.0, wait: '0.4s' },
    standard: { name: 'Standard', costUsd: 0.038, gwei: 12.0, wait: '1.0s' },
    slow: { name: 'Slow', costUsd: 0.029, gwei: 9.0, wait: '2.5s' },
  };

  const activeGas = gasTiers[selectedGasTier];

  // SVG dimensions for Price Area Chart
  const svgWidth = 520;
  const svgHeight = 170;
  const padX = 20;
  const padY = 25;
  const innerW = svgWidth - padX * 2;
  const innerH = svgHeight - padY * 2;

  const minPrice = 1.30;
  const maxPrice = 1.54;

  const getPriceX = (i: number) => padX + (i / (priceHistoryData.length - 1)) * innerW;
  const getPriceY = (price: number) => svgHeight - padY - ((price - minPrice) / (maxPrice - minPrice)) * innerH;

  const pricePathD = priceHistoryData
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getPriceX(i)} ${getPriceY(p.price)}`)
    .join(' ');

  const priceAreaD = `${pricePathD} L ${getPriceX(priceHistoryData.length - 1)} ${svgHeight - padY} L ${getPriceX(0)} ${svgHeight - padY} Z`;

  return (
    <section className="w-full bg-black py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Reference 2 (XCHAIN): High-Density Protocol Overview Banner */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-4 sm:p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272a] pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold font-mono">
                CK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-sans text-lg sm:text-xl font-bold text-white">
                    Cookie Chain
                  </h2>
                  <span className="font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#121214] text-zinc-400 border border-[#27272a]">
                    API v2.4
                  </span>
                </div>
                <p className="font-sans text-xs text-zinc-400">
                  Sub-second finality smart ledger with zero re-org consensus.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-black border border-[#27272a] rounded-lg font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-zinc-500">Consensus:</span>
                <span className="font-semibold text-white">100% HEALTHY</span>
              </div>
            </div>
          </div>

          {/* 4 Primary Top Metrics from XCHAIN */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#27272a]">
            {/* Total blocks */}
            <div className="pt-2 sm:pt-0 sm:px-3 first:px-0">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-white" />
                Total blocks
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-white">
                19,369,463
              </div>
              <div className="font-mono text-[11px] text-zinc-400 mt-0.5">
                400ms block time
              </div>
            </div>

            {/* Total transactions */}
            <div className="pt-2 sm:pt-0 sm:px-4">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 mb-1">
                <Activity className="w-3.5 h-3.5 text-white" />
                Total transactions
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-white">
                2,285.00 M
              </div>
              <div className="font-mono text-[11px] text-zinc-400 mt-0.5">
                2,840 TPS peak
              </div>
            </div>

            {/* Market cap */}
            <div className="pt-2 sm:pt-0 sm:px-4">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 mb-1">
                <Database className="w-3.5 h-3.5 text-white" />
                Market cap
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-white">
                $710.14 B
              </div>
              <div className="font-mono text-[11px] text-zinc-400 mt-0.5">
                +$14.2M today
              </div>
            </div>

            {/* Total accounts */}
            <div className="pt-2 sm:pt-0 sm:px-4">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-white" />
                Total accounts
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-white">
                322,758,276
              </div>
              <div className="font-mono text-[11px] text-zinc-400 mt-0.5">
                +12,410 active 24h
              </div>
            </div>
          </div>
        </div>

        {/* Reference 2 (XCHAIN): The Trio of Analytics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Card 1 (Span 6): Price history Area Chart */}
          <div className="lg:col-span-6 bg-[#09090b] border border-[#27272a] rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-xs font-mono text-zinc-400 block">Price history</span>
                  <div className="flex items-baseline gap-2.5 mt-1">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      ${activePricePoint.price.toFixed(2)}
                    </span>
                    <span className="font-mono text-xs font-semibold text-zinc-300 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3 text-white" />
                      ▲ 3.87%
                    </span>
                  </div>
                </div>

                {/* Timeframe Pills */}
                <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-[#27272a]">
                  {(['1D', '7D', '1M', '1Y', 'All'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setPriceTimeframe(tf)}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                        priceTimeframe === tf
                          ? 'bg-white text-black shadow-sm font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area SVG Chart matching Reference 2 */}
              <div className="relative w-full h-[180px] mt-2 overflow-hidden">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="bwPriceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guideline */}
                  <line
                    x1={padX}
                    y1={getPriceY(1.40)}
                    x2={svgWidth - padX}
                    y2={getPriceY(1.40)}
                    stroke="#27272a"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />

                  {/* Area Gradient */}
                  <path d={priceAreaD} fill="url(#bwPriceGrad)" />

                  {/* Line */}
                  <path
                    d={pricePathD}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Hover Marker */}
                  {hoveredPriceIndex !== null && (
                    <g>
                      <line
                        x1={getPriceX(hoveredPriceIndex)}
                        y1={padY}
                        x2={getPriceX(hoveredPriceIndex)}
                        y2={svgHeight - padY}
                        stroke="#71717a"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <circle
                        cx={getPriceX(hoveredPriceIndex)}
                        cy={getPriceY(priceHistoryData[hoveredPriceIndex].price)}
                        r="4.5"
                        fill="#ffffff"
                        stroke="#000000"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  {/* Hit Areas */}
                  {priceHistoryData.map((_, i) => (
                    <rect
                      key={`hit-price-${i}`}
                      x={getPriceX(i) - innerW / (priceHistoryData.length * 2)}
                      y={0}
                      width={innerW / priceHistoryData.length}
                      height={svgHeight}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPriceIndex(i)}
                    />
                  ))}
                </svg>

                {/* Floating Tooltip Pill */}
                {hoveredPriceIndex !== null && (
                  <div
                    className="absolute pointer-events-none bg-black border border-[#27272a] rounded-lg px-2.5 py-1 text-[11px] font-mono shadow-2xl text-white whitespace-nowrap"
                    style={{
                      left: `${(hoveredPriceIndex / (priceHistoryData.length - 1)) * 75 + 10}%`,
                      top: '15px',
                    }}
                  >
                    <span className="text-zinc-500 block text-[9px]">{activePricePoint.date}</span>
                    <strong className="text-white font-bold">${activePricePoint.price.toFixed(2)}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 pt-2 border-t border-[#27272a]">
              <span>Low: $1.32</span>
              <span>Volume (24h): $48.2M</span>
              <span>High: $1.51</span>
            </div>
          </div>

          {/* Card 2 (Span 3): Daily transactions (Histogram with Highlight Bar) */}
          <div className="lg:col-span-3 bg-[#09090b] border border-[#27272a] rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-white" />
                  Daily transactions
                </span>
                <span className="font-mono text-[11px] text-zinc-500">7-Day</span>
              </div>

              {/* Bar Histogram */}
              <div className="h-40 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-1">
                {dailyTxnsData.map((d, idx) => {
                  const isHighlighted = d.isHighlighted || hoveredDayIndex === idx;
                  return (
                    <div
                      key={d.day}
                      onMouseEnter={() => setHoveredDayIndex(idx)}
                      className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                    >
                      <div className="w-full flex items-end justify-center h-full">
                        <div
                          className={`w-full rounded-md transition-all ${
                            isHighlighted
                              ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                              : 'bg-[#18181b] group-hover:bg-zinc-700'
                          }`}
                          style={{ height: `${d.height}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500 mt-2 group-hover:text-white transition-colors">
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-[#27272a] flex items-center justify-between font-mono text-[11px]">
              <span className="text-zinc-500">Peak Friday:</span>
              <strong className="text-white">1.82M txns</strong>
            </div>
          </div>

          {/* Card 3 (Span 3): Gas price tracker (with Rapid, Fast, Standard, Slow toggles) */}
          <div className="lg:col-span-3 bg-[#09090b] border border-[#27272a] rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-white" />
                  Gas price tracker
                </span>
              </div>

              {/* Speed Buttons Toggles */}
              <div className="grid grid-cols-2 gap-1.5 mb-4">
                {(['rapid', 'fast', 'standard', 'slow'] as const).map((tierKey) => {
                  const t = gasTiers[tierKey];
                  const isSelected = selectedGasTier === tierKey;
                  return (
                    <button
                      key={tierKey}
                      onClick={() => setSelectedGasTier(tierKey)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-white text-black shadow-md font-bold'
                          : 'bg-[#121214] border border-[#27272a] text-zinc-400 hover:text-white hover:bg-[#18181b]'
                      }`}
                    >
                      <span>{t.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Price display */}
              <div className="p-3.5 bg-black border border-[#27272a] rounded-xl text-center space-y-1">
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  ${activeGas.costUsd.toFixed(3)}
                </div>
                <div className="font-mono text-[11px] text-zinc-500">
                  ≈ {activeGas.gwei.toFixed(1)} Gwei per tx / {activeGas.wait}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#27272a] flex items-center justify-between font-mono text-[11px]">
              <span className="text-zinc-500">Mempool Congestion:</span>
              <span className="text-white flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-white" />
                Optimal
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

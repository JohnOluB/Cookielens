import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, X, Sparkles, Check, Flame, Box, Radio, CornerDownLeft, ShieldCheck } from 'lucide-react';
import { Block } from '../types';

interface HeroSearchProps {
  onSearch: (query: string, filter: string) => void;
  latestBlock?: Block;
  blocks?: Block[];
  onSelectBlock?: (block: Block) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  latestBlock,
  blocks = [],
  onSelectBlock,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  // Auto-detect input type for intelligent guidance
  const detectedType = useMemo(() => {
    const q = searchInput.trim();
    if (!q) return null;
    if (/^0x[a-fA-F0-9]{64}$/.test(q)) return { label: 'Tx Hash', color: 'text-white border-white/40 bg-black' };
    if (/^0x[a-fA-F0-9]{40}$/.test(q)) return { label: 'Address / Contract', color: 'text-white border-white/40 bg-black' };
    if (/^\d+$/.test(q)) return { label: 'Block Height', color: 'text-white border-white/40 bg-black' };
    if (q.length > 2) return { label: 'Keyword / Name', color: 'text-white border-white/40 bg-black' };
    return null;
  }, [searchInput]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onSearch(query, filter);
    }, 250);
  };

  const handleQuickFill = (val: string) => {
    setSearchInput(val);
    onSearch(val, filter);
  };

  const currentBlockNum = latestBlock ? latestBlock.number : blocks[0]?.number || 19369463;

  return (
    <section className="w-full bg-black py-10 px-4 sm:px-6 relative overflow-hidden border-b border-[#27272a]">
      {/* Subtle crypto grid texture */}
      <div className="absolute inset-0 crypto-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Reference 1 (VF / PAYY): Cybernetic Scanline Block Ticker & Telemetry Row */}
        <div className="w-full max-w-4xl mb-6 bg-[#09090b] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="px-4 py-2 bg-[#121214] border-b border-[#27272a] flex items-center justify-between font-mono text-[11px] text-[#a1a1aa]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-bold tracking-widest text-white uppercase">
                PAYY PROTOCOL PULSE // COOKIE LEDGER
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="hidden sm:inline">STATE: <strong className="text-white">INSTANT FINALITY</strong></span>
              <span>LATEST_BLOCK: <strong className="text-white font-bold">#{currentBlockNum}</strong></span>
            </div>
          </div>

          {/* Retro-Futuristic Stacked Scanline Block Tape */}
          <div className="p-3 sm:p-4 bg-black relative overflow-hidden flex flex-col items-center justify-center scanline-bg border-b border-[#27272a]">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full font-mono">
              {[-1, 0, 1].map((offset) => {
                const blkNum = currentBlockNum + offset;
                const isCurrent = offset === 0;
                return (
                  <button
                    key={blkNum}
                    onClick={() => {
                      const found = blocks.find((b) => b.number === blkNum);
                      if (found && onSelectBlock) onSelectBlock(found);
                      else onSearch(blkNum.toString(), 'block');
                    }}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-lg transition-all text-center flex items-center justify-center gap-3 cursor-pointer ${
                      isCurrent
                        ? 'bg-white text-black font-extrabold shadow-[0_0_20px_rgba(255,255,255,0.25)] ring-1 ring-white'
                        : 'bg-[#121214] text-zinc-400 hover:text-white hover:bg-[#18181b] border border-[#27272a]'
                    }`}
                  >
                    <Box className={`w-4 h-4 ${isCurrent ? 'text-black' : 'text-zinc-500'}`} />
                    <span className="text-[13px] sm:text-[14px] tracking-wider uppercase font-bold">
                      COOKIE_BLOCK_{blkNum}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black text-white">
                        FINALIZED
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reference 1: The 3 Prominent Stat Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#27272a] bg-[#09090b] p-3 text-center font-mono">
            <div className="py-1">
              <div className="text-base sm:text-lg font-extrabold text-white">
                2,285.00 M
              </div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                Total Transactions
              </div>
            </div>
            <div className="py-1">
              <div className="text-base sm:text-lg font-extrabold text-white">
                400ms
              </div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                Average Block Time
              </div>
            </div>
            <div className="py-1">
              <div className="text-base sm:text-lg font-extrabold text-white">
                2,840
              </div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                Network TPS
              </div>
            </div>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">
          Explore Cookie Chain Ledger & Decoded Activity
        </h1>
        <p className="font-sans text-[14px] sm:text-[15px] text-zinc-400 max-w-2xl mb-6 leading-relaxed">
          Verify transactions, inspect contracts, and analyze state transitions with millisecond finality.
        </p>

        {/* Reference 2: Precision Command-Center Search */}
        <div className="w-full max-w-4xl bg-[#09090b] border border-[#27272a] focus-within:border-white focus-within:ring-2 focus-within:ring-white/10 rounded-xl shadow-2xl p-1.5 transition-all">
          <form
            id="explorer-search-form"
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch gap-1.5"
          >
            {/* Filter Category Select */}
            <div className="relative flex items-center min-w-[130px] sm:min-w-[145px] bg-[#121214] rounded-lg border border-[#27272a]">
              <label className="sr-only" htmlFor="search-filter">
                Search Category
              </label>
              <select
                id="search-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full h-11 bg-transparent text-zinc-200 text-[13px] px-3 appearance-none outline-none cursor-pointer font-medium"
              >
                <option className="bg-[#121214] text-white" value="all">
                  All Filters
                </option>
                <option className="bg-[#121214] text-white" value="tx">
                  Txn Hash
                </option>
                <option className="bg-[#121214] text-white" value="address">
                  Addresses
                </option>
                <option className="bg-[#121214] text-white" value="token">
                  Tokens
                </option>
                <option className="bg-[#121214] text-white" value="block">
                  Blocks
                </option>
                <option className="bg-[#121214] text-white" value="contract">
                  Contracts
                </option>
              </select>
              <span className="text-zinc-500 pointer-events-none absolute right-3 text-[11px]">▼</span>
            </div>

            {/* Input with Detection Badge */}
            <div className="relative flex-1 flex items-center bg-[#121214] rounded-lg px-3 border border-[#27272a]">
              <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
              <input
                id="search-input"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by address / txn hash / block number / token..."
                className="w-full h-11 bg-transparent text-white placeholder:text-zinc-500 font-mono text-[13px] outline-none"
              />

              {/* Detected Type Badge */}
              {detectedType && (
                <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded border mr-1.5 shrink-0 ${detectedType.color}`}>
                  {detectedType.label}
                </span>
              )}

              {/* Clear button */}
              {searchInput && (
                <button
                  id="clear-search-btn"
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="text-zinc-500 hover:text-white p-1 transition-colors mr-1 cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Keyboard Shortcut Hint */}
              <div className="hidden md:flex items-center text-zinc-500 font-mono text-[10px] border border-zinc-700 rounded px-1.5 py-0.5">
                <CornerDownLeft className="w-3 h-3 mr-0.5" /> ↵
              </div>
            </div>

            {/* Search Submit Button */}
            <button
              id="search-submit-btn"
              type="submit"
              disabled={isSearching}
              className="h-11 px-6 sm:px-7 bg-white hover:bg-zinc-200 text-black transition-colors rounded-lg text-[14px] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0 disabled:opacity-75"
            >
              <span>{isSearching ? 'Querying...' : 'Search'}</span>
              <ArrowRight className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
            </button>
          </form>
        </div>

        {/* Quick-Pick Trending Badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-zinc-400 font-mono text-[12px]">
          <span className="font-mono text-[11px] font-semibold uppercase text-zinc-500 mr-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-white" />
            Quick Inspect:
          </span>
          <button
            id="trending-cookieswap-btn"
            onClick={() => handleQuickFill('0x71c0827364501928374615243501982736450999')}
            className="px-2.5 py-0.5 bg-[#121214] hover:bg-[#18181b] rounded text-white border border-[#27272a] hover:border-zinc-500 transition-colors cursor-pointer text-[11px]"
          >
            #CookieSwap Router
          </button>
          <button
            id="trending-stakepool-btn"
            onClick={() => handleQuickFill('StakePool-04')}
            className="px-2.5 py-0.5 bg-[#121214] hover:bg-[#18181b] rounded text-zinc-300 hover:text-white border border-[#27272a] hover:border-zinc-500 transition-colors cursor-pointer text-[11px]"
          >
            #StakePool-04
          </button>
          <button
            id="trending-latest-block-btn"
            onClick={() => handleQuickFill(currentBlockNum.toString())}
            className="px-2.5 py-0.5 bg-[#121214] hover:bg-[#18181b] rounded text-white border border-[#27272a] hover:border-zinc-500 transition-colors cursor-pointer text-[11px]"
          >
            #{currentBlockNum} (Latest)
          </button>
          <button
            id="trending-erc4337-btn"
            onClick={() => handleQuickFill('0x8817263541829304192837461524350198273645')}
            className="px-2.5 py-0.5 bg-[#121214] hover:bg-[#18181b] rounded text-zinc-300 hover:text-white border border-[#27272a] hover:border-zinc-500 transition-colors cursor-pointer text-[11px]"
          >
            ERC-4337 Paymaster
          </button>
        </div>
      </div>
    </section>
  );
};

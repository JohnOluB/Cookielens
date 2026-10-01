import React, { useState } from 'react';
import { Coins, Search, TrendingUp, Sparkles, ExternalLink } from 'lucide-react';
import { TOKEN_LIST } from '../data/mockData';
import { TokenItem } from '../types';

interface TokensViewProps {
  onSelectToken: (token: TokenItem) => void;
}

export const TokensView: React.FC<TokensViewProps> = ({ onSelectToken }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'TOKEN' | 'STABLE' | 'NFT'>('ALL');

  const filteredTokens = TOKEN_LIST.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || t.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-white">Cookie Chain Token Tracker</h1>
        <p className="font-sans text-[14px] text-zinc-400 mt-1">
          Explore native assets, stablecoins, bridged Solana tokens, and NFT collections.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2 flex-1 max-w-md shadow-md focus-within:border-white">
          <Search className="w-4 h-4 text-zinc-500 mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tokens by name or symbol..."
            className="w-full bg-transparent text-white font-mono text-[13px] outline-none placeholder:text-zinc-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-black p-1 rounded-lg border border-[#27272a]">
          {(['ALL', 'TOKEN', 'STABLE', 'NFT'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded text-[12px] font-mono font-bold transition-colors cursor-pointer ${
                activeFilter === filter
                  ? 'bg-white text-black'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Tokens Table */}
      <div className="bg-[#09090b] border border-[#27272a] rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#121214] text-zinc-400 font-mono text-[11px] uppercase tracking-wider border-b border-[#27272a]">
              <tr>
                <th className="px-5 py-3.5">Asset</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Price (USD)</th>
                <th className="px-5 py-3.5">24h Change</th>
                <th className="px-5 py-3.5">24h Volume</th>
                <th className="px-5 py-3.5">Market Cap</th>
                <th className="px-5 py-3.5 text-right">Holders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e22]">
              {filteredTokens.map((token) => (
                <tr
                  key={token.symbol}
                  onClick={() => onSelectToken(token)}
                  className="hover:bg-[#121214] transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black border border-[#27272a] flex items-center justify-center font-mono font-bold text-white text-[12px]">
                        {token.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <span className="font-sans font-bold text-white group-hover:text-zinc-300 transition-colors block">
                          {token.name}
                        </span>
                        <span className="font-mono text-[11px] text-zinc-500">{token.symbol}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold border border-[#27272a] bg-black text-zinc-300 uppercase">
                      {token.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-white">
                    ${token.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold">
                    <span className={token.change24h >= 0 ? 'text-white font-bold' : 'text-zinc-400'}>
                      {token.change24h >= 0 ? `+${token.change24h}%` : `${token.change24h}%`}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-zinc-300">
                    ${token.volume24hUsd.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-mono text-white font-semibold">
                    ${token.marketCapUsd.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-mono text-right text-zinc-500">
                    {token.holdersCount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

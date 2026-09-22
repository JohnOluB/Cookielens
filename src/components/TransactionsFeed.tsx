import React, { useState } from 'react';
import { ArrowLeftRight, FileText, ArrowRight, Copy, Check, ExternalLink } from 'lucide-react';
import { Transaction, TxType } from '../types';

interface TransactionsFeedProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onSelectAddress: (address: string) => void;
  onViewAllTransactions: () => void;
}

const getBadgeStyle = (type: TxType) => {
  switch (type) {
    case 'SWAP':
      return 'bg-white text-black border-white font-bold';
    case 'TRANSFER':
      return 'bg-[#18181b] text-white border-[#3f3f46]';
    case 'EXECUTE':
      return 'bg-[#121214] text-zinc-300 border-[#27272a]';
    case 'MINT':
      return 'bg-white text-black border-white font-bold';
    case 'BRIDGE':
      return 'bg-[#27272a] text-white border-zinc-500';
    default:
      return 'bg-[#121214] text-zinc-400 border-[#27272a]';
  }
};

export const TransactionsFeed: React.FC<TransactionsFeedProps> = ({
  transactions,
  onSelectTransaction,
  onSelectAddress,
  onViewAllTransactions,
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const formatAddress = (addr: string) => {
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 5)}...${addr.slice(-4)}`;
  };

  const formatHash = (hash: string) => {
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-4)}`;
  };

  const copyHash = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  return (
    <div className="bg-[#09090b] border border-[#27272a] rounded-xl shadow-lg flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3.5 bg-[#121214] border-b border-[#27272a] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-black border border-[#27272a] flex items-center justify-center">
            <ArrowLeftRight className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="font-sans text-[15px] font-bold text-white">Latest Transactions</h2>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black border border-[#27272a]">
          <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="font-mono text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
            Mempool Feed
          </span>
        </div>
      </div>

      {/* Dense Rows Feed */}
      <div className="divide-y divide-[#1f1f23]">
        {transactions.slice(0, 6).map((tx) => (
          <div
            key={tx.hash}
            onClick={() => onSelectTransaction(tx)}
            className="p-3.5 sm:px-4 hover:bg-[#121214] transition-colors flex items-center justify-between gap-3 group cursor-pointer"
          >
            {/* Hash & Route */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-black border border-[#27272a] group-hover:border-zinc-500 flex items-center justify-center shrink-0 transition-all">
                <FileText className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[13px] sm:text-[14px] font-bold text-white group-hover:underline">
                    {formatHash(tx.hash)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => copyHash(tx.hash, e)}
                    className="text-zinc-500 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                    title="Copy Tx Hash"
                  >
                    {copiedHash === tx.hash ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  <span className="font-mono text-[11px] text-zinc-500">{tx.timeAgo}</span>
                </div>

                <div className="font-mono text-[11px] text-zinc-400 truncate mt-0.5 flex items-center gap-1.5">
                  <span className="text-zinc-500">From</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAddress(tx.from);
                    }}
                    className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {formatAddress(tx.from)}
                  </button>
                  <span className="text-zinc-600">➔ To</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAddress(tx.to);
                    }}
                    className={`transition-colors cursor-pointer font-medium ${
                      tx.toLabel
                        ? 'text-white hover:underline'
                        : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    {tx.toLabel || formatAddress(tx.to)}
                  </button>
                </div>
              </div>
            </div>

            {/* Value & Method Tag */}
            <div className="text-right shrink-0">
              <span
                className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border uppercase inline-block ${getBadgeStyle(
                  tx.type
                )}`}
              >
                {tx.type}
              </span>
              <div className="font-mono text-[12px] text-white mt-1 font-semibold">
                {tx.valueCookie.toFixed(2)} COOKIE
              </div>
              <div className="font-mono text-[10px] text-zinc-500">
                {tx.valueUsd > 0 ? `$${tx.valueUsd.toLocaleString()}` : `Fee: $${tx.feeUsd.toFixed(3)}`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Action */}
      <div className="p-2.5 bg-[#121214] border-t border-[#27272a] text-center">
        <button
          id="view-all-transactions-btn"
          onClick={onViewAllTransactions}
          className="w-full py-1 inline-flex items-center justify-center gap-1.5 font-mono text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
        >
          <span>View All Transactions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

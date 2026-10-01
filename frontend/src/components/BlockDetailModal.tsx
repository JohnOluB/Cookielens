import React, { useState } from 'react';
import { X, Box, Copy, Check, ExternalLink, ArrowRight, Layers, Fuel, ShieldCheck } from 'lucide-react';
import { Block, Transaction } from '../types';

interface BlockDetailModalProps {
  block: Block | null;
  onClose: () => void;
  onSelectTx: (txHash: string) => void;
  onSelectValidator: (name: string) => void;
}

export const BlockDetailModal: React.FC<BlockDetailModalProps> = ({
  block,
  onClose,
  onSelectTx,
  onSelectValidator,
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  if (!block) return null;

  const gasPercentage = Math.round((block.gasUsed / block.gasLimit) * 100);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#09090b] border border-[#27272a] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-[#121214] border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-black border border-[#27272a] flex items-center justify-center">
              <Box className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans text-[17px] sm:text-[18px] font-bold text-white">
                  Block #{block.number}
                </h3>
                <span className="font-mono text-[11px] font-bold text-black bg-white px-2 py-0.5 rounded">
                  Finalized
                </span>
              </div>
              <p className="font-mono text-[12px] text-zinc-400">{block.timeAgo}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-[13px]">
          {/* Block Hash Banner */}
          <div className="p-3 bg-black border border-[#27272a] rounded-xl flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                Block Hash
              </span>
              <span className="font-mono text-[12px] sm:text-[13px] font-bold text-white truncate block mt-0.5">
                {block.hash}
              </span>
            </div>
            <button
              onClick={() => copyText(block.hash, 'hash')}
              className="p-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white rounded-lg border border-[#27272a] transition-colors shrink-0 cursor-pointer font-mono text-[11px] flex items-center gap-1"
              title="Copy Hash"
            >
              {copiedHash === 'hash' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHash === 'hash' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Parent Hash */}
          <div className="p-3 bg-black border border-[#27272a] rounded-xl flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                Parent Block Hash
              </span>
              <span className="font-mono text-[12px] text-zinc-400 truncate block mt-0.5">
                {block.parentHash}
              </span>
            </div>
            <button
              onClick={() => copyText(block.parentHash, 'parent')}
              className="p-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white rounded-lg border border-[#27272a] transition-colors shrink-0 cursor-pointer font-mono text-[11px] flex items-center gap-1"
            >
              {copiedHash === 'parent' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHash === 'parent' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-[#121214] border border-[#27272a] rounded-xl">
              <span className="text-zinc-500 text-[10px] font-mono uppercase block mb-1">Timestamp</span>
              <span className="text-white font-mono font-medium">{block.timestamp} UTC</span>
            </div>

            <div className="p-3 bg-[#121214] border border-[#27272a] rounded-xl">
              <span className="text-zinc-500 text-[10px] font-mono uppercase block mb-1">Fee Recipient / Validator</span>
              <button
                onClick={() => onSelectValidator(block.validatorName)}
                className="text-white hover:underline font-mono font-semibold cursor-pointer block truncate"
              >
                Validator: {block.validatorName}
              </button>
            </div>

            <div className="p-3 bg-[#121214] border border-[#27272a] rounded-xl">
              <span className="text-zinc-500 text-[10px] font-mono uppercase block mb-1">Transactions</span>
              <span className="text-white font-mono font-semibold">
                {block.txCount} verified state updates in {block.durationSeconds}s
              </span>
            </div>

            <div className="p-3 bg-[#121214] border border-[#27272a] rounded-xl">
              <span className="text-zinc-500 text-[10px] font-mono uppercase block mb-1">Block Reward</span>
              <span className="text-white font-mono font-bold">
                +{block.rewardCookie.toFixed(4)} COOKIE
              </span>
            </div>
          </div>

          {/* Gas Utilization Card */}
          <div className="p-4 bg-[#121214] border border-[#27272a] rounded-xl space-y-2">
            <div className="flex items-center justify-between font-mono text-[12px]">
              <span className="text-zinc-500">Gas Utilization</span>
              <span className="text-white font-bold">
                {block.gasUsed.toLocaleString()} / {block.gasLimit.toLocaleString()} ({gasPercentage}%)
              </span>
            </div>
            <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-[#27272a]">
              <div
                className="bg-white h-full rounded-full transition-all"
                style={{ width: `${gasPercentage}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[11px] text-zinc-500 pt-1">
              <span>Base Fee: <strong className="text-white">{block.baseFeeGwei} Gwei</strong></span>
              <span>Payload Size: <strong className="text-white">{block.sizeKb} KB</strong></span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#121214] border-t border-[#27272a] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-white text-black hover:bg-zinc-200 rounded-lg font-bold text-[13px] transition-colors cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};

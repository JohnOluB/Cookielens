import React, { useState } from 'react';
import { Box, ArrowRight, Copy, Check, Radio, Cpu, Layers } from 'lucide-react';
import { Block } from '../types';

interface BlocksFeedProps {
  blocks: Block[];
  onSelectBlock: (block: Block) => void;
  onSelectValidator: (name: string) => void;
  onViewAllBlocks: () => void;
  isStreamActive: boolean;
  onToggleStream: () => void;
}

export const BlocksFeed: React.FC<BlocksFeedProps> = ({
  blocks,
  onSelectBlock,
  onSelectValidator,
  onViewAllBlocks,
  isStreamActive,
  onToggleStream,
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

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
            <Layers className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="font-sans text-[15px] font-bold text-white">Latest Blocks</h2>
        </div>

        <button
          onClick={onToggleStream}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black border border-[#27272a] hover:border-zinc-500 transition-colors cursor-pointer"
          title="Toggle live block stream"
        >
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              isStreamActive ? 'bg-white animate-pulse' : 'bg-zinc-600'
            }`}
          />
          <span className="font-mono text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
            {isStreamActive ? 'Live Stream' : 'Paused'}
          </span>
        </button>
      </div>

      {/* Dense Table Layout */}
      <div className="divide-y divide-[#1f1f23]">
        {blocks.slice(0, 6).map((block) => {
          const gasPct = Math.round((block.gasUsed / block.gasLimit) * 100);

          return (
            <div
              key={block.number}
              onClick={() => onSelectBlock(block)}
              className="p-3.5 sm:px-4 hover:bg-[#121214] transition-colors flex items-center justify-between gap-3 group cursor-pointer"
            >
              {/* Block & Validator */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-black border border-[#27272a] group-hover:border-zinc-500 flex items-center justify-center shrink-0 transition-all">
                  <Box className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[13px] sm:text-[14px] font-bold text-white group-hover:underline">
                      #{block.number}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-500">{block.timeAgo}</span>
                  </div>

                  <div className="font-mono text-[11px] text-zinc-400 truncate mt-0.5 flex items-center gap-1.5">
                    <span className="text-zinc-500">Validator:</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectValidator(block.validatorName);
                      }}
                      className="text-zinc-200 hover:text-white font-semibold transition-colors cursor-pointer"
                    >
                      {block.validatorName}
                    </button>
                    <span className="text-zinc-600 hidden sm:inline">•</span>
                    <span className="text-zinc-500 hidden sm:inline">{block.txCount} txns</span>
                  </div>
                </div>
              </div>

              {/* Gas & Reward Telemetry */}
              <div className="text-right shrink-0">
                <div className="font-mono text-[11px] font-bold text-black bg-white px-2 py-0.5 rounded inline-block">
                  +{block.rewardCookie.toFixed(2)} COOKIE
                </div>
                <div className="font-mono text-[10px] text-zinc-500 mt-1 flex items-center justify-end gap-1.5">
                  <span>Gas: {gasPct}%</span>
                  <div className="w-10 bg-black h-1.5 rounded-full overflow-hidden hidden sm:block border border-[#27272a]">
                    <div
                      className="bg-white h-full rounded-full"
                      style={{ width: `${gasPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Action */}
      <div className="p-2.5 bg-[#121214] border-t border-[#27272a] text-center">
        <button
          id="view-all-blocks-btn"
          onClick={onViewAllBlocks}
          className="w-full py-1 inline-flex items-center justify-center gap-1.5 font-mono text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
        >
          <span>View All Blocks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

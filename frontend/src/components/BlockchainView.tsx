import React, { useState } from 'react';
import { Box, FileText, ArrowRight, Filter, Search, RefreshCw, CheckCircle2, Copy, Check } from 'lucide-react';
import { Block, Transaction } from '../types';

interface BlockchainViewProps {
  blocks: Block[];
  transactions: Transaction[];
  onSelectBlock: (block: Block) => void;
  onSelectTx: (tx: Transaction) => void;
  onSelectValidator: (name: string) => void;
  onSelectAddress: (address: string) => void;
}

export const BlockchainView: React.FC<BlockchainViewProps> = ({
  blocks,
  transactions,
  onSelectBlock,
  onSelectTx,
  onSelectValidator,
  onSelectAddress,
}) => {
  const [subTab, setSubTab] = useState<'blocks' | 'transactions'>('blocks');
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 1500);
  };

  const filteredBlocks = blocks.filter(
    (b) =>
      b.number.toString().includes(searchFilter) ||
      b.hash.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.validatorName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredTxs = transactions.filter(
    (t) =>
      t.hash.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.from.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.to.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.type.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-5">
      {/* Top Header & Sub-nav */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
        <div>
          <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cookie Chain Ledger
          </h1>
          <p className="font-sans text-[14px] text-zinc-400 mt-1">
            Real-time verified blocks and validated state transitions with instant finality.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-black p-1 rounded-xl border border-[#27272a]">
          <button
            onClick={() => setSubTab('blocks')}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-[12px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'blocks'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>Blocks ({blocks.length})</span>
          </button>
          <button
            onClick={() => setSubTab('transactions')}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-[12px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'transactions'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Transactions ({transactions.length})</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-2.5 gap-3 shadow-md focus-within:border-white">
        <Search className="w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder={`Filter ${
            subTab === 'blocks'
              ? 'by block number, block hash, or validator name...'
              : 'by txn hash, sender, recipient, or method type...'
          }`}
          className="w-full bg-transparent text-white placeholder:text-zinc-500 font-mono text-[13px] outline-none"
        />
        {searchFilter && (
          <button
            onClick={() => setSearchFilter('')}
            className="text-zinc-400 hover:text-white font-mono text-[11px] px-2 py-0.5 bg-[#18181b] rounded cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Tab Content: High-Density Tabular Presentation */}
      {subTab === 'blocks' ? (
        <div className="bg-[#09090b] border border-[#27272a] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[12px]">
              <thead className="bg-[#121214] text-zinc-400 text-[10px] uppercase tracking-wider border-b border-[#27272a]">
                <tr>
                  <th className="px-4 py-3">Block Height</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Txns</th>
                  <th className="px-4 py-3">Fee Recipient / Validator</th>
                  <th className="px-4 py-3">Gas Used</th>
                  <th className="px-4 py-3">Base Fee</th>
                  <th className="px-4 py-3 text-right">Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e22]">
                {filteredBlocks.map((block) => {
                  const gasPct = Math.round((block.gasUsed / block.gasLimit) * 100);
                  return (
                    <tr
                      key={block.number}
                      onClick={() => onSelectBlock(block)}
                      className="hover:bg-[#121214] transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white group-hover:underline">
                            #{block.number}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => copyToClipboard(block.hash, `block-${block.number}`, e)}
                            className="text-zinc-500 hover:text-white p-0.5 rounded"
                            title="Copy Block Hash"
                          >
                            {copiedItem === `block-${block.number}` ? (
                              <Check className="w-3 h-3 text-white" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-500">{block.timeAgo}</td>
                      <td className="px-4 py-3.5 text-white font-medium">{block.txCount}</td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectValidator(block.validatorName);
                          }}
                          className="text-zinc-300 hover:text-white font-medium transition-colors"
                        >
                          {block.validatorName}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400">{gasPct}%</span>
                          <div className="w-16 bg-[#18181b] h-1.5 rounded-full overflow-hidden border border-[#27272a]">
                            <div className="bg-white h-full rounded-full" style={{ width: `${gasPct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-400">{block.baseFeeGwei} Gwei</td>
                      <td className="px-4 py-3.5 text-right font-bold text-white">
                        +{block.rewardCookie.toFixed(2)} COOKIE
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#09090b] border border-[#27272a] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[12px]">
              <thead className="bg-[#121214] text-zinc-400 text-[10px] uppercase tracking-wider border-b border-[#27272a]">
                <tr>
                  <th className="px-4 py-3">Tx Hash</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Block</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">To</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3 text-right">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e22]">
                {filteredTxs.map((tx) => (
                  <tr
                    key={tx.hash}
                    onClick={() => onSelectTx(tx)}
                    className="hover:bg-[#121214] transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white group-hover:underline">
                          {tx.hash.slice(0, 10)}...{tx.hash.slice(-4)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => copyToClipboard(tx.hash, `tx-${tx.hash}`, e)}
                          className="text-zinc-500 hover:text-white p-0.5 rounded"
                          title="Copy Hash"
                        >
                          {copiedItem === `tx-${tx.hash}` ? (
                            <Check className="w-3 h-3 text-white" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black border border-[#27272a] text-zinc-300 uppercase">
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400">#{tx.blockNumber}</td>
                    <td className="px-4 py-3.5 text-zinc-500">{tx.timeAgo}</td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAddress(tx.from);
                        }}
                        className="text-zinc-300 hover:text-white transition-colors"
                      >
                        {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAddress(tx.to);
                        }}
                        className={`transition-colors font-medium ${
                          tx.toLabel ? 'text-white font-bold hover:underline' : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        {tx.toLabel || `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-white">
                      {tx.valueCookie.toFixed(2)} COOKIE
                    </td>
                    <td className="px-4 py-3.5 text-right text-zinc-400">
                      ${tx.feeUsd.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Layers,
  Fuel,
  Code2,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldCheck,
  Zap,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Transaction } from '../types';

interface TxDetailModalProps {
  tx: Transaction | null;
  onClose: () => void;
  onSelectAddress: (address: string) => void;
  onSelectBlock: (blockNumber: number) => void;
}

export const TxDetailModal: React.FC<TxDetailModalProps> = ({
  tx,
  onClose,
  onSelectAddress,
  onSelectBlock,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'decoded' | 'logs' | 'raw'>('decoded');
  const [rawExpanded, setRawExpanded] = useState(false);

  if (!tx) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Derive human-readable decoded parameters based on transaction method & type
  const getDecodedParameters = () => {
    if (tx.type === 'SWAP') {
      return [
        { name: 'router', type: 'address', value: tx.to, label: tx.toLabel || 'CookieSwap Router' },
        { name: 'amountIn', type: 'uint256', value: `${tx.valueCookie.toFixed(2)} COOKIE`, raw: `${Math.round(tx.valueCookie * 1e18)}` },
        { name: 'amountOutMin', type: 'uint256', value: `${(tx.valueUsd * 0.995).toFixed(2)} ckUSD (0.5% max slippage)`, raw: '49750000000' },
        { name: 'path', type: 'address[]', value: '[COOKIE_NATIVE ➔ ckUSD_POOL]' },
        { name: 'recipient', type: 'address', value: tx.from },
        { name: 'deadline', type: 'uint256', value: `${new Date(Date.now() + 600000).toLocaleTimeString()} UTC` },
      ];
    }
    if (tx.type === 'TRANSFER') {
      return [
        { name: 'recipient', type: 'address', value: tx.to, label: tx.toLabel || 'Direct Account' },
        { name: 'amount', type: 'uint256', value: `${tx.valueCookie.toFixed(2)} COOKIE (≈ $${tx.valueUsd.toLocaleString()})`, raw: `${Math.round(tx.valueCookie * 1e18)}` },
      ];
    }
    if (tx.type === 'BRIDGE') {
      return [
        { name: 'bridgeGateway', type: 'address', value: tx.to, label: 'Stargate Solana Bridge' },
        { name: 'destinationChainId', type: 'uint32', value: '1399811149 (Solana Mainnet-Beta)' },
        { name: 'recipient', type: 'bytes32', value: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU' },
        { name: 'tokenAmount', type: 'uint256', value: `${tx.valueCookie.toFixed(2)} COOKIE` },
      ];
    }
    return [
      { name: 'targetContract', type: 'address', value: tx.to, label: tx.toLabel || 'Smart Contract' },
      { name: 'callValue', type: 'uint256', value: `${tx.valueCookie} COOKIE` },
      { name: 'functionSelector', type: 'bytes4', value: tx.method ? `0x${tx.method.slice(0, 8)}` : '0xa9059cbb' },
    ];
  };

  const decodedParams = getDecodedParameters();

  // Synthetic raw payload representation
  const rawPayload = {
    hash: tx.hash,
    status: tx.status,
    blockNumber: tx.blockNumber,
    timestamp: tx.timestamp,
    from: tx.from,
    to: tx.to,
    value: `${tx.valueCookie} COOKIE`,
    gasLimit: 300000,
    gasUsed: tx.gasUsed,
    gasPrice: `${tx.gasPriceGwei} Gwei`,
    maxFeePerGas: `${(tx.gasPriceGwei + 2.5).toFixed(1)} Gwei`,
    maxPriorityFeePerGas: '1.5 Gwei',
    nonce: tx.nonce,
    method: tx.method || 'transfer(address,uint256)',
    input: `0x${Array.from({ length: 128 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#09090b] border border-[#27272a] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-[#121214] border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-black border border-[#27272a] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans text-[17px] sm:text-[18px] font-bold text-white">
                  Transaction Overview
                </h3>
                <span className="font-mono text-[11px] font-bold text-black bg-white px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-black" />
                  {tx.status}
                </span>
                <span className="font-mono text-[11px] font-semibold text-white bg-[#18181b] border border-[#3f3f46] px-2 py-0.5 rounded uppercase">
                  {tx.type}
                </span>
              </div>
              <p className="font-mono text-[12px] text-zinc-400">
                Included in Block #{tx.blockNumber} • {tx.timeAgo}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-[13px]">
          
          {/* 1. Transaction Hash Banner with Instant 1-Click Copy */}
          <div className="p-3 bg-black border border-[#27272a] rounded-xl flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 block">
                Transaction Hash
              </span>
              <span className="font-mono text-[13px] sm:text-[14px] font-bold text-white truncate block mt-0.5">
                {tx.hash}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(tx.hash, 'hash')}
              className="p-2 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white rounded-lg border border-[#27272a] transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer font-mono text-[11px]"
              title="Copy Hash"
            >
              {copiedField === 'hash' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="text-white font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* 2. Visual Execution Route / Flow Diagram (From -> Method -> To) */}
          <div className="p-4 sm:p-5 bg-[#121214] border border-[#27272a] rounded-xl shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Execution Flow Route
              </span>
              <span className="font-mono text-[11px] text-zinc-400">
                Nonce #{tx.nonce}
              </span>
            </div>

            {/* Desktop Horizontal Route / Mobile Vertical */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
              
              {/* From Card (3 cols) */}
              <div className="md:col-span-3 p-3 bg-black border border-[#27272a] rounded-lg">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">From (Sender)</span>
                <div className="flex items-center justify-between gap-1.5 mt-1">
                  <button
                    onClick={() => onSelectAddress(tx.from)}
                    className="font-mono text-[12px] font-semibold text-white hover:underline truncate cursor-pointer text-left"
                  >
                    {tx.from}
                  </button>
                  <button
                    onClick={() => copyToClipboard(tx.from, 'from')}
                    className="text-zinc-500 hover:text-white p-1 cursor-pointer"
                  >
                    {copiedField === 'from' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Action / Method Center (1 col) */}
              <div className="md:col-span-1 flex flex-col items-center justify-center py-1">
                <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5 text-black hidden md:block" />
                  <ArrowDown className="w-3.5 h-3.5 text-black md:hidden" />
                </div>
              </div>

              {/* To Card (3 cols) */}
              <div className="md:col-span-3 p-3 bg-black border border-[#27272a] rounded-lg">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                  Interacted With ({tx.toLabel ? 'Contract' : 'Recipient'})
                </span>
                <div className="flex items-center justify-between gap-1.5 mt-1">
                  <button
                    onClick={() => onSelectAddress(tx.to)}
                    className="font-mono text-[12px] font-semibold text-white hover:underline truncate cursor-pointer text-left"
                  >
                    {tx.toLabel ? `${tx.toLabel} (${tx.to.slice(0, 6)}...)` : tx.to}
                  </button>
                  <button
                    onClick={() => copyToClipboard(tx.to, 'to')}
                    className="text-zinc-500 hover:text-white p-1 cursor-pointer"
                  >
                    {copiedField === 'to' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

            </div>

            {/* Value Transferred & Function Call Badge */}
            <div className="pt-3 border-t border-[#27272a] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-zinc-500">Function:</span>
                <span className="font-mono text-[12px] font-bold text-white bg-black px-2 py-0.5 rounded border border-[#27272a]">
                  {tx.method || 'transfer'}(...)
                </span>
              </div>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-[11px] text-zinc-500">Value:</span>
                <span className="text-[15px] font-bold text-white">
                  {tx.valueCookie.toFixed(2)} COOKIE
                </span>
                <span className="text-[12px] text-zinc-400">
                  (≈ ${tx.valueUsd.toLocaleString()})
                </span>
              </div>
            </div>
          </div>

          {/* 3. Decoded Parameters Table (Visually Prioritized!) */}
          <div className="bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden shadow-md">
            <div className="px-4 py-3 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <h4 className="font-sans text-[14px] font-bold text-white">
                  Decoded Function Parameters
                </h4>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-black bg-white px-2 py-0.5 rounded font-bold">
                Verified ABI
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[12px]">
                <thead className="bg-black text-zinc-500 text-[10px] uppercase tracking-wider border-b border-[#27272a]">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Parameter</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Decoded Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f23]">
                  {decodedParams.map((param, index) => (
                    <tr key={param.name} className="hover:bg-[#18181b]/60 transition-colors">
                      <td className="px-4 py-2.5 text-zinc-500">{index}</td>
                      <td className="px-4 py-2.5 font-semibold text-white">{param.name}</td>
                      <td className="px-4 py-2.5 text-zinc-400">{param.type}</td>
                      <td className="px-4 py-2.5 text-zinc-200 break-all">
                        {param.label ? (
                          <span>
                            <strong className="text-white font-bold">{param.label}</strong> ({param.value})
                          </span>
                        ) : (
                          param.value
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Execution Telemetry & Gas Consumption */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3 bg-black border border-[#27272a] rounded-lg">
              <span className="text-[10px] uppercase text-zinc-500 block">Gas Used</span>
              <span className="text-[14px] font-bold text-white mt-0.5 block">
                {tx.gasUsed.toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-500">of 300,000 limit (42.8%)</span>
            </div>

            <div className="p-3 bg-black border border-[#27272a] rounded-lg">
              <span className="text-[10px] uppercase text-zinc-500 block">Gas Price</span>
              <span className="text-[14px] font-bold text-white mt-0.5 block">
                {tx.gasPriceGwei} Gwei
              </span>
              <span className="text-[10px] text-zinc-500">Base: 12.0 • Tip: 0.4</span>
            </div>

            <div className="p-3 bg-black border border-[#27272a] rounded-lg">
              <span className="text-[10px] uppercase text-zinc-500 block">Transaction Fee</span>
              <span className="text-[14px] font-bold text-white mt-0.5 block">
                ${tx.feeUsd.toFixed(4)}
              </span>
              <span className="text-[10px] text-zinc-500">0.00159 COOKIE</span>
            </div>

            <div className="p-3 bg-black border border-[#27272a] rounded-lg">
              <span className="text-[10px] uppercase text-zinc-500 block">Block Height</span>
              <button
                onClick={() => onSelectBlock(tx.blockNumber)}
                className="text-[14px] font-bold text-white hover:underline mt-0.5 block cursor-pointer"
              >
                #{tx.blockNumber}
              </button>
              <span className="text-[10px] text-zinc-500">Finalized slot</span>
            </div>
          </div>

          {/* 5. Collapsible Raw Transaction Payload / Hex Data */}
          <div className="border border-[#27272a] rounded-xl overflow-hidden bg-black">
            <button
              onClick={() => setRawExpanded(!rawExpanded)}
              className="w-full px-4 py-3 bg-[#121214] hover:bg-[#18181b] flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 font-mono text-[12px] text-zinc-300">
                <Code2 className="w-4 h-4 text-white" />
                <span className="font-semibold">Raw Transaction Payload (JSON / Bytecode)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-zinc-500">
                  {rawExpanded ? 'Hide' : 'Show Hex'}
                </span>
                {rawExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
              </div>
            </button>

            {rawExpanded && (
              <div className="p-4 bg-black border-t border-[#27272a] font-mono text-[11px] text-zinc-300 overflow-x-auto relative">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(rawPayload, null, 2), 'rawJson')}
                  className="absolute top-3 right-3 px-2 py-1 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white rounded border border-[#27272a] text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'rawJson' ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>Copy JSON</span>
                </button>
                <pre className="text-zinc-400 whitespace-pre font-mono leading-relaxed">
                  {JSON.stringify(rawPayload, null, 2)}
                </pre>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#121214] border-t border-[#27272a] flex items-center justify-between">
          <div className="text-[11px] font-mono text-zinc-500 hidden sm:block">
            Validated by Cookie Chain Consensus Engine
          </div>
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

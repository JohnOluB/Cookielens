import React, { useState } from 'react';
import { X, User, Copy, Check, ExternalLink, ArrowDownLeft, ArrowUpRight, Coins, Wallet, Layers, QrCode } from 'lucide-react';
import { Transaction } from '../types';

interface AddressDetailModalProps {
  address: string | null;
  onClose: () => void;
  transactions: Transaction[];
  onSelectTx: (tx: Transaction) => void;
}

export const AddressDetailModal: React.FC<AddressDetailModalProps> = ({
  address,
  onClose,
  transactions,
  onSelectTx,
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [showQr, setShowQr] = useState(false);

  if (!address) return null;

  // Filter transactions related to this address
  const allTxs = transactions.filter(
    (t) =>
      t.from.toLowerCase().includes(address.toLowerCase()) ||
      t.to.toLowerCase().includes(address.toLowerCase())
  );

  const filteredTxs = allTxs.filter((t) => {
    if (filterType === 'in') return t.to.toLowerCase().includes(address.toLowerCase());
    if (filterType === 'out') return t.from.toLowerCase().includes(address.toLowerCase());
    return true;
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const simulatedBalance = 2450.85;
  const simulatedUsd = simulatedBalance * 1.42;

  const portfolio = [
    { name: 'Cookie USD', symbol: 'ckUSD', balance: '1,500.00', valueUsd: '$1,500.00', change: '+0.01%' },
    { name: 'Wrapped Solana', symbol: 'ckSOL', balance: '8.40', valueUsd: '$1,582.98', change: '+4.82%' },
    { name: 'CookieSwap Governance', symbol: 'CSWAP', balance: '340.00', valueUsd: '$1,305.60', change: '-1.15%' },
    { name: 'Genesis Pass NFT', symbol: 'CKGEN', balance: '1 Item', valueUsd: '$120.70', change: '+8.50%' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#09090b] border border-[#27272a] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-[#121214] border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-black border border-[#27272a] flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-sans text-[17px] sm:text-[18px] font-bold text-white">
                Account & Wallet Overview
              </h3>
              <p className="font-mono text-[11px] text-zinc-400">Cookie Chain Native Address</p>
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-[13px]">
          
          {/* Address Bar */}
          <div className="p-3 bg-black border border-[#27272a] rounded-xl flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                Account Address
              </span>
              <span className="font-mono text-[13px] sm:text-[14px] font-bold text-white truncate block mt-0.5">
                {address}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowQr(!showQr)}
                className="p-2 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white rounded-lg border border-[#27272a] transition-colors cursor-pointer"
                title="Toggle QR Code"
              >
                <QrCode className="w-4 h-4 text-zinc-400" />
              </button>
              <button
                onClick={() => copyToClipboard(address, 'addr')}
                className="p-2 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white rounded-lg border border-[#27272a] transition-colors flex items-center gap-1.5 cursor-pointer font-mono text-[11px]"
              >
                {copied === 'addr' ? (
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
          </div>

          {/* QR Code expansion */}
          {showQr && (
            <div className="p-4 bg-black border border-[#27272a] rounded-xl flex flex-col items-center justify-center animate-in fade-in">
              <div className="bg-white p-3 rounded-lg shadow-md">
                {/* SVG QR Code pattern representation */}
                <div className="w-32 h-32 bg-black flex items-center justify-center text-white font-mono text-[9px] p-2 text-center rounded">
                  <div className="border-2 border-white p-2">
                    COOKIE CHAIN
                    <br />
                    {address.slice(0, 10)}...
                  </div>
                </div>
              </div>
              <span className="font-mono text-[11px] text-zinc-400 mt-2">
                Scan with Nightly Wallet or mobile web3 client
              </span>
            </div>
          )}

          {/* Balance & Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Native Balance Card */}
            <div className="p-4 bg-[#121214] border border-[#27272a] rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider block mb-1">
                  Native COOKIE Balance
                </span>
                <div className="font-mono text-[24px] sm:text-[26px] font-bold text-white">
                  {simulatedBalance.toLocaleString()} COOKIE
                </div>
                <div className="font-mono text-[12px] text-zinc-400 mt-0.5">
                  ≈ ${simulatedUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-[#27272a] flex items-center justify-between font-mono text-[11px] text-zinc-500">
                <span>Status: <strong className="text-white">Active</strong></span>
                <span>Nonce: <strong className="text-white">42</strong></span>
              </div>
            </div>

            {/* Token Portfolio Breakdown */}
            <div className="p-4 bg-[#121214] border border-[#27272a] rounded-xl">
              <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider block mb-2">
                Token Portfolio Breakdown
              </span>
              <div className="space-y-2">
                {portfolio.map((t) => (
                  <div
                    key={t.symbol}
                    className="p-2 bg-black border border-[#27272a] rounded-lg flex items-center justify-between font-mono text-[11px]"
                  >
                    <div>
                      <span className="font-bold text-white">{t.symbol}</span>
                      <span className="text-zinc-500 ml-1 text-[10px]">({t.name})</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{t.balance}</div>
                      <div className="text-[10px] text-zinc-400">{t.valueUsd}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Transaction History Section */}
          <div className="bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden shadow-md">
            
            {/* Table Header with Filters */}
            <div className="px-4 py-3 bg-[#18181b] border-b border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-white" />
                <h4 className="font-sans text-[14px] font-bold text-white">
                  Transaction History ({filteredTxs.length})
                </h4>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-[#27272a]">
                {(['all', 'in', 'out'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilterType(mode)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold transition-all cursor-pointer uppercase ${
                      filterType === mode
                        ? 'bg-white text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {mode === 'all' ? 'All' : mode === 'in' ? 'Incoming' : 'Outgoing'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dense Table */}
            {filteredTxs.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-mono text-[12px]">
                No matching transactions found for this address.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-black text-zinc-500 text-[10px] uppercase tracking-wider border-b border-[#27272a]">
                    <tr>
                      <th className="px-3 py-2">Tx Hash</th>
                      <th className="px-3 py-2">Method</th>
                      <th className="px-3 py-2">Block</th>
                      <th className="px-3 py-2">Age</th>
                      <th className="px-3 py-2">Direction</th>
                      <th className="px-3 py-2">Value</th>
                      <th className="px-3 py-2">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f23]">
                    {filteredTxs.map((t) => {
                      const isIncoming = t.to.toLowerCase().includes(address.toLowerCase());
                      return (
                        <tr
                          key={t.hash}
                          onClick={() => onSelectTx(t)}
                          className="hover:bg-[#18181b]/60 transition-colors cursor-pointer group"
                        >
                          <td className="px-3 py-2.5 text-white font-bold group-hover:underline">
                            {t.hash.slice(0, 8)}...{t.hash.slice(-4)}
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="px-1.5 py-0.5 rounded bg-black border border-[#27272a] text-zinc-300 text-[10px]">
                              {t.type}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-zinc-400">#{t.blockNumber}</td>
                          <td className="px-3 py-2.5 text-zinc-500">{t.timeAgo}</td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                isIncoming
                                  ? 'bg-white text-black'
                                  : 'bg-[#18181b] text-white border border-[#3f3f46]'
                              }`}
                            >
                              {isIncoming ? 'IN' : 'OUT'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-white font-bold">
                            {t.valueCookie.toFixed(2)} COOKIE
                          </td>
                          <td className="px-3 py-2.5 text-zinc-500">
                            ${t.feeUsd.toFixed(3)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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

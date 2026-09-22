import React, { useState } from 'react';
import {
  Zap,
  Check,
  Copy,
  Share2,
  ExternalLink,
  Code2,
  Clock,
} from 'lucide-react';
import { Transaction } from '../types';

interface TxDecoderViewProps {
  onSelectTx?: (tx: Transaction) => void;
}

interface DecodedTxData {
  signature: string;
  status: 'Confirmed' | 'Finalized' | 'Failed';
  slot: number;
  slotState: string;
  actionText: {
    verb: string;
    fromAmount: string;
    fromToken: string;
    toAmount: string;
    toToken: string;
  };
  fromAddress: string;
  toAddress: string;
  program: string;
  feeCook: string;
  feeUsd: string;
  timestampAgo: string;
  timestampExact: string;
  executionParams: string;
  rawPayload: object;
}

const PRESET_TXS: Record<string, DecodedTxData> = {
  swap: {
    signature: '5J8k2m9n3p7q1r5s9t2u6v0wA8zL5x1Y7mQ4vR8tE3w9pL2c...',
    status: 'Confirmed',
    slot: 284912014,
    slotState: 'Finalized',
    actionText: {
      verb: 'Swapped',
      fromAmount: '100',
      fromToken: 'COOK',
      toAmount: '50',
      toToken: 'TOKEN',
    },
    fromAddress: '0x7f2a...9c41',
    toAddress: '0x3b18...7a01',
    program: 'CookieSwap v2.1',
    feeCook: '0.000005 COOK',
    feeUsd: '$0.000007',
    timestampAgo: '2 seconds ago',
    timestampExact: 'May 28, 2025 14:02:18 UTC',
    executionParams: '0.1% slippage (Success)',
    rawPayload: {
      signature: '5J8k2m9n3p7q1r5s9t2u6v0wA8zL5x1Y7mQ4vR8tE3w9pL2c...',
      slot: 284912014,
      computeUnitsConsumed: 32410,
      programId: 'CookSwapRouter1111111111111111111111111111',
      instructions: [
        {
          program: 'CookieSwap',
          type: 'exactInputSingle',
          data: {
            amountIn: '100000000000',
            minAmountOut: '49950000000',
            tokenIn: 'COOK_NATIVE',
            tokenOut: '0x9b04...3d12',
          },
        },
      ],
      fee: 5000,
      recentBlockhash: 'Bq7f9HkYVz3P2NmC6wLa4xQ8eR1tJ0sD',
    },
  },
  stake: {
    signature: '3bZ8m2n9p7q1r5s9t2u6v0wA8zL5x1Y7mQ4vR8tE3w9pL2c6yX4qN1vB8...',
    status: 'Confirmed',
    slot: 284912089,
    slotState: 'Finalized',
    actionText: {
      verb: 'Delegated Stake',
      fromAmount: '250',
      fromToken: 'COOK',
      toAmount: 'ApexValidator',
      toToken: 'NODE',
    },
    fromAddress: '0x18a4...2f89',
    toAddress: '0xval9...4a11',
    program: 'StakeProgram v1.4',
    feeCook: '0.000002 COOK',
    feeUsd: '$0.000003',
    timestampAgo: '14 seconds ago',
    timestampExact: 'May 28, 2025 14:02:06 UTC',
    executionParams: 'Lockup: 0 epochs (Success)',
    rawPayload: {
      signature: '3bZ8m2n9p7q1r5s9t2u6v0wA8zL5x1Y7mQ4vR8tE3w9pL2c6yX4qN1vB8...',
      slot: 284912089,
      computeUnitsConsumed: 18200,
      programId: 'Stake11111111111111111111111111111111111111',
      instructions: [
        {
          program: 'StakeProgram',
          type: 'delegateStake',
          data: {
            stakeAmount: '250000000000',
            validatorVoteAddress: '0xval9...4a11',
          },
        },
      ],
      fee: 2000,
      recentBlockhash: 'Zk3f8LkYVz3P2NmC6wLa4xQ8eR1tJ0sA',
    },
  },
  mint: {
    signature: '4xP9m1vB2c8yL7mQ6vR3tE5w9pL1c0yX4qN8vB7k2m9n3p7q1r5s9t2...',
    status: 'Confirmed',
    slot: 284912110,
    slotState: 'Finalized',
    actionText: {
      verb: 'Minted NFT',
      fromAmount: '1',
      fromToken: 'CookiePunk #402',
      toAmount: '25',
      toToken: 'COOK',
    },
    fromAddress: '0x88c2...11d9',
    toAddress: '0xmint...cc02',
    program: 'MetaplexTokenMetadata v1.2',
    feeCook: '0.000010 COOK',
    feeUsd: '$0.000014',
    timestampAgo: '35 seconds ago',
    timestampExact: 'May 28, 2025 14:01:45 UTC',
    executionParams: 'Edition: MasterEditionV2 (Success)',
    rawPayload: {
      signature: '4xP9m1vB2c8yL7mQ6vR3tE5w9pL1c0yX4qN8vB7k2m9n3p7q1r5s9t2...',
      slot: 284912110,
      computeUnitsConsumed: 48900,
      programId: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
      instructions: [
        {
          program: 'MetaplexTokenMetadata',
          type: 'createMetadataAccountV3',
          data: {
            name: 'CookiePunk #402',
            symbol: 'CPUNK',
            sellerFeeBasisPoints: 500,
          },
        },
      ],
      fee: 10000,
      recentBlockhash: 'Hq8f9HkYVz3P2NmC6wLa4xQ8eR1tJ0sX',
    },
  },
};

export const TxDecoderView: React.FC<TxDecoderViewProps> = ({
  onSelectTx,
  onNavigateDevelopers,
}) => {
  const [inputHash, setInputHash] = useState(
    '5J8k2m9n3p7q1r5s9t2u6v0wA8zL5x1Y7mQ4vR8tE3w9pL2c...'
  );
  const [activeDataKey, setActiveDataKey] = useState<'swap' | 'stake' | 'mint'>('swap');
  const [isDecoding, setIsDecoding] = useState(false);
  const [isRawOpen, setIsRawOpen] = useState(true);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const currentData = PRESET_TXS[activeDataKey];

  const handleDecode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsDecoding(true);
    setTimeout(() => {
      setIsDecoding(false);
    }, 350);
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputHash(text.trim());
          handleDecode();
          return;
        }
      }
    } catch {
      // Fallback
    }
    // Toggle sample if clipboard access restricted in iframe
    if (activeDataKey === 'swap') {
      setActiveDataKey('stake');
      setInputHash(PRESET_TXS.stake.signature);
    } else if (activeDataKey === 'stake') {
      setActiveDataKey('mint');
      setInputHash(PRESET_TXS.mint.signature);
    } else {
      setActiveDataKey('swap');
      setInputHash(PRESET_TXS.swap.signature);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 1800);
  };

  const handleCopySummary = () => {
    const summary = `cookieLens Decoded Tx:
Signature: ${currentData.signature}
Status: ${currentData.status} (Slot #${currentData.slot.toLocaleString()})
Action: ${currentData.actionText.verb} ${currentData.actionText.fromAmount} ${currentData.actionText.fromToken} for ${currentData.actionText.toAmount} ${currentData.actionText.toToken}
From: ${currentData.fromAddress}
To: ${currentData.toAddress}
Program: ${currentData.program}
Fee: ${currentData.feeCook} (${currentData.feeUsd})
Timestamp: ${currentData.timestampExact}`;
    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedItem('link');
      setTimeout(() => setCopiedItem(null), 1800);
    }
  };

  return (
    <div className="w-full bg-black text-zinc-200 min-h-screen py-10 px-4">
      {/* Centered container for Transaction Decoder (max-w-[760px]) */}
      <div className="w-full max-w-[760px] mx-auto">
        {/* Title & Subtitle Section */}
        <section className="mb-8" id="page-heading">
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="inline-block w-2 h-2 rounded-sm bg-white"></span>
            <h1 className="text-[20px] font-bold text-white tracking-tight">
              Transaction decoder
            </h1>
          </div>
          <p className="text-[14px] text-zinc-400 leading-relaxed">
            Paste a transaction signature to see a human-readable breakdown of what happened on-chain.
          </p>

          {/* Quick preset selector for instant demonstration */}
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-zinc-500 font-mono text-[11px] uppercase tracking-wider">
              Sample payloads:
            </span>
            <button
              onClick={() => {
                setActiveDataKey('swap');
                setInputHash(PRESET_TXS.swap.signature);
              }}
              className={`px-2 py-0.5 rounded font-mono transition-colors cursor-pointer ${
                activeDataKey === 'swap'
                  ? 'bg-white text-black font-bold border border-white'
                  : 'bg-[#09090b] text-zinc-400 hover:text-white border border-[#27272a]'
              }`}
            >
              Token Swap
            </button>
            <button
              onClick={() => {
                setActiveDataKey('stake');
                setInputHash(PRESET_TXS.stake.signature);
              }}
              className={`px-2 py-0.5 rounded font-mono transition-colors cursor-pointer ${
                activeDataKey === 'stake'
                  ? 'bg-white text-black font-bold border border-white'
                  : 'bg-[#09090b] text-zinc-400 hover:text-white border border-[#27272a]'
              }`}
            >
              Stake Delegate
            </button>
            <button
              onClick={() => {
                setActiveDataKey('mint');
                setInputHash(PRESET_TXS.mint.signature);
              }}
              className={`px-2 py-0.5 rounded font-mono transition-colors cursor-pointer ${
                activeDataKey === 'mint'
                  ? 'bg-white text-black font-bold border border-white'
                  : 'bg-[#09090b] text-zinc-400 hover:text-white border border-[#27272a]'
              }`}
            >
              NFT Mint
            </button>
          </div>
        </section>

        {/* BEGIN: InputCard */}
        <section
          className="bg-[#09090b] border border-[#27272a] rounded-xl p-5 shadow-lg mb-6"
          id="decoder-input-card"
        >
          <form className="space-y-3" onSubmit={handleDecode}>
            <div>
              <label
                className="block text-[13px] font-medium text-zinc-300 mb-2"
                htmlFor="tx-hash-input"
              >
                Transaction signature
              </label>
              <div className="relative">
                <input
                  id="tx-hash-input"
                  type="text"
                  spellCheck="false"
                  value={inputHash}
                  onChange={(e) => setInputHash(e.target.value)}
                  placeholder="Paste transaction hash..."
                  className="w-full h-10 px-3.5 pr-20 bg-black border border-[#27272a] rounded-lg text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="button"
                  title="Paste from clipboard or sample"
                  onClick={handlePaste}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs font-mono uppercase bg-[#18181b] px-2 py-0.5 rounded border border-[#27272a] transition-colors cursor-pointer"
                >
                  Paste
                </button>
              </div>
            </div>

            <button
              id="decode-tx-submit-btn"
              type="submit"
              disabled={isDecoding}
              className="w-full h-10 mt-3 bg-white hover:bg-zinc-200 text-black font-bold rounded-lg text-sm flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-60"
            >
              {isDecoding ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-current stroke-[2.5]" />
              )}
              <span>{isDecoding ? 'Decoding Bytecode...' : 'Decode transaction'}</span>
            </button>
          </form>
        </section>
        {/* END: InputCard */}

        {/* BEGIN: DecodedOutputCard */}
        <section
          className="bg-[#09090b] border border-[#27272a] rounded-xl p-6 shadow-xl mb-6 relative overflow-hidden"
          id="decoder-output-result"
        >
          {/* Subtle top edge specular highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Status & Slot Pill Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#27272a]">
            {/* Status indicator */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-black border border-[#27272a] flex items-center justify-center text-white">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold font-mono">
                  Status
                </div>
                <div className="text-[16px] font-bold text-white">
                  {currentData.status}
                </div>
              </div>
            </div>

            {/* Telemetry slot pill */}
            <div className="inline-flex items-center space-x-2 bg-black border border-[#27272a] px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>Slot #{currentData.slot.toLocaleString()}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400 font-sans">{currentData.slotState}</span>
            </div>
          </div>

          {/* Action Hero Callout */}
          <div className="py-6 border-b border-[#27272a]" id="hero-action-summary">
            <div className="text-[12px] text-zinc-500 font-medium uppercase tracking-wider mb-1 font-mono">
              Action
            </div>
            <div className="text-[18px] font-medium text-white flex items-center flex-wrap gap-2">
              <span>{currentData.actionText.verb}</span>
              <span className="font-mono text-black bg-white font-bold px-2 py-0.5 rounded">
                {currentData.actionText.fromAmount} {currentData.actionText.fromToken}
              </span>
              <span className="text-zinc-400">for</span>
              <span className="font-mono text-white font-bold bg-[#18181b] px-2 py-0.5 rounded border border-[#27272a]">
                {currentData.actionText.toAmount} {currentData.actionText.toToken}
              </span>
            </div>
          </div>

          {/* Key Details Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 py-6 border-b border-[#27272a] text-sm"
            id="tx-details-grid"
          >
            {/* From Address */}
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-zinc-500 mb-1 font-mono">
                From
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[13px] text-white">
                  {currentData.fromAddress}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(currentData.fromAddress, 'from')}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  title="Copy sender address"
                >
                  {copiedItem === 'from' ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* To Address */}
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-zinc-500 mb-1 font-mono">
                To (Recipient)
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[13px] text-white">
                  {currentData.toAddress}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(currentData.toAddress, 'to')}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  title="Copy recipient address"
                >
                  {copiedItem === 'to' ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Smart Program / Contract */}
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-zinc-500 mb-1 font-mono">
                Program
              </span>
              <span className="text-[13px] text-white font-bold">
                {currentData.program}
              </span>
            </div>

            {/* Transaction Fee */}
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-zinc-500 mb-1 font-mono">
                Gas / Network Fee
              </span>
              <span className="font-mono text-[13px] text-white">
                {currentData.feeCook}{' '}
                <span className="text-zinc-400">({currentData.feeUsd})</span>
              </span>
            </div>

            {/* Time Telemetry */}
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-zinc-500 mb-1 font-mono">
                Timestamp
              </span>
              <div className="flex items-center space-x-1 text-[13px] text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-zinc-500 mr-1" />
                <span>{currentData.timestampAgo}</span>
                <span className="text-zinc-500 text-xs font-mono">
                  ({currentData.timestampExact})
                </span>
              </div>
            </div>

            {/* Slippage & Parameters */}
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-zinc-500 mb-1 font-mono">
                Execution Parameters
              </span>
              <span className="text-[13px] text-white font-mono">
                {currentData.executionParams}
              </span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div
            className="pt-5 flex flex-wrap items-center gap-3"
            id="decoder-actions"
          >
            {/* View on Explorer */}
            <button
              type="button"
              onClick={() => {
                if (onSelectTx) {
                  onSelectTx({
                    hash: currentData.signature,
                    timeAgo: currentData.timestampAgo,
                    timestamp: currentData.timestampExact,
                    blockNumber: 4921048,
                    from: currentData.fromAddress,
                    to: currentData.toAddress,
                    type: 'SWAP',
                    valueCookie: 100,
                    valueUsd: 142.0,
                    feeUsd: 0.000007,
                    gasPriceGwei: 12,
                    gasUsed: 32410,
                    status: 'SUCCESS',
                    nonce: 419,
                    method: currentData.program,
                  });
                }
              }}
              className="flex items-center space-x-1.5 bg-black hover:bg-[#18181b] border border-[#27272a] rounded-lg px-3.5 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span>View on chain</span>
            </button>

            {/* Copy Summary */}
            <button
              type="button"
              id="copySummaryBtn"
              onClick={handleCopySummary}
              className="flex items-center space-x-1.5 bg-black hover:bg-[#18181b] border border-[#27272a] rounded-lg px-3.5 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Share Breakdown */}
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center space-x-1.5 bg-black hover:bg-[#18181b] border border-[#27272a] rounded-lg px-3.5 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              {copiedItem === 'link' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </section>
        {/* END: DecodedOutputCard */}

        {/* BEGIN: RawJsonDrawer */}
        <section
          className="bg-[#09090b] border border-[#27272a] rounded-xl p-4"
          id="raw-instruction-drawer"
        >
          {/* Toggle header */}
          <button
            type="button"
            id="toggleRawPayload"
            onClick={() => setIsRawOpen(!isRawOpen)}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-white hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-white" />
              <span>Raw transaction (SVM Instruction Payload)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono bg-black px-2 py-0.5 rounded text-zinc-400 border border-[#27272a]">
                JSON
              </span>
              <span className="text-xs text-white font-mono font-bold">
                {isRawOpen ? 'Hide raw [-]' : 'Show raw [+]'}
              </span>
            </div>
          </button>

          {/* Collapsible code block container */}
          {isRawOpen && (
            <div className="mt-4 pt-3 border-t border-[#27272a]">
              <pre className="bg-black p-4 rounded-lg font-mono text-[12px] text-zinc-300 overflow-x-auto max-h-[280px] border border-[#27272a] leading-relaxed scrollbar-thin">
                <code>
                  <span className="text-zinc-500">&#123;</span>{'\n'}
                  {'  '}<span className="text-white">"signature"</span>: <span className="text-zinc-400">"{currentData.signature}"</span>,{'\n'}
                  {'  '}<span className="text-white">"slot"</span>: <span className="text-zinc-300">{currentData.slot}</span>,{'\n'}
                  {'  '}<span className="text-white">"computeUnitsConsumed"</span>: <span className="text-zinc-300">32410</span>,{'\n'}
                  {'  '}<span className="text-white">"programId"</span>: <span className="text-zinc-400">"CookSwapRouter1111111111111111111111111111"</span>,{'\n'}
                  {'  '}<span className="text-white">"instructions"</span>: [{'\n'}
                  {'    '}&#123;{'\n'}
                  {'      '}<span className="text-white">"program"</span>: <span className="text-zinc-400">"{currentData.program.split(' ')[0]}"</span>,{'\n'}
                  {'      '}<span className="text-white">"type"</span>: <span className="text-zinc-400">"exactInputSingle"</span>,{'\n'}
                  {'      '}<span className="text-white">"data"</span>: &#123;{'\n'}
                  {'        '}<span className="text-white">"amountIn"</span>: <span className="text-zinc-300">"100000000000"</span>,{'\n'}
                  {'        '}<span className="text-white">"minAmountOut"</span>: <span className="text-zinc-300">"49950000000"</span>,{'\n'}
                  {'        '}<span className="text-white">"tokenIn"</span>: <span className="text-zinc-400">"COOK_NATIVE"</span>,{'\n'}
                  {'        '}<span className="text-white">"tokenOut"</span>: <span className="text-zinc-400">"0x9b04...3d12"</span>{'\n'}
                  {'      '}&#125;{'\n'}
                  {'    '}&#125;{'\n'}
                  {'  '}],{'\n'}
                  {'  '}<span className="text-white">"fee"</span>: <span className="text-zinc-300">5000</span>,{'\n'}
                  {'  '}<span className="text-white">"recentBlockhash"</span>: <span className="text-zinc-400">"Bq7f9HkYVz3P2NmC6wLa4xQ8eR1tJ0sD"</span>{'\n'}
                  <span className="text-zinc-500">&#125;</span>
                </code>
              </pre>
            </div>
          )}
        </section>
        {/* END: RawJsonDrawer */}
      </div>
    </div>
  );
};

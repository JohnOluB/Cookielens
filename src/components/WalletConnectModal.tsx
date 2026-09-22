import React, { useState } from 'react';
import {
  X,
  Wallet,
  Shield,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  Download,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import { useNightlyWallet, NIGHTLY_INSTALL_URL, NIGHTLY_WEBSITE_URL } from '../context/NightlyWalletContext';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose }) => {
  const {
    isInstalled,
    isConnecting,
    wallet,
    error,
    activeNetwork,
    connectNightly,
    disconnectNightly,
    clearError,
    openInstallUrl,
  } = useNightlyWallet();

  const [selectedTab, setSelectedTab] = useState<'evm' | 'solana'>('evm');
  const [showTroubleshoot, setShowTroubleshoot] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleConnect = async (mode: 'evm' | 'solana' | 'sandbox') => {
    clearError();
    const success = await connectNightly(mode);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#09090b] border border-[#27272a] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#121214] border-b border-[#27272a] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Nightly Avatar / Logo */}
            <div className="w-8 h-8 rounded-lg bg-black border border-[#27272a] flex items-center justify-center shadow-sm">
              <span className="text-base font-bold text-white">🌙</span>
            </div>
            <div>
              <h3 className="font-sans text-[16px] font-bold text-white flex items-center gap-1.5">
                <span>Nightly Wallet</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#18181b] text-white border border-[#3f3f46]">
                  Extension
                </span>
              </h3>
              <p className="font-mono text-[11px] text-zinc-400">Multi-Chain Web3 Access</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-black hover:bg-[#18181b] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Extension Detection Status Badge */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-[12px] ${
              isInstalled
                ? 'bg-black border-white/30 text-white'
                : 'bg-black border-[#27272a] text-zinc-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {isInstalled ? (
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-zinc-400 shrink-0" />
              )}
              <span className="font-medium text-white">
                {isInstalled
                  ? 'Nightly Extension Detected'
                  : 'Nightly Extension Not Detected'}
              </span>
            </div>
            {!isInstalled && (
              <button
                onClick={openInstallUrl}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-white text-black text-[11px] font-bold transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Install</span>
              </button>
            )}
          </div>

          {/* Error Alert if connection failed */}
          {error && (
            <div className="p-3.5 rounded-xl bg-black border border-white/40 text-white space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between font-semibold text-[13px] text-white">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-white shrink-0" />
                  <span>{error.title}</span>
                </div>
                <button
                  onClick={clearError}
                  className="text-zinc-400 hover:text-white p-0.5"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[12px] text-zinc-300 leading-relaxed">{error.message}</p>
              {error.actionable && (
                <div className="text-[11px] font-medium text-zinc-200 bg-[#18181b] border border-[#27272a] p-2 rounded mt-1">
                  💡 {error.actionable}
                </div>
              )}
            </div>
          )}

          {/* Network Selection Tabs */}
          <div className="flex p-1 bg-black rounded-xl border border-[#27272a] text-[13px]">
            <button
              onClick={() => setSelectedTab('evm')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedTab === 'evm'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cookie EVM Chain</span>
            </button>
            <button
              onClick={() => setSelectedTab('solana')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedTab === 'solana'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              <span>Solana SVM</span>
            </button>
          </div>

          {/* Main Action Button: Connect Nightly Extension */}
          <button
            id="connect-nightly-btn"
            onClick={() => handleConnect(selectedTab)}
            disabled={isConnecting}
            className="w-full p-4 bg-[#121214] hover:bg-[#18181b] border border-[#27272a] hover:border-white rounded-xl flex items-center justify-between transition-all group cursor-pointer text-left shadow-lg"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-black border border-[#27272a] flex items-center justify-center text-[20px] shadow-sm">
                🌙
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-sans font-bold text-[15px] text-white transition-colors">
                    Connect Nightly Extension
                  </span>
                </div>
                <p className="text-[12px] text-zinc-400">
                  {selectedTab === 'evm'
                    ? 'Connect via Nightly Ethereum / EVM Provider'
                    : 'Connect via Nightly Solana Provider'}
                </p>
              </div>
            </div>
            {isConnecting ? (
              <RefreshCw className="w-4 h-4 text-white animate-spin" />
            ) : (
              <span className="text-white font-mono text-[13px] font-semibold group-hover:translate-x-1 transition-transform">
                Connect →
              </span>
            )}
          </button>

          {/* Testnet Sandbox Option */}
          <button
            id="nightly-sandbox-connect-btn"
            onClick={() => handleConnect('sandbox')}
            disabled={isConnecting}
            className="w-full p-3 bg-black hover:bg-[#121214] border border-dashed border-[#27272a] hover:border-zinc-400 rounded-xl flex items-center justify-between transition-all group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[14px] text-white">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-sans font-medium text-[13px] text-white transition-colors">
                    Nightly Testnet Sandbox
                  </span>
                  <span className="text-[10px] font-mono bg-white text-black px-1.5 rounded font-bold">
                    Demo Mode
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500">
                  Instant simulation for testing validator staking &amp; telemetry
                </div>
              </div>
            </div>
            <span className="text-zinc-400 group-hover:text-white font-mono text-[11px]">
              Use Demo →
            </span>
          </button>

          {/* Install Nightly Link banner if not installed */}
          {!isInstalled && (
            <div className="p-3 bg-black rounded-xl border border-[#27272a] flex items-center justify-between text-[12px]">
              <div>
                <div className="text-white font-semibold">Don't have Nightly installed?</div>
                <div className="text-[11px] text-zinc-500">
                  Available on Chrome, Brave, Edge &amp; Firefox
                </div>
              </div>
              <a
                href={NIGHTLY_INSTALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded bg-white hover:bg-zinc-200 text-black font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                <span>Get Nightly</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Troubleshooting Accordion */}
          <div className="pt-2 border-t border-[#27272a]">
            <button
              onClick={() => setShowTroubleshoot(!showTroubleshoot)}
              className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-500 hover:text-white transition-colors py-1 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Nightly extension connection guide &amp; help
              </span>
              <span>{showTroubleshoot ? '▲' : '▼'}</span>
            </button>

            {showTroubleshoot && (
              <div className="mt-2 p-3 bg-black rounded-xl text-[11px] text-zinc-400 space-y-1.5 font-sans leading-relaxed border border-[#27272a]">
                <p>
                  • <strong className="text-white">Prompt not popping up?</strong> Open the Nightly extension by clicking its moon icon in your browser toolbar to unlock your wallet.
                </p>
                <p>
                  • <strong className="text-white">Embedded Previews:</strong> In sandboxed iframes, browser extensions may restrict popups. Open this app in a new tab for native extension access.
                </p>
                <p>
                  • <strong className="text-white">Supported Chains:</strong> Nightly supports Cookie EVM, Solana, NEAR, Aptos, and Sui networks simultaneously.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 bg-[#121214] border-t border-[#27272a] flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-white shrink-0" />
            <span>Secure connection via official Nightly extension.</span>
          </div>
          <a
            href={NIGHTLY_WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center gap-0.5 text-zinc-400"
          >
            <span>nightly.app</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

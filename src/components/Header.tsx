import React, { useState } from 'react';
import { 
  Fuel, 
  Gauge, 
  ChevronDown, 
  User, 
  Wallet, 
  CheckCircle2,
  Copy,
  ExternalLink,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { useNightlyWallet, NIGHTLY_INSTALL_URL } from '../context/NightlyWalletContext';
import { WalletAccount } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  wallet: WalletAccount;
  onOpenWalletModal: () => void;
  onDisconnectWallet: () => void;
  onOpenSignInModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  wallet,
  onOpenWalletModal,
  onDisconnectWallet,
  onOpenSignInModal,
}) => {
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const navItems = [
    { id: 'Home', label: 'Home' },
    { id: 'Blockchain', label: 'Blockchain' },
    { id: 'Validators', label: 'Validators' },
    { id: 'Tokens', label: 'Tokens' },
    { id: 'TxDecoder', label: 'Tx Decoder' },
    { id: 'Resources', label: 'Resources' },
    { id: 'API', label: 'API' },
  ];

  const copyWalletAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-[#27272a] shadow-[0_1px_12px_rgba(0,0,0,0.8)]">
      {/* Upper Status Telemetry Bar */}
      <div className="w-full px-4 sm:px-6 h-10 bg-[#09090b] flex items-center justify-between font-mono text-[12px] text-[#a1a1aa] border-b border-[#18181b]">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[#71717a]">COOKIE:</span>
            <span className="text-white font-semibold">$1.42</span>
            <span className="text-white/80 font-medium">(+2.4%)</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Fuel className="w-3.5 h-3.5 text-[#a1a1aa]" />
            <span className="text-[#71717a]">Gas:</span>
            <span className="text-white font-semibold">12 Gwei</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Gauge className="w-3.5 h-3.5 text-[#a1a1aa]" />
            <span className="text-[#71717a]">TPS:</span>
            <span className="text-white font-semibold">2,840</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 hidden md:flex">
            <span className="text-[#71717a]">Epoch:</span>
            <span className="text-white font-semibold">#4,921</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between bg-black border-t border-[#18181b]">
        <div className="flex items-center gap-3 sm:gap-5 lg:gap-8">
          {/* Brand Name */}
          <button
            id="brand-logo-btn"
            onClick={() => setActiveTab('Home')}
            className="flex items-center group cursor-pointer text-left shrink-0 py-1"
          >
            <span className="font-sans text-[21px] sm:text-[23px] font-extrabold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              cookie<span className="text-white underline decoration-white/40 decoration-2 underline-offset-4">Lens</span>
            </span>
          </button>

          {/* Navigation Links - Always displayed on desktop, tablets, and viewports >= 640px */}
          <nav className="hidden sm:flex items-center space-x-1 text-[13px] md:text-[14px]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id.toLowerCase()}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-black bg-white shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Sign In, Connect Wallet, Avatar, Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            id="header-sign-in-btn"
            onClick={onOpenSignInModal}
            className="hidden sm:inline-block text-zinc-400 hover:text-white text-[14px] font-medium transition-colors cursor-pointer"
          >
            Sign In
          </button>

          {/* Connect Wallet Button or Connected Indicator */}
          {!wallet.connected ? (
            <button
              id="connect-nightly-header-btn"
              onClick={onOpenWalletModal}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white hover:bg-zinc-200 text-black border border-white transition-all text-[13px] sm:text-[14px] font-semibold flex items-center gap-2 cursor-pointer shadow-sm group"
            >
              <Wallet className="w-4 h-4 text-black" />
              <span className="hidden xs:inline">Connect Wallet</span>
              <span className="xs:hidden">Connect</span>
            </button>
          ) : (
            <div className="relative">
              <button
                id="connected-nightly-btn"
                onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121214] border border-[#27272a] hover:bg-[#18181b] text-white transition-all text-[13px] font-mono cursor-pointer shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span className="font-semibold text-white hidden sm:inline">{wallet.walletName}</span>
                <span className="text-zinc-300 font-medium">
                  {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {walletDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-72 bg-[#0c0c0e] border border-[#27272a] rounded-xl shadow-2xl p-3.5 z-50 text-left">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#1f1f23]">
                    <div className="flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-white" />
                      <span className="text-[12px] font-bold text-white">{wallet.walletName}</span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-black bg-white px-2 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                      Connected
                    </span>
                  </div>

                  <div className="py-2.5 space-y-2">
                    <div>
                      <div className="text-[11px] text-zinc-400 font-mono">Wallet Address:</div>
                      <div className="flex items-center justify-between mt-1 p-1.5 bg-black rounded border border-[#27272a] font-mono text-[11px] text-zinc-200">
                        <span className="truncate mr-2">{wallet.address}</span>
                        <button
                          onClick={copyWalletAddress}
                          className="text-white hover:text-zinc-300 shrink-0 p-1"
                          title="Copy Address"
                        >
                          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-2 bg-black rounded border border-[#27272a]">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-zinc-400">Balance:</span>
                        <span className="font-mono font-bold text-white">
                          {wallet.balanceCookie.toLocaleString()} COOKIE
                        </span>
                      </div>
                      <div className="text-right font-mono text-[11px] text-zinc-400 mt-0.5">
                        ≈ ${wallet.balanceUsd.toLocaleString()} USD
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1f1f23] flex items-center justify-between text-[12px]">
                    <a
                      href={`https://cookielens.io/address/${wallet.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      <span>Explorer</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      id="disconnect-nightly-btn"
                      onClick={() => {
                        onDisconnectWallet();
                        setWalletDropdownOpen(false);
                      }}
                      className="text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer font-medium text-[12px]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Avatar Icon */}
          <div
            onClick={onOpenSignInModal}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-zinc-200 transition-colors shadow-sm shrink-0"
            title="User Account"
          >
            <User className="w-4 h-4 text-black" />
          </div>

          {/* Mobile Navigation Toggle Button - ONLY exists for mobile (< 640px) */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="sm:hidden p-1.5 rounded-lg bg-[#121214] hover:bg-[#18181b] text-zinc-300 hover:text-white border border-[#27272a] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu - ONLY exists for mobile (< 640px) */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#09090b] border-b border-[#27272a] px-4 py-3 shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-xs font-medium rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-white text-black font-semibold'
                      : 'text-zinc-400 hover:bg-[#18181b] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

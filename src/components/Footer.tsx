import React, { useState } from 'react';
import { Cpu, Check, Copy } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenStatusModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenStatusModal }) => {
  const [copiedDonation, setCopiedDonation] = useState(false);
  const donationAddress = '0x71C8273645019283746152435019827364503a9';

  const copyDonation = () => {
    navigator.clipboard.writeText(donationAddress);
    setCopiedDonation(true);
    setTimeout(() => setCopiedDonation(false), 2000);
  };

  return (
    <footer className="w-full bg-black text-zinc-400 pt-12 pb-8 border-t border-[#27272a]">
      <div className="max-w-7xl px-4 sm:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-2 space-y-4 pr-0 md:pr-8">
            <div className="flex items-center gap-2.5">
              <span className="font-sans text-[20px] font-bold text-white tracking-tight">
                cookie<span className="text-zinc-400 font-normal">Lens</span>
              </span>
            </div>

            <p className="font-sans text-[13px] text-zinc-400 max-w-md leading-relaxed">
              cookieLens is the premier high-throughput blockchain analytics workbench and block explorer for Cookie
              Chain, engineered for on-chain telemetry, verifiable transactions, and institutional analytics.
            </p>

            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
              <Cpu className="w-3.5 h-3.5 text-white" />
              <span className="tracking-wider uppercase">POWERED BY COOKIE CHAIN CONSENSUS ENGINE</span>
            </div>
          </div>

          {/* Products & Services */}
          <div>
            <div className="font-mono text-[11px] font-semibold text-white uppercase tracking-wider mb-4">
              Products & Services
            </div>
            <div className="flex flex-col gap-2 font-sans text-[13px]">
              <button
                onClick={() => onNavigate('TxDecoder')}
                className="text-left text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Tx Decoder
              </button>
              <button
                onClick={() => onNavigate('API')}
                className="text-left text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Developer APIs &amp; RPC
              </button>
              <button
                onClick={() => onNavigate('Resources')}
                className="text-left text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Ecosystem Resources
              </button>
              <button
                onClick={() => onNavigate('Blockchain')}
                className="text-left text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Blockchain Ledger
              </button>
              <button
                onClick={() => onNavigate('Tokens')}
                className="text-left text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Token Tracker
              </button>
              <button
                onClick={() => onNavigate('Validators')}
                className="text-left text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Validator Telemetry
              </button>
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="font-mono text-[11px] font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </div>
            <div className="flex flex-col gap-2 font-sans text-[13px]">
              <button
                onClick={() => onNavigate('Home')}
                className="text-left text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                About Cookie Chain
              </button>
              <button
                onClick={() => onNavigate('Home')}
                className="text-left text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Brand Assets
              </button>
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Community & Tech */}
          <div>
            <div className="font-mono text-[11px] font-semibold text-white uppercase tracking-wider mb-4">
              Community & Tech
            </div>
            <div className="flex flex-col gap-2 font-sans text-[13px]">
              <button
                onClick={() => onNavigate('Validators')}
                className="text-left text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Network Nodes
              </button>
              <button
                onClick={onOpenStatusModal}
                className="text-left text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>System Status</span>
              </button>
              <button
                onClick={() => onNavigate('Blockchain')}
                className="text-left text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Ecosystem Verification
              </button>
              <button
                onClick={() => onNavigate('TxDecoder')}
                className="text-left text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Transaction Debugger
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#27272a] flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[12px] text-zinc-500">
          <div className="flex items-center gap-2">
            <span>cookieLens Explorer © 2025. All protocol rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <span>Donations:</span>
              <button
                onClick={copyDonation}
                className="font-mono text-zinc-300 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
                title="Click to copy donation address"
              >
                <span>0x71C...3a9</span>
                {copiedDonation ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>
            </div>

            <button
              onClick={onOpenStatusModal}
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>Cookie Status</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

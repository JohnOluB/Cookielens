import React from 'react';
import { X, CheckCircle2, ShieldCheck, Activity, Cpu, Server } from 'lucide-react';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const services = [
    { name: 'Proof-of-Stake Consensus Engine', status: 'Operational', uptime: '99.998%', latency: '400 ms' },
    { name: 'Mempool Transaction Pipeline', status: 'Operational', uptime: '100.0%', latency: '< 10 ms' },
    { name: 'Public JSON-RPC / WebSocket Gateways', status: 'Operational', uptime: '99.995%', latency: '18 ms' },
    { name: 'CookieScan Indexer & Telemetry API', status: 'Operational', uptime: '99.999%', latency: '12 ms' },
    { name: 'Solana SVM Cross-Chain Bridge Relay', status: 'Operational', uptime: '99.989%', latency: '1.2 s' },
    { name: 'cookie-mcp Agent Context Endpoints', status: 'Operational', uptime: '100.0%', latency: '24 ms' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#09090b] border border-[#27272a] rounded-xl shadow-2xl max-w-xl w-full overflow-hidden">
        <div className="px-6 py-4 bg-[#121214] border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black border border-[#27272a] flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans text-[16px] font-bold text-white">Cookie Chain Network Status</h3>
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              </div>
              <p className="font-mono text-[11px] text-zinc-400">All Systems Operational</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-black hover:bg-[#18181b] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {services.map((srv) => (
            <div
              key={srv.name}
              className="p-3 bg-black border border-[#27272a] rounded-lg flex items-center justify-between text-[13px]"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <div>
                  <span className="font-sans font-medium text-white block">{srv.name}</span>
                  <span className="font-mono text-[11px] text-zinc-500">Uptime: {srv.uptime}</span>
                </div>
              </div>
              <div className="text-right font-mono text-[11px]">
                <span className="text-white font-bold block">{srv.status}</span>
                <span className="text-zinc-400">{srv.latency}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-[#121214] border-t border-[#27272a] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white text-black hover:bg-zinc-200 rounded font-bold text-[13px] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

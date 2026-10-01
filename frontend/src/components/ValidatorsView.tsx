import React, { useState } from 'react';
import { Shield, CheckCircle2, Server, Award, Coins, ArrowUpRight } from 'lucide-react';
import { VALIDATORS_LIST } from '../data/mockData';
import { Validator } from '../types';

interface ValidatorsViewProps {
  onSelectValidator: (name: string) => void;
  onOpenStakeModal: (validator: Validator) => void;
}

export const ValidatorsView: React.FC<ValidatorsViewProps> = ({
  onSelectValidator,
  onOpenStakeModal,
}) => {
  const [stakeAmount, setStakeAmount] = useState<number>(1000);
  const apyPct = 8.4;
  const annualReward = (stakeAmount * apyPct) / 100;
  const dailyReward = annualReward / 365;

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-white">Consensus Validators</h1>
        <p className="font-sans text-[14px] text-zinc-400 mt-1">
          Decentralized node operators securing the Cookie Chain Proof-of-Stake consensus.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl shadow-md">
          <span className="text-zinc-500 font-mono text-[11px] uppercase block mb-1">Active Validators</span>
          <div className="font-mono text-[24px] font-bold text-white">1,248</div>
          <span className="text-zinc-400 font-mono text-[11px]">100% active participation</span>
        </div>

        <div className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl shadow-md">
          <span className="text-zinc-500 font-mono text-[11px] uppercase block mb-1">Total Staked Value</span>
          <div className="font-mono text-[24px] font-bold text-white">284.5M COOKIE</div>
          <span className="text-zinc-400 font-mono text-[11px]">56.8% of circulating supply</span>
        </div>

        <div className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl shadow-md">
          <span className="text-zinc-500 font-mono text-[11px] uppercase block mb-1">Estimated Staking APY</span>
          <div className="font-mono text-[24px] font-bold text-white">8.40%</div>
          <span className="text-zinc-400 font-mono text-[11px]">Compounded per epoch</span>
        </div>

        <div className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl shadow-md">
          <span className="text-zinc-500 font-mono text-[11px] uppercase block mb-1">Avg Finality Delay</span>
          <div className="font-mono text-[24px] font-bold text-white">400 ms</div>
          <span className="text-zinc-400 font-mono text-[11px]">Zero slashing incidents</span>
        </div>
      </div>

      {/* Staking Reward Calculator */}
      <div className="p-5 bg-[#09090b] border border-[#27272a] rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[12px] font-bold text-white uppercase">
            <Coins className="w-4 h-4 text-white" />
            <span>COOKIE Staking Estimator</span>
          </div>
          <h3 className="font-sans text-[16px] font-bold text-white">
            Calculate your native yield securing Cookie Chain
          </h3>
          <p className="text-[13px] text-zinc-400">
            Delegate COOKIE to trusted validator nodes without relinquishing custody.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex flex-col">
            <label className="font-mono text-[11px] text-zinc-500 mb-1">Amount to Stake (COOKIE)</label>
            <input
              type="number"
              min="10"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value) || 0)}
              className="px-3 py-2 bg-black border border-[#27272a] rounded-lg font-mono text-[14px] text-white outline-none focus:border-white"
            />
          </div>

          <div className="flex items-center gap-4 bg-black border border-[#27272a] p-3 rounded-lg font-mono text-[12px]">
            <div>
              <span className="text-zinc-500 block text-[10px]">Daily Reward</span>
              <span className="text-white font-bold">{dailyReward.toFixed(2)} COOKIE</span>
            </div>
            <div className="border-l border-[#27272a] pl-4">
              <span className="text-zinc-500 block text-[10px]">Annual Reward</span>
              <span className="text-white font-bold">{annualReward.toFixed(2)} COOKIE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Validators Ranking Table */}
      <div className="bg-[#09090b] border border-[#27272a] rounded-xl shadow-xl overflow-hidden">
        <div className="px-5 py-4 bg-[#121214] border-b border-[#27272a] flex items-center justify-between">
          <h3 className="font-sans font-bold text-[15px] text-white">Top Validator Nodes</h3>
          <span className="font-mono text-[12px] text-zinc-500">Ranked by Voting Weight</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#121214] text-zinc-400 font-mono text-[11px] uppercase tracking-wider border-b border-[#27272a]">
              <tr>
                <th className="px-5 py-3.5">Rank & Node</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Total Stake</th>
                <th className="px-5 py-3.5">Commission</th>
                <th className="px-5 py-3.5">Uptime</th>
                <th className="px-5 py-3.5">Blocks Created</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e22]">
              {VALIDATORS_LIST.map((val) => (
                <tr key={val.rank} className="hover:bg-[#121214] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[12px] font-bold text-zinc-500 w-5">#{val.rank}</span>
                      <div>
                        <button
                          onClick={() => onSelectValidator(val.name)}
                          className="font-sans font-bold text-white hover:text-zinc-300 text-left cursor-pointer block"
                        >
                          {val.name}
                        </button>
                        <span className="font-mono text-[11px] text-zinc-500">
                          {val.address.slice(0, 6)}...{val.address.slice(-4)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[12px] text-zinc-400">{val.location}</td>
                  <td className="px-5 py-4 font-mono font-semibold text-white">
                    {(val.stakeCookie / 1000000).toFixed(1)}M COOKIE
                    <div className="text-[11px] text-zinc-500 font-normal">{val.stakeSharePct}% share</div>
                  </td>
                  <td className="px-5 py-4 font-mono text-white font-semibold">{val.commissionPct}%</td>
                  <td className="px-5 py-4 font-mono text-white font-semibold">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>{val.uptimePct}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-white">{val.blocksProposed.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onOpenStakeModal(val)}
                      className="px-3 py-1.5 bg-white hover:bg-zinc-200 text-black rounded font-mono text-[12px] font-bold transition-colors cursor-pointer shadow-sm"
                    >
                      Delegate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNightlyWallet } from './context/NightlyWalletContext';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { TelemetryCards } from './components/TelemetryCards';
import { BlocksFeed } from './components/BlocksFeed';
import { TransactionsFeed } from './components/TransactionsFeed';
import { Footer } from './components/Footer';
import { BlockDetailModal } from './components/BlockDetailModal';
import { TxDetailModal } from './components/TxDetailModal';
import { AddressDetailModal } from './components/AddressDetailModal';
import { TokenDetailModal } from './components/TokenDetailModal';
import { WalletConnectModal } from './components/WalletConnectModal';
import { SystemStatusModal } from './components/SystemStatusModal';
import { BlockchainView } from './components/BlockchainView';
import { ValidatorsView } from './components/ValidatorsView';
import { TokensView } from './components/TokensView';
import { TxDecoderView } from './components/TxDecoderView';
import { ResourcesView } from './components/ResourcesView';
import { ApiView } from './components/ApiView';
import { Web3ErrorBanner } from './context/Web3ErrorContext';

import { INITIAL_BLOCKS, INITIAL_TRANSACTIONS, VALIDATORS_LIST, TOKEN_LIST } from './data/mockData';
import { Block, Transaction, WalletAccount, Validator, TokenItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isStreamActive, setIsStreamActive] = useState<boolean>(true);

  // Nightly Wallet hook for multi-chain browser extension
  const { wallet, disconnectNightly } = useNightlyWallet();

  // Selected item modal states
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(null);

  // Utility modals
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  // Background block streaming simulation
  useEffect(() => {
    if (!isStreamActive) return;

    const interval = setInterval(() => {
      setBlocks((prev) => {
        const nextBlockNumber = prev[0].number + 1;
        const validators = ['Atlas-04', 'CookieCore-Z', 'Sentinel-Alpha', 'Nova-01', 'Beacon-9'];
        const chosenValidator = validators[Math.floor(Math.random() * validators.length)];
        const txsCount = Math.floor(Math.random() * 120) + 90;
        const duration = Number((Math.random() * 0.8 + 0.6).toFixed(1));
        const reward = Number((Math.random() * 0.8 + 1.8).toFixed(2));

        const newBlock: Block = {
          number: nextBlockNumber,
          hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          parentHash: prev[0].hash,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          timeAgo: 'Just now',
          validatorName: chosenValidator,
          validatorAddress: '0x3210bc948a284617492048593820485928374819',
          txCount: txsCount,
          durationSeconds: duration,
          rewardCookie: reward,
          gasUsed: Math.floor(Math.random() * 8000000) + 10000000,
          gasLimit: 30000000,
          baseFeeGwei: 12.0,
          sizeKb: Number((Math.random() * 30 + 35).toFixed(1)),
        };

        // Update relative times on existing blocks
        const updated = prev.map((b, idx) => {
          const seconds = (idx + 1) * 12;
          return {
            ...b,
            timeAgo: seconds >= 60 ? `${Math.floor(seconds / 60)} min ago` : `${seconds} secs ago`,
          };
        });

        return [newBlock, ...updated.slice(0, 9)];
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [isStreamActive]);

  // Search logic
  const handleSearch = (query: string, filter: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return;

    // Check if it matches a block number
    const blockMatch = blocks.find((b) => b.number.toString() === q);
    if (blockMatch) {
      setSelectedBlock(blockMatch);
      return;
    }

    // Check if it matches a txn hash
    const txMatch = transactions.find((t) => t.hash.toLowerCase() === q || t.hash.toLowerCase().includes(q));
    if (txMatch) {
      setSelectedTx(txMatch);
      return;
    }

    // Check if it matches a validator
    const valMatch = VALIDATORS_LIST.find((v) => v.name.toLowerCase() === q || v.address.toLowerCase() === q);
    if (valMatch) {
      setActiveTab('Validators');
      return;
    }

    // Check if it matches a token
    const tokenMatch = TOKEN_LIST.find(
      (t) => t.name.toLowerCase().includes(q) || t.symbol.toLowerCase() === q || t.contractAddress.toLowerCase() === q
    );
    if (tokenMatch) {
      setSelectedToken(tokenMatch);
      return;
    }

    // Otherwise treat as an address lookup
    setSelectedAddress(query);
  };

  const handleSelectValidatorName = (name: string) => {
    setActiveTab('Validators');
  };

  return (
    <div className="bg-black text-[#f4f4f5] font-sans antialiased min-h-screen flex flex-col selection:bg-white selection:text-black">
      {/* Header with Navigation & Network Telemetry */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wallet={wallet}
        onOpenWalletModal={() => setWalletModalOpen(true)}
        onDisconnectWallet={disconnectNightly}
      />

      {/* Global Web3 Error Banner with instant retry */}
      <div className="pt-26">
        <Web3ErrorBanner onRetry={() => setWalletModalOpen(true)} />
      </div>

      {/* Main Viewport */}
      <main className="w-full bg-black flex-1">
        {activeTab === 'Home' && (
          <div className="flex flex-col w-full">
            {/* Hero & Universal Search Section with Live Block Pulse */}
            <HeroSearch
              onSearch={handleSearch}
              latestBlock={blocks[0]}
              blocks={blocks}
              onSelectBlock={(b) => setSelectedBlock(b)}
            />

            {/* Network & Chain Health Telemetry Quad-Grid */}
            <TelemetryCards />

            {/* Side-by-Side Dual Ledger Feeds (Latest Blocks & Latest Transactions) */}
            <section className="w-full bg-black pb-12 px-4 sm:px-6">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BlocksFeed
                  blocks={blocks}
                  onSelectBlock={(b) => setSelectedBlock(b)}
                  onSelectValidator={handleSelectValidatorName}
                  onViewAllBlocks={() => setActiveTab('Blockchain')}
                  isStreamActive={isStreamActive}
                  onToggleStream={() => setIsStreamActive(!isStreamActive)}
                />

                <TransactionsFeed
                  transactions={transactions}
                  onSelectTransaction={(tx) => setSelectedTx(tx)}
                  onSelectAddress={(addr) => setSelectedAddress(addr)}
                  onViewAllTransactions={() => setActiveTab('Blockchain')}
                />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'Blockchain' && (
          <BlockchainView
            blocks={blocks}
            transactions={transactions}
            onSelectBlock={(b) => setSelectedBlock(b)}
            onSelectTx={(tx) => setSelectedTx(tx)}
            onSelectValidator={handleSelectValidatorName}
            onSelectAddress={(addr) => setSelectedAddress(addr)}
          />
        )}

        {activeTab === 'Validators' && (
          <ValidatorsView
            onSelectValidator={(name) => {
              const val = VALIDATORS_LIST.find((v) => v.name === name);
              if (val) setSelectedAddress(val.address);
            }}
            onOpenStakeModal={(val) => {
              if (!wallet.connected) {
                setWalletModalOpen(true);
              } else {
                setSelectedAddress(val.address);
              }
            }}
          />
        )}

        {activeTab === 'Tokens' && (
          <TokensView
            onSelectToken={(token) => {
              setSelectedToken(token);
            }}
          />
        )}

        {activeTab === 'TxDecoder' && (
          <TxDecoderView
            onSelectTx={(tx) => setSelectedTx(tx)}
          />
        )}

        {activeTab === 'Resources' && <ResourcesView />}

        {activeTab === 'API' && <ApiView />}
      </main>

      {/* Global Application Footer */}
      <Footer
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenStatusModal={() => setStatusModalOpen(true)}
      />

      {/* Modals */}
      <BlockDetailModal
        block={selectedBlock}
        onClose={() => setSelectedBlock(null)}
        onSelectTx={(txHash) => {
          const found = transactions.find((t) => t.hash === txHash);
          if (found) {
            setSelectedBlock(null);
            setSelectedTx(found);
          }
        }}
        onSelectValidator={handleSelectValidatorName}
      />

      <TxDetailModal
        tx={selectedTx}
        onClose={() => setSelectedTx(null)}
        onSelectAddress={(addr) => {
          setSelectedTx(null);
          setSelectedAddress(addr);
        }}
        onSelectBlock={(bNum) => {
          const found = blocks.find((b) => b.number === bNum);
          if (found) {
            setSelectedTx(null);
            setSelectedBlock(found);
          }
        }}
      />

      <AddressDetailModal
        address={selectedAddress}
        onClose={() => setSelectedAddress(null)}
        transactions={transactions}
        onSelectTx={(tx) => {
          setSelectedAddress(null);
          setSelectedTx(tx);
        }}
      />

      <TokenDetailModal
        token={selectedToken}
        onClose={() => setSelectedToken(null)}
        onSelectAddress={(addr) => {
          setSelectedToken(null);
          setSelectedAddress(addr);
        }}
      />

      <WalletConnectModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />

      <SystemStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
      />
    </div>
  );
}


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WalletAccount } from '../types';
import { parseWeb3Error, ParsedWeb3Error } from '../utils/web3Error';

export interface NightlyWalletContextType {
  isInstalled: boolean;
  isConnecting: boolean;
  wallet: WalletAccount;
  error: ParsedWeb3Error | null;
  activeNetwork: 'Cookie EVM' | 'Solana SVM' | 'Sandbox';
  connectNightly: (network?: 'evm' | 'solana' | 'sandbox') => Promise<boolean>;
  disconnectNightly: () => Promise<void>;
  switchNetwork: (network: 'evm' | 'solana') => Promise<void>;
  clearError: () => void;
  openInstallUrl: () => void;
}

const DEFAULT_WALLET: WalletAccount = {
  connected: false,
  address: '',
  walletName: 'Nightly',
  balanceCookie: 0,
  balanceUsd: 0,
};

const NightlyWalletContext = createContext<NightlyWalletContextType>({
  isInstalled: false,
  isConnecting: false,
  wallet: DEFAULT_WALLET,
  error: null,
  activeNetwork: 'Cookie EVM',
  connectNightly: async () => false,
  disconnectNightly: async () => {},
  switchNetwork: async () => {},
  clearError: () => {},
  openInstallUrl: () => {},
});

export const useNightlyWallet = () => useContext(NightlyWalletContext);

export const NIGHTLY_INSTALL_URL = 'https://chromewebstore.google.com/detail/nightly/fiikmmddbeimnabmmpdaiffhphegfllh';
export const NIGHTLY_WEBSITE_URL = 'https://nightly.app';

export const NightlyWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletAccount>(DEFAULT_WALLET);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<ParsedWeb3Error | null>(null);
  const [activeNetwork, setActiveNetwork] = useState<'Cookie EVM' | 'Solana SVM' | 'Sandbox'>('Cookie EVM');
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  // Check if Nightly Wallet extension is injected in the browser window
  const checkNightlyInstalled = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    const win = window as any;
    const hasNightlyObj = !!win.nightly;
    const hasNightlyEth = !!(win.nightly && win.nightly.ethereum);
    const hasNightlySol = !!(win.nightly && win.nightly.solana);
    const isEthNightly = !!(win.ethereum && win.ethereum.isNightly);

    return hasNightlyObj || hasNightlyEth || hasNightlySol || isEthNightly;
  }, []);

  useEffect(() => {
    const installed = checkNightlyInstalled();
    setIsInstalled(installed);

    // Some extensions inject slightly asynchronously after document loads
    const timer = setTimeout(() => {
      setIsInstalled(checkNightlyInstalled());
    }, 800);

    return () => clearTimeout(timer);
  }, [checkNightlyInstalled]);

  // Setup event listeners if Nightly EVM or Solana provider exists
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const win = window as any;
    const ethProvider = win.nightly?.ethereum || (win.ethereum?.isNightly ? win.ethereum : null);

    if (ethProvider && typeof ethProvider.on === 'function') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (!accounts || accounts.length === 0) {
          setWallet(DEFAULT_WALLET);
        } else {
          setWallet((prev) => ({
            ...prev,
            connected: true,
            address: accounts[0],
            walletName: 'Nightly',
          }));
        }
      };

      const handleChainChanged = () => {
        // Refresh balance or state on chain change
      };

      ethProvider.on('accountsChanged', handleAccountsChanged);
      ethProvider.on('chainChanged', handleChainChanged);

      return () => {
        if (typeof ethProvider.removeListener === 'function') {
          ethProvider.removeListener('accountsChanged', handleAccountsChanged);
          ethProvider.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const openInstallUrl = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.open(NIGHTLY_INSTALL_URL, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const connectNightly = async (network: 'evm' | 'solana' | 'sandbox' = 'evm'): Promise<boolean> => {
    setError(null);
    setIsConnecting(true);

    try {
      // 1. Sandbox Testnet connection
      if (network === 'sandbox') {
        await new Promise((r) => setTimeout(r, 400));
        setWallet({
          connected: true,
          address: '0x44C91827364501928374615243501982736498AD',
          walletName: 'Nightly (Sandbox)',
          balanceCookie: 2500.0,
          balanceUsd: 3550.0,
        });
        setActiveNetwork('Sandbox');
        return true;
      }

      if (typeof window === 'undefined') {
        throw new Error('Window is not available.');
      }

      const win = window as any;
      const nightlyObj = win.nightly;

      // 2. Solana network connection via Nightly Solana
      if (network === 'solana') {
        const solanaProvider = nightlyObj?.solana;
        if (!solanaProvider) {
          throw new Error('Nightly Wallet extension not detected for Solana. Please install Nightly.');
        }

        let address = '';
        if (typeof solanaProvider.connect === 'function') {
          const res = await solanaProvider.connect();
          address = res?.publicKey?.toString?.() || solanaProvider.publicKey?.toString?.() || '';
        } else if (solanaProvider.features?.['standard:connect']?.connect) {
          const res = await solanaProvider.features['standard:connect'].connect();
          address = res?.accounts?.[0]?.address || '';
        }

        if (!address) {
          throw new Error('Could not retrieve public address from Nightly Solana.');
        }

        setWallet({
          connected: true,
          address,
          walletName: 'Nightly',
          balanceCookie: 1250.0,
          balanceUsd: 1775.0,
        });
        setActiveNetwork('Solana SVM');
        return true;
      }

      // 3. EVM / Cookie Chain connection via Nightly Ethereum provider
      const ethProvider = nightlyObj?.ethereum || (win.ethereum?.isNightly ? win.ethereum : null) || win.ethereum;

      if (!ethProvider) {
        throw new Error(
          'Nightly Wallet extension not installed or not detected in this browser window.'
        );
      }

      // Request user account authorization
      const accounts: string[] = await ethProvider.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts selected in Nightly Wallet.');
      }

      const userAddr = accounts[0];

      // Try to request chain / network switch to Cookie Chain
      try {
        await ethProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x66a44' }], // 420420 in hex
        });
      } catch (switchErr: any) {
        // Chain code 4902: Unrecognized chain, try adding it
        if (switchErr?.code === 4902 || switchErr?.message?.includes('unrecognized')) {
          try {
            await ethProvider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x66a44',
                  chainName: 'Cookie Chain',
                  nativeCurrency: {
                    name: 'Cookie',
                    symbol: 'COOKIE',
                    decimals: 18,
                  },
                  rpcUrls: ['https://rpc.cookiechain.io'],
                  blockExplorerUrls: ['https://cookielens.io'],
                },
              ],
            });
          } catch {
            // Non-fatal if user stays on current EVM chain
          }
        }
      }

      setWallet({
        connected: true,
        address: userAddr,
        walletName: 'Nightly',
        balanceCookie: 1250.0,
        balanceUsd: 1775.0,
      });
      setActiveNetwork('Cookie EVM');
      return true;
    } catch (err: any) {
      console.warn('Nightly Wallet connection error:', err);
      const parsed = parseWeb3Error(err);
      setError(parsed);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectNightly = async (): Promise<void> => {
    try {
      const win = typeof window !== 'undefined' ? (window as any) : null;
      if (win?.nightly?.solana?.disconnect) {
        await win.nightly.solana.disconnect();
      }
    } catch {
      // Ignore disconnect cleanup errors
    }
    setWallet(DEFAULT_WALLET);
    setError(null);
  };

  const switchNetwork = async (network: 'evm' | 'solana') => {
    if (wallet.connected) {
      await disconnectNightly();
    }
    await connectNightly(network);
  };

  return (
    <NightlyWalletContext.Provider
      value={{
        isInstalled,
        isConnecting,
        wallet,
        error,
        activeNetwork,
        connectNightly,
        disconnectNightly,
        switchNetwork,
        clearError,
        openInstallUrl,
      }}
    >
      {children}
    </NightlyWalletContext.Provider>
  );
};

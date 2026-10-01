import React from 'react';
import { NightlyWalletProvider } from '../context/NightlyWalletContext';
import { Web3ErrorProvider } from '../context/Web3ErrorContext';

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <NightlyWalletProvider>
      <Web3ErrorProvider>
        {children}
      </Web3ErrorProvider>
    </NightlyWalletProvider>
  );
};

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, X, RefreshCw, ExternalLink } from 'lucide-react';
import { parseWeb3Error, ParsedWeb3Error } from '../utils/web3Error';

interface Web3ErrorContextType {
  error: ParsedWeb3Error | null;
  setError: (err: unknown) => void;
  clearError: () => void;
}

const Web3ErrorContext = createContext<Web3ErrorContextType>({
  error: null,
  setError: () => {},
  clearError: () => {},
});

export const useWeb3Error = () => useContext(Web3ErrorContext);

export const Web3ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setParsedError] = useState<ParsedWeb3Error | null>(null);

  const setError = useCallback((err: unknown) => {
    if (!err) {
      setParsedError(null);
      return;
    }
    const parsed = parseWeb3Error(err);
    setParsedError(parsed);
  }, []);

  const clearError = useCallback(() => {
    setParsedError(null);
  }, []);

  return (
    <Web3ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </Web3ErrorContext.Provider>
  );
};

export const Web3ErrorBanner: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  const { error, clearError } = useWeb3Error();

  if (!error) return null;

  return (
    <div
      role="alert"
      className="w-full bg-[#3d1a1f] border-b border-[#7f232b] text-[#ffdad6] px-4 py-3 flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-200 z-40"
    >
      <div className="flex items-start sm:items-center gap-3 max-w-4xl">
        <div className="w-7 h-7 rounded bg-[#5a1b21] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 text-[#ffb4ab]">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <div className="font-semibold text-[13px] sm:text-[14px] text-[#ffb4ab] flex items-center gap-2">
            <span>{error.title}</span>
            <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-[#5a1b21] uppercase text-[#ffdad6]">
              {error.type.replace('_', ' ')}
            </span>
          </div>
          <p className="text-[12px] sm:text-[13px] text-[#ffdad6]/90 mt-0.5">
            {error.message}{' '}
            {error.actionable && (
              <span className="text-[#dfe2f1] font-medium underline underline-offset-2 ml-1">
                {error.actionable}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-3">
        {onRetry && (
          <button
            onClick={() => {
              clearError();
              onRetry();
            }}
            className="px-2.5 py-1 text-xs font-medium rounded bg-[#5a1b21] hover:bg-[#7f232b] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
        <button
          onClick={clearError}
          aria-label="Dismiss error"
          className="p-1 rounded hover:bg-[#5a1b21] text-[#ffdad6] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

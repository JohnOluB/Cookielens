export interface ParsedWeb3Error {
  title: string;
  message: string;
  type: 'user_rejected' | 'wallet_missing' | 'unsupported_chain' | 'timeout' | 'generic';
  actionable?: string;
}

export function parseWeb3Error(error: unknown): ParsedWeb3Error {
  if (!error) {
    return {
      title: 'Connection Error',
      message: 'An unexpected connection issue occurred. Please try again.',
      type: 'generic',
    };
  }

  const errorStr = (typeof error === 'string' ? error : (error as Error).message || '').toLowerCase();
  const errorName = (error as Error).name || '';

  // 1. User rejected request (User click cancel / rejected in MetaMask / Rainbow / Phantom)
  if (
    errorStr.includes('user rejected') ||
    errorStr.includes('user denied') ||
    errorStr.includes('rejected by user') ||
    errorStr.includes('user_cancelled') ||
    errorStr.includes('request rejected') ||
    errorName === 'UserRejectedRequestError'
  ) {
    return {
      title: 'Connection Cancelled',
      message: 'You rejected or closed the connection request in your wallet.',
      type: 'user_rejected',
      actionable: 'Click Connect Wallet and approve the signature prompt to connect.',
    };
  }

  // 2. Connector not found (No browser extension installed)
  if (
    errorStr.includes('connector not found') ||
    errorStr.includes('provider not found') ||
    errorStr.includes('window.ethereum is undefined') ||
    errorStr.includes('window.nightly is undefined') ||
    errorStr.includes('nightly not installed') ||
    errorStr.includes('no provider') ||
    errorStr.includes('wallet not found') ||
    errorName === 'ConnectorNotFoundError'
  ) {
    return {
      title: 'Nightly Extension Not Detected',
      message: 'The Nightly Wallet browser extension was not found in your browser.',
      type: 'wallet_missing',
      actionable:
        'Please install the Nightly Wallet extension from the Chrome Web Store or use the interactive Sandbox Mode.',
    };
  }

  // 3. Chain switch / unsupported chain
  if (
    errorStr.includes('switch chain') ||
    errorStr.includes('unsupported chain') ||
    errorStr.includes('chain not configured') ||
    errorStr.includes('network not supported') ||
    errorName === 'SwitchChainError' ||
    errorName === 'ChainNotConfiguredError'
  ) {
    return {
      title: 'Network Switch Error',
      message: 'Your wallet could not automatically switch to the requested network (Cookie Chain).',
      type: 'unsupported_chain',
      actionable: 'Please approve the network addition in your wallet or switch manually.',
    };
  }

  // 4. Timeout / RPC rate limit
  if (errorStr.includes('timeout') || errorStr.includes('rate limit') || errorStr.includes('resource unavailable')) {
    return {
      title: 'Network Timeout',
      message: 'The RPC connection to the blockchain node timed out.',
      type: 'timeout',
      actionable: 'Please check your internet connection or try again in a few moments.',
    };
  }

  // 5. Iframe / Sandbox constraints
  if (errorStr.includes('cross-origin') || errorStr.includes('blocked') || errorStr.includes('frame')) {
    return {
      title: 'Browser Sandbox Restriction',
      message: 'Your browser prevented the wallet popup inside this embedded preview.',
      type: 'generic',
      actionable: 'Open your wallet extension icon in your browser toolbar directly, or open in a new tab.',
    };
  }

  return {
    title: 'Wallet Error',
    message: (error as Error).message || 'Unable to complete wallet connection.',
    type: 'generic',
    actionable: 'Please check your wallet extension status and try again.',
  };
}

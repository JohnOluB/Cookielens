export const COOKIE_CHAIN_RPC = process.env.COOKIE_CHAIN_RPC || 'https://rpc.cookiescan.io';

// Common program IDs on Cookie Chain / Solana SVM
export const PROGRAM_IDS = {
  COOKIESWAP: 'CookieSwapProgram_ID_here', // Get real ID from CookieScan docs
  TOKEN_PROGRAM: 'TokenkegQfeZyiNwAJsyFbPVwwQQfuCS3xfkxN2d44v',
  SYSTEM_PROGRAM: '11111111111111111111111111111111',
};

export const PROGRAM_NAMES: Record<string, string> = {
  'CookieSwapProgram_ID_here': 'CookieSwap',
  'TokenkegQfeZyiNwAJsyFbPVwwQQfuCS3xfkxN2d44v': 'Token Program',
  '11111111111111111111111111111111': 'System Program',
};
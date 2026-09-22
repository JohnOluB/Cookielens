export interface Block {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: string;
  timeAgo: string;
  validatorName: string;
  validatorAddress: string;
  txCount: number;
  durationSeconds: number;
  rewardCookie: number;
  gasUsed: number;
  gasLimit: number;
  baseFeeGwei: number;
  sizeKb: number;
}

export type TxType = 'SWAP' | 'TRANSFER' | 'EXECUTE' | 'MINT' | 'BRIDGE';

export interface Transaction {
  hash: string;
  timeAgo: string;
  timestamp: string;
  blockNumber: number;
  from: string;
  fromLabel?: string;
  to: string;
  toLabel?: string;
  type: TxType;
  valueCookie: number;
  valueUsd: number;
  feeUsd: number;
  gasPriceGwei: number;
  gasUsed: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  nonce: number;
  method?: string;
}

export interface Validator {
  rank: number;
  name: string;
  address: string;
  stakeCookie: number;
  stakeSharePct: number;
  commissionPct: number;
  uptimePct: number;
  blocksProposed: number;
  status: 'ACTIVE' | 'JAILED' | 'SYNCING';
  location: string;
}

export interface TokenItem {
  name: string;
  symbol: string;
  contractAddress: string;
  priceUsd: number;
  change24h: number;
  volume24hUsd: number;
  marketCapUsd: number;
  holdersCount: number;
  type: 'TOKEN' | 'NFT' | 'STABLE';
}

export interface DayTelemetry {
  day: string;
  label: string;
  volumeTxns: number;
  volumeFormatted: string;
  peakUsd: string;
  isToday?: boolean;
}

export interface WalletAccount {
  connected: boolean;
  address: string;
  walletName: string;
  balanceCookie: number;
  balanceUsd: number;
}

import { formatDistanceToNow } from 'date-fns';

export function formatAddress(address: string): string {
  if (!address || address.length < 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-2)}`;
}

export function formatTime(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
}

export function formatFee(fee: number): string {
  // Convert lamports to COOK (1 COOKIE = 1e9 lamports, adjust if needed)
  const cookAmount = fee / 1e9;
  return `${cookAmount.toFixed(9)} COOK`;
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US').format(amount);
}
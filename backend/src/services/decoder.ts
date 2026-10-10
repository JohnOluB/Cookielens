import { PROGRAM_NAMES, PROGRAM_IDS } from '../config/constants';

interface DecodedTx {
  signature: string;
  status: 'confirmed' | 'failed' | 'pending';
  program: string;
  action: string;
  from: string;
  to: string;
  details: Record<string, any>;
  fee: number;
  timestamp: number;
}

export async function decodeTx(rawTx: any): Promise<DecodedTx> {
  // 1. Extract program ID
  const firstInstruction = rawTx.instructions[0];
  const programId = firstInstruction.programId.toString();
  const programName = PROGRAM_NAMES[programId] || 'Unknown Program';

  // 2. Decode based on program type
  let decoded: DecodedTx;

  if (programId === PROGRAM_IDS.COOKIESWAP) {
    decoded = decodeCookieSwap(rawTx, programName);
  } else if (programId === PROGRAM_IDS.TOKEN_PROGRAM) {
    decoded = decodeTokenProgram(rawTx, programName);
  } else {
    decoded = decodeGeneric(rawTx, programName);
  }

  return decoded;
}

function decodeCookieSwap(rawTx: any, programName: string): DecodedTx {
  // TODO: Parse CookieSwap instruction data
  // You'll need CookieSwap's IDL to decode this properly
  return {
    signature: rawTx.signature,
    status: rawTx.status,
    program: programName,
    action: 'Swapped 100 COOK for 50 TOKEN', // Placeholder
    from: rawTx.accountKeys[0]?.pubkey.toString().slice(0, 4) + '...' || 'Unknown',
    to: rawTx.accountKeys[1]?.pubkey.toString().slice(0, 4) + '...' || 'Unknown',
    details: {
      amountIn: 100,
      tokenIn: 'COOK',
      amountOut: 50,
      tokenOut: 'TOKEN',
    },
    fee: rawTx.fee,
    timestamp: rawTx.blockTime || Date.now(),
  };
}

function decodeTokenProgram(rawTx: any, programName: string): DecodedTx {
  // TODO: Parse token transfer instruction
  return {
    signature: rawTx.signature,
    status: rawTx.status,
    program: programName,
    action: 'Transferred tokens',
    from: rawTx.accountKeys[0]?.pubkey.toString().slice(0, 4) + '...' || 'Unknown',
    to: rawTx.accountKeys[1]?.pubkey.toString().slice(0, 4) + '...' || 'Unknown',
    details: {},
    fee: rawTx.fee,
    timestamp: rawTx.blockTime || Date.now(),
  };
}

function decodeGeneric(rawTx: any, programName: string): DecodedTx {
  // Fallback for unknown programs
  return {
    signature: rawTx.signature,
    status: rawTx.status,
    program: programName,
    action: 'Executed instruction',
    from: rawTx.accountKeys[0]?.pubkey.toString().slice(0, 4) + '...' || 'Unknown',
    to: rawTx.accountKeys[1]?.pubkey.toString().slice(0, 4) + '...' || 'Unknown',
    details: rawTx.instructions[0],
    fee: rawTx.fee,
    timestamp: rawTx.blockTime || Date.now(),
  };
}
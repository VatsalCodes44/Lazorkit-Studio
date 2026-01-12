// Transaction utilities for demo purposes
// In production, these would use the actual LazorKit SDK

export interface AccountMeta {
  pubkey: string;
  isSigner: boolean;
  isWritable: boolean;
  role: 'payer' | 'authority' | 'program' | 'data' | 'system';
}

export interface Instruction {
  programId: string;
  programName: string;
  accounts: AccountMeta[];
  data: string;
  dataDecoded?: string;
}

export interface TransactionResult {
  signature: string;
  success: boolean;
  instructions: Instruction[];
  feePayer: string;
  computeUnits: number;
  network: string;
  timestamp: number;
  error?: string;
}

// Generate fake signature
const generateSignature = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 88; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate fake address
const generateAddress = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Simulated Memo instruction
export function buildMemoInstruction(message: string, authority: string): Instruction {
  return {
    programId: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
    programName: 'Memo Program',
    accounts: [
      {
        pubkey: authority,
        isSigner: true,
        isWritable: false,
        role: 'authority',
      },
    ],
    data: Buffer.from(message).toString('base64'),
    dataDecoded: message,
  };
}

// Simulate sending a transaction
export async function simulateTransaction(
  instructions: Instruction[],
  smartWallet: string,
  feeMode: 'paymaster' | 'self'
): Promise<TransactionResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const paymasterAddress = 'LzrPay1111111111111111111111111111111111111';

  return {
    signature: generateSignature(),
    success: true,
    instructions,
    feePayer: feeMode === 'paymaster' ? paymasterAddress : smartWallet,
    computeUnits: 200 + Math.floor(Math.random() * 100),
    network: 'devnet',
    timestamp: Date.now(),
  };
}

// Simulate failed transactions for debugging
export async function simulateFailedTransaction(
  errorType: 'missing_authority' | 'invalid_order' | 'paymaster_rejected'
): Promise<TransactionResult> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const errorMessages = {
    missing_authority: 'Error: Missing required signature for account',
    invalid_order: 'Error: Invalid instruction order - initialization must come before usage',
    paymaster_rejected: 'Error: Paymaster rejected transaction - insufficient sponsored balance',
  };

  return {
    signature: '',
    success: false,
    instructions: [],
    feePayer: '',
    computeUnits: 0,
    network: 'devnet',
    timestamp: Date.now(),
    error: errorMessages[errorType],
  };
}

export function getExplorerUrl(signature: string, network: string = 'devnet'): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=${network}`;
}

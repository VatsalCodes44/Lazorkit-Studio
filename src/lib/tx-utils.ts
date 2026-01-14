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
export function simulateTransaction(
  instructions: Instruction[],
  smartWallet: string,
  feeMode: 'paymaster' | 'self'
): TransactionResult {
  // Simulate network delay

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
  errorType: 'webauthn_insecure_origin' | 'invalid_order' | 'compute_budget_exceeded'
): Promise<TransactionResult> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const errorMessages = {
    webauthn_insecure_origin:
      'Error: WebAuthn is not supported on insecure origins. Passkey signing requires HTTPS with a valid TLS certificate.',

    invalid_order:
      'Error: Invalid instruction order - initialization must come before usage',

    compute_budget_exceeded:
      'Error: Transaction exceeded the compute budget allowed for sponsored execution',
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


import {
  SystemProgram,
  PublicKey,
  SystemInstruction,
} from "@solana/web3.js";

export function mapSolanaTxToInstructions(tx: any, wallet: string): Instruction[] {
  if (!tx) return [];

  const message = tx.transaction.message;
  const accountKeys = message.accountKeys;

  return message.instructions.map((ix: any) => {
    const programId = accountKeys[ix.programIdIndex].toBase58();

    const accounts: AccountMeta[] = ix.accounts.map((accIndex: number) => {
      const pubkey = accountKeys[accIndex].toBase58();
      let role: string;
      let isSigner: boolean;
      let isWritable: boolean;
      if (pubkey == "7Pkkhm8YeoBXFGKHTJXJ8ckdYiqtPdVWMefEVqK5vXed") {
        role = "payer";
        isSigner = true;
        isWritable = true;
      }
      else if (pubkey == wallet) {
        role = "Smart Wallet";
        isSigner = false;
        isWritable = true;
      }
      else if (pubkey == "HtNoPxmkbXRmyvyJvyG89WmAvpq2BtSxnrGJn4PbkE7X") {
        role = "Wallet State";
        isSigner = false;
        isWritable = false;
      }
      else if (pubkey == "F72puD2eiqMLNBw1ABEPkt1o292BpPiU9dF8TjsDFDHh") {
        role = "Wallet Device";
        isSigner = false;
        isWritable = false;
      }
      else if (pubkey == "BiE9vSdz9MidUiyjVYsu3PG4C1fbPZ8CVPADA9jRfXw7") {
        role = "Policy Program";
        isSigner = false;
        isWritable = false;
      }
      else if (pubkey == "HKnKzuJppKxts6mTnnBPP2jkMDr4YJiYBVsvW3hHRoGM") {
        role = "Chunk";
        isSigner = false;
        isWritable = true;
      }
      else {
        role = "Unknown";
        isSigner = false;
        isWritable = false;
      }

      return {
        pubkey,
        isSigner,        // Solana compiled ix does not expose signer here
        isWritable,       // safe default for UI
        role
      };
    });

    // Try to decode System Program transfer
    let dataDecoded: string | undefined;
    let programName = "Unknown Program";

    if (programId === SystemProgram.programId.toBase58()) {
      programName = "System Program";

      try {
        const decoded = SystemInstruction.decodeTransfer(ix);
        dataDecoded = `Transfer ${Number(decoded.lamports) / 1e9} SOL`;
      } catch {
        dataDecoded = "System instruction";
      }
    }

    return {
      programId,
      programName,
      accounts,
      data: ix.data, // base64
      dataDecoded,
    };
  });
}

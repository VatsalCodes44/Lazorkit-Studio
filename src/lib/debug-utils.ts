// Debug utilities for understanding LazorKit transactions

export interface DebugExplanation {
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export function getErrorExplanation(error: string): { explanation: string; fix: string } {
  if (error.includes('Missing required signature')) {
    return {
      explanation: 'The transaction requires a signature from an account that was not included as a signer. In LazorKit, the smart wallet automatically signs, but if you reference other accounts that need to sign, you must include them properly.',
      fix: 'Ensure all accounts marked as `isSigner: true` in your instruction are actually signing the transaction. Check that the authority account is correctly configured.',
    };
  }

  if (error.includes('Invalid instruction order')) {
    return {
      explanation: 'Solana programs often require instructions to be in a specific order. For example, you must create an account before you can write to it.',
      fix: 'Review your instruction order. Initialization instructions (create account, allocate space) must come before operations that use those accounts.',
    };
  }

  if (error.includes('Paymaster rejected')) {
    return {
      explanation: 'The paymaster service refused to sponsor this transaction. This can happen if the transaction exceeds sponsored limits or if the paymaster is out of funds.',
      fix: 'Check your paymaster configuration and balance. You may need to top up your sponsored transaction budget or switch to self-pay mode for this transaction.',
    };
  }

  return {
    explanation: 'An unknown error occurred during transaction execution.',
    fix: 'Review the full error message and check the Solana Explorer for more details.',
  };
}

export function getRoleExplanation(role: string): string {
  const explanations: Record<string, string> = {
    payer: 'This account pays for transaction fees. With LazorKit paymaster mode, this is the paymaster service.',
    authority: 'This account has signing authority over the operation. In LazorKit, this is your smart wallet.',
    program: 'This is the program (smart contract) being invoked. Programs are executable accounts on Solana.',
    data: 'This account stores data for the program. It may be read or written depending on the instruction.',
    system: 'This is a Solana system account, typically used for creating accounts or transferring SOL.',
  };

  return explanations[role] || 'Account used in the transaction.';
}

export function getInstructionExplanation(programName: string): string {
  const explanations: Record<string, string> = {
    'Memo Program': 'The Memo Program allows you to attach arbitrary text data to a transaction. Commonly used for notes, receipts, or social features like posts and likes.',
    'System Program': 'The System Program handles core Solana operations like creating accounts, transferring SOL, and allocating space.',
    'Token Program': 'The Token Program manages SPL tokens - creating mints, transferring tokens, and managing token accounts.',
  };

  return explanations[programName] || 'Program executing on Solana.';
}

export const EDUCATIONAL_CONTENT = {
  passkey: {
    title: 'What is a Passkey?',
    points: [
      'Passkeys are cryptographic credentials stored in your device\'s secure enclave',
      'They use biometrics (FaceID, fingerprint) or device PIN for authentication',
      'Private keys never leave your device - only signatures are transmitted',
      'Passkeys are phishing-resistant and cannot be stolen remotely',
    ],
  },
  smartWallet: {
    title: 'What is a Smart Wallet?',
    points: [
      'A smart wallet is a program-controlled account on Solana',
      'It\'s linked to your passkey but exists on-chain',
      'It can hold tokens, NFTs, and interact with any Solana program',
      'LazorKit automatically creates and manages this for you',
    ],
  },
  paymaster: {
    title: 'What is a Paymaster?',
    points: [
      'A paymaster sponsors transaction fees on your behalf',
      'You don\'t need SOL to transact - the paymaster pays gas fees',
      'This enables true gasless user experiences',
      'Developers configure which transactions to sponsor',
    ],
  },
  instructions: {
    title: 'Why Instructions-Only?',
    points: [
      'LazorKit accepts instructions, not full transactions',
      'This gives LazorKit control over fee payment and signing',
      'You build what you want to do, LazorKit handles the rest',
      'This pattern ensures consistent gasless, keyless execution',
    ],
  },
};

// Debug utilities for understanding LazorKit transactions

export interface DebugExplanation {
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export function getErrorExplanation(
  error: string
): { explanation: string; fix: string } {


  if (error.includes('Invalid instruction order')) {
    return {
      explanation:
        'Solana programs require instructions to be executed in a strict order. For example, an account must be created and initialized before it can be used.',
      fix:
        'Reorder your instructions so that initialization steps (create account, allocate space, initialize) come before any instructions that depend on them.',
    };
  }

  if (
    error.includes('compute budget') ||
    error.includes('Compute budget exceeded') ||
    error.includes('exceeded the compute')
  ) {
    return {
      explanation:
        'The transaction required more compute units than the paymaster allows for sponsored execution. To protect against abuse, paymasters enforce strict compute limits on gasless transactions.',
      fix:
        'Reduce compute usage by simplifying the transaction, splitting it into multiple steps, or removing unnecessary instructions.',
    };
  }


  if (
    error.includes('WebAuthn') ||
    error.includes('insecure origin') ||
    error.includes('TLS')
  ) {
    return {
      explanation:
        'Passkey signing relies on WebAuthn, which is blocked by browsers on insecure origins. This happens when the site is served over HTTP or has an invalid TLS certificate.',
      fix:
        'Run your app on HTTPS with a valid TLS certificate. For local development, use https://localhost or a tunneling service like ngrok or Cloudflare Tunnel.',
    };
  }

  // Fallback
  return {
    explanation:
      'An unknown error occurred during transaction execution.',
    fix:
      'Check the full error logs and ensure all transaction parameters, instructions, and environment requirements are correctly configured.',
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

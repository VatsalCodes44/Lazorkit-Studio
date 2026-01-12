import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Simulated wallet state for demo purposes
interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  smartWalletAddress: string | null;
  network: 'devnet' | 'mainnet';
  feeMode: 'paymaster' | 'self';
}

interface WalletContextType {
  wallet: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

// Generate a fake Solana address for demo
const generateFakeAddress = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    publicKey: null,
    smartWalletAddress: null,
    network: 'devnet',
    feeMode: 'paymaster',
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    
    // Simulate passkey authentication delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate fake addresses for demo
    const publicKey = generateFakeAddress();
    const smartWalletAddress = generateFakeAddress();
    
    setWallet({
      isConnected: true,
      publicKey,
      smartWalletAddress,
      network: 'devnet',
      feeMode: 'paymaster',
    });
    
    setIsConnecting(false);
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      isConnected: false,
      publicKey: null,
      smartWalletAddress: null,
      network: 'devnet',
      feeMode: 'paymaster',
    });
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect, isConnecting }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from "@lazorkit/wallet";
import { Button } from '@/components/ui/button';
import { EducationalCard } from '@/components/EducationalCard';
import { DebugPanel } from '@/components/DebugPanel';
import { EDUCATIONAL_CONTENT } from '@/lib/debug-utils';
import { buildMemoInstruction, Instruction, mapSolanaTxToInstructions, simulateTransaction, TransactionResult } from '@/lib/tx-utils';
import { Heart, MessageCircle, Share2, Zap, Code, CheckCircle2 } from 'lucide-react';
import { CodeBlock } from '@/components/ui/code-block';
import {
  Connection,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { ScrollArea } from '@radix-ui/react-scroll-area';

const DEMO_POST = {
  author: 'solana_dev.sol',
  avatar: '🧑‍💻',
  content: 'Just shipped my first LazorKit integration! Passkey auth + gasless transactions = 🔥',
  timestamp: '2 hours ago',
  likes: 42,
  comments: 8,
};
export default function Actions() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const [txCompleted, setTxCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feePayer, setFeePayer] = useState<"paymaster" | "self">("paymaster");
  const txData = useRef({
    amount: 0,
    to: "",
  });
  const [txResult, setTxResult] = useState<TransactionResult | null>(null);

  useEffect(() => {
    if (!wallet.isConnected) {
      navigate('/login');
    }
  }, [wallet.isConnected, navigate]);

  const sendSolTsx =
    `import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";
import {
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

export function SendSol() {
  const { wallet, signAndSendTransaction, isConnected } = useWallet();

  const [txData, setTxData] = useState({
    amount: 0,
    to: "",
  });

  const handleSendSol = async () => {
    if (!isConnected || !wallet?.smartWallet) return;
    if (!txData.to || txData.amount <= 0) return;

    const lamports = Math.floor(
      txData.amount * LAMPORTS_PER_SOL
    );

    const transferInstruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(wallet.smartWallet),
      toPubkey: new PublicKey(txData.to),
      lamports,
    });

    const signature = await signAndSendTransaction({
      instructions: [transferInstruction],
      transactionOptions: {
        clusterSimulation: "devnet",
      },
    });

    console.log("Signature:", signature);
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Amount (SOL)"
        onChange={(e) =>
          setTxData({ ...txData, amount: parseFloat(e.target.value) })
        }
      />
      <input
        type="text"
        placeholder="Recipient address"
        onChange={(e) =>
          setTxData({ ...txData, to: e.target.value })
        }
      />
      <button onClick={handleSendSol}>
        Send SOL (Gasless)
      </button>
    </div>
  );
}`

  const handleSendSol = async () => {
    if (
      isProcessing ||
      txData.current.amount <= 0 ||
      !txData.current.to
    ) return;

    setIsProcessing(true);
    setTxResult(null);

    try {
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );

      const lamports = Math.floor(
        txData.current.amount * LAMPORTS_PER_SOL
      );

      const transferInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet.wallet.smartWallet),
        toPubkey: new PublicKey(txData.current.to),
        lamports,
      });

      const signature = await wallet.signAndSendTransaction({
        instructions: [transferInstruction],
        transactionOptions: {
          clusterSimulation: "devnet",
        },
      });

      const fetchTxData = await connection.getTransaction(signature, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });

      if (!fetchTxData) {
        throw new Error("Transaction not found on devnet");
      }


      // ✅ TRUE fee payer (paymaster or wallet)
      const feePayer =
        fetchTxData.transaction.message
          .getAccountKeys().staticAccountKeys[0]
          .toBase58();

      const instructions = mapSolanaTxToInstructions(fetchTxData, wallet.wallet.smartWallet);

      const result: TransactionResult = {
        signature,
        success: true,
        instructions,
        feePayer,
        computeUnits: fetchTxData.meta?.computeUnitsConsumed ?? 0,
        network: "devnet",
        timestamp: fetchTxData.blockTime
      };

      localStorage.setItem(
        "lastTransaction",
        JSON.stringify(result)
      );

      setTxResult(result);
      setTxCompleted(true);

    } catch (e) {
      console.error(e);
      console.error(wallet.error);
    } finally {
      setIsProcessing(false);
    }
  };


  if (!wallet.isConnected) return null;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Gasless Actions</h1>
                <p className="text-sm text-muted-foreground">Try a real on-chain action without paying gas</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Action Demo */}
            <div className="space-y-6">
              {/* Wallet Card */}
              <div className="glass rounded-2xl p-6 animate-fade-in">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Demo: Send SOL</h3>

                {/* Post */}
                <div className="p-4 rounded-xl bg-secondary/50 mb-4">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                      💸
                    </div>
                    <div>
                      <p className="font-medium text-foreground">solana_dev.sol</p>
                      <p className="text-xs text-muted-foreground">
                        Demo: Gasless SOL Transfer
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-foreground mb-4">
                    Send SOL on Solana without paying any transaction fees.
                    LazorKit sponsors the gas using a Paymaster.
                    <br />
                    <span className="text-xs text-muted-foreground">
                      Note: You must have sufficient <strong>Devnet SOL</strong> to cover the transfer amount.
                      Transaction fees are fully sponsored.
                    </span>
                  </p>

                  {/* Transfer details */}
                  <div className="rounded-xl border bg-muted/40 p-4 mb-4 text-sm space-y-2">
                    <div className="flex justify-between items-center gap-6">
                      <span className="text-muted-foreground text-md">Amount</span>
                      <input
                        onChange={(e) => {
                          txData.current.amount = parseFloat(e.target.value) || 0;
                        }}
                        className="max-w-[300px] w-full p-1 px-2 rounded-md bg-secondary/50 border border-border text-foreground text-md font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="0 SOL" type="number" min="0"
                      />
                    </div>

                    <div className="flex justify-between items-center gap-6">
                      <span className="text-muted-foreground text-md">Recipient</span>
                      <input
                        onChange={(e) => {
                          txData.current.to = e.target.value;
                        }}
                        className="max-w-[300px] w-full p-1 px-2 rounded-md bg-secondary/50 border border-border text-foreground text-md font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Enter recipient address..."
                      />
                    </div>

                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Transaction Fee</span>
                      <span className="font-semibold text-success">0 SOL</span>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    className="w-full"
                    variant="hero"
                    onClick={handleSendSol}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Sending SOL…" : "Send SOL (Gasless)"}
                  </Button>

                  {/* Gas note */}
                  <p className="mt-3 text-xs text-muted-foreground text-center">
                    Fees sponsored by Paymaster
                  </p>
                </div>

                {/* Status */}
                {txCompleted && (
                  <div className="flex items-center gap-2 text-success text-sm animate-fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    Like recorded on-chain! You paid 0 SOL.
                  </div>
                )}
              </div>

              {/* Explanation */}
              <EducationalCard
                title={EDUCATIONAL_CONTENT.paymaster.title}
                points={EDUCATIONAL_CONTENT.paymaster.points}
                icon={<Zap className="w-5 h-5 text-primary" />}
                variant="highlight"
              />

              <EducationalCard
                title={EDUCATIONAL_CONTENT.instructions.title}
                points={EDUCATIONAL_CONTENT.instructions.points}
                icon={<Code className="w-5 h-5 text-primary" />}
              />
            </div>

            {/* Right: Debug Panel */}
            <div className="animate-slide-in-right space-y-6" style={{ animationDelay: '200ms' }}>
              <h3 className="text-lg font-semibold text-foreground">Transaction Details</h3>
              <DebugPanel result={txResult} isLoading={isProcessing} />
              <div className="w-full animate-slide-in-right space-y-6">
                <div className='glass rounded-2xl transition-all duration-300 hover:border-primary/30'>
                  <CodeBlock
                    language="jsx"
                    filename="SendSol.tsx"
                    highlightLines={[1, 10, 31, 32, 33, 34, 35, 36]}
                    code={sendSolTsx}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div >
  );
}



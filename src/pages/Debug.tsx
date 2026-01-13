import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@lazorkit/wallet';
import { Button } from '@/components/ui/button';
import { DebugPanel } from '@/components/DebugPanel';
import { EducationalCard } from '@/components/EducationalCard';
import { EDUCATIONAL_CONTENT } from '@/lib/debug-utils';
import { buildMemoInstruction, simulateTransaction, TransactionResult } from '@/lib/tx-utils';
import { Bug, Send, Code, Wallet, Zap, RotateCw } from 'lucide-react';

export default function Debug() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [txResult, setTxResult] = useState<TransactionResult | null>(null);
  const [customMessage, setCustomMessage] = useState('Hello from LazorKit! 🚀');

  useEffect(() => {
    if (!wallet.isConnected) {
      navigate('/login');
    }
  }, [wallet.isConnected, navigate]);

  const sendTransaction = async () => {
    if (isProcessing || !wallet.wallet.smartWallet) return;

    setIsProcessing(true);
    setTxResult(null);

    try {
      const memoInstruction = buildMemoInstruction(customMessage, wallet.wallet.smartWallet);
      const result = await simulateTransaction(
        [memoInstruction],
        wallet.wallet.smartWallet,
        "paymaster"
      );
      setTxResult(result);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTransaction = () => {
    setTxResult(null);
    setCustomMessage('Hello from LazorKit! 🚀');
  };

  if (!wallet.isConnected) return null;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-400 flex items-center justify-center">
                <Bug className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Debug Panel</h1>
                <p className="text-sm text-muted-foreground">Understand how LazorKit transactions work internally</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: Transaction Builder */}
            <div className="lg:col-span-2 space-y-6">
              {/* Transaction Builder Card */}
              <div className="glass rounded-2xl p-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Transaction Builder
                </h3>

                <div className="space-y-4">
                  {/* Message Input */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-2">
                      Memo Message
                    </label>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full p-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      placeholder="Enter your message..."
                    />
                  </div>

                  {/* Wallet Info */}
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Wallet className="w-3.5 h-3.5" />
                      Signing Authority
                    </div>
                    <code className="text-xs font-mono text-foreground">
                      {wallet.wallet.smartWallet?.slice(0, 16)}...
                    </code>
                  </div>

                  {/* Fee Mode */}
                  <div className="p-3 rounded-lg bg-success/10 border border-success/30">
                    <div className="flex items-center gap-2 text-xs text-success mb-1">
                      <Zap className="w-3.5 h-3.5" />
                      Fee Mode: Paymaster
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Transaction fees will be sponsored
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="hero"
                      className="flex-1"
                      onClick={sendTransaction}
                      disabled={isProcessing || !customMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                      Send Transaction
                    </Button>
                    <Button variant="outline" onClick={resetTransaction} disabled={isProcessing}>
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Educational Cards */}
              <EducationalCard
                title={EDUCATIONAL_CONTENT.instructions.title}
                points={EDUCATIONAL_CONTENT.instructions.points}
                icon={<Code className="w-5 h-5 text-primary" />}
                variant="highlight"
              />

              <div className="glass rounded-2xl p-6">
                <h4 className="font-semibold text-foreground mb-3">🎓 Why Instructions-Only?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  LazorKit accepts <strong className="text-foreground">instructions</strong>, not full transactions. This is intentional:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">→</span>
                    You define <strong className="text-foreground">what</strong> you want to do
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">→</span>
                    LazorKit handles <strong className="text-foreground">how</strong> to execute it
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">→</span>
                    Fee payment, signing, and versioning are abstracted away
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Debug Panel */}
            <div className="lg:col-span-3 animate-slide-in-right" style={{ animationDelay: '200ms' }}>
              <h3 className="text-lg font-semibold text-foreground mb-4">Transaction Breakdown</h3>
              <DebugPanel result={txResult} isLoading={isProcessing} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

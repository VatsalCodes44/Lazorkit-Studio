import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/lib/wallet-context';
import { Button } from '@/components/ui/button';
import { EducationalCard } from '@/components/EducationalCard';
import { DebugPanel } from '@/components/DebugPanel';
import { EDUCATIONAL_CONTENT } from '@/lib/debug-utils';
import { buildMemoInstruction, simulateTransaction, TransactionResult } from '@/lib/tx-utils';
import { Heart, MessageCircle, Share2, Zap, Code, CheckCircle2 } from 'lucide-react';

// Fake social post for demo
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
  const { wallet } = useWallet();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(DEMO_POST.likes);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txResult, setTxResult] = useState<TransactionResult | null>(null);

  useEffect(() => {
    if (!wallet.isConnected) {
      navigate('/login');
    }
  }, [wallet.isConnected, navigate]);

  const handleLike = async () => {
    if (isProcessing || !wallet.smartWalletAddress) return;

    setIsProcessing(true);
    setTxResult(null);

    try {
      // Build the Memo instruction
      const memoInstruction = buildMemoInstruction(
        `❤️ Liked post by ${DEMO_POST.author}`,
        wallet.smartWalletAddress
      );

      // Simulate sending transaction
      const result = await simulateTransaction(
        [memoInstruction],
        wallet.smartWalletAddress,
        wallet.feeMode
      );

      setTxResult(result);

      if (result.success) {
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
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
              {/* Social Post Card */}
              <div className="glass rounded-2xl p-6 animate-fade-in">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Demo: Social Like Action</h3>
                
                {/* Post */}
                <div className="p-4 rounded-xl bg-secondary/50 mb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                      {DEMO_POST.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{DEMO_POST.author}</p>
                      <p className="text-xs text-muted-foreground">{DEMO_POST.timestamp}</p>
                    </div>
                  </div>
                  <p className="text-foreground mb-4">{DEMO_POST.content}</p>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-6 pt-3 border-t border-border">
                    <Button
                      variant={isLiked ? 'success' : 'ghost'}
                      size="sm"
                      onClick={handleLike}
                      disabled={isProcessing || isLiked}
                      className={isLiked ? 'text-success-foreground' : ''}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      {likeCount}
                    </Button>
                    <Button variant="ghost" size="sm" disabled>
                      <MessageCircle className="w-4 h-4" />
                      {DEMO_POST.comments}
                    </Button>
                    <Button variant="ghost" size="sm" disabled>
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Status */}
                {isLiked && (
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
            <div className="animate-slide-in-right" style={{ animationDelay: '200ms' }}>
              <h3 className="text-lg font-semibold text-foreground mb-4">Transaction Details</h3>
              <DebugPanel result={txResult} isLoading={isProcessing} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

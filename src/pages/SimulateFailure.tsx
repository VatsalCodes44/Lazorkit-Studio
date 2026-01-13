import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@lazorkit/wallet';
import { Button } from '@/components/ui/button';
import { simulateFailedTransaction, TransactionResult } from '@/lib/tx-utils';
import { getErrorExplanation } from '@/lib/debug-utils';
import {
  AlertTriangle,
  Key,
  ListOrdered,
  CreditCard,
  XCircle,
  Lightbulb,
  RotateCw,
  AlertCircle
} from 'lucide-react';

const FAILURE_SCENARIOS = [
  {
    id: 'missing_authority',
    title: 'Missing Authority',
    description: 'Simulate a transaction where a required signer is missing',
    icon: Key,
    color: 'text-destructive',
    bgColor: 'bg-destructive/20',
  },
  {
    id: 'invalid_order',
    title: 'Invalid Instruction Order',
    description: 'Simulate instructions in the wrong sequence',
    icon: ListOrdered,
    color: 'text-warning',
    bgColor: 'bg-warning/20',
  },
  {
    id: 'paymaster_rejected',
    title: 'Paymaster Rejected',
    description: 'Simulate a paymaster refusing to sponsor the transaction',
    icon: CreditCard,
    color: 'text-accent',
    bgColor: 'bg-accent/20',
  },
] as const;

type FailureType = typeof FAILURE_SCENARIOS[number]['id'];

export default function SimulateFailure() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const [selectedScenario, setSelectedScenario] = useState<FailureType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txResult, setTxResult] = useState<TransactionResult | null>(null);

  useEffect(() => {
    if (!wallet.isConnected) {
      navigate('/login');
    }
  }, [wallet.isConnected, navigate]);

  const simulateFailure = async (scenarioId: FailureType) => {
    setIsProcessing(true);
    setSelectedScenario(scenarioId);
    setTxResult(null);

    try {
      const result = await simulateFailedTransaction(scenarioId);
      setTxResult(result);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedScenario(null);
    setTxResult(null);
  };

  const errorInfo = txResult?.error ? getErrorExplanation(txResult.error) : null;

  if (!wallet.isConnected) return null;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-destructive to-orange-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Failure Simulation</h1>
                <p className="text-sm text-muted-foreground">Learn to debug common transaction errors</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Scenario Selection */}
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-foreground mb-4">Choose a Failure Scenario</h3>

                <div className="space-y-3">
                  {FAILURE_SCENARIOS.map((scenario) => {
                    const isActive = selectedScenario === scenario.id;
                    const Icon = scenario.icon;

                    return (
                      <button
                        key={scenario.id}
                        onClick={() => simulateFailure(scenario.id)}
                        disabled={isProcessing}
                        className={`w-full p-4 rounded-xl text-left transition-all ${isActive
                            ? 'bg-secondary ring-2 ring-primary'
                            : 'bg-secondary/50 hover:bg-secondary/80'
                          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg ${scenario.bgColor} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-5 h-5 ${scenario.color}`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-1">{scenario.title}</h4>
                            <p className="text-sm text-muted-foreground">{scenario.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedScenario && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button variant="outline" onClick={reset} className="w-full">
                      <RotateCw className="w-4 h-4" />
                      Reset
                    </Button>
                  </div>
                )}
              </div>

              {/* Why This Matters */}
              <div className="glass rounded-2xl p-6 border-l-4 border-l-warning">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  Why Learn Failure Modes?
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real transactions fail for predictable reasons</li>
                  <li>• Understanding errors speeds up debugging</li>
                  <li>• Better error handling = better user experience</li>
                  <li>• Production apps need graceful error recovery</li>
                </ul>
              </div>
            </div>

            {/* Right: Error Analysis */}
            <div className="animate-slide-in-right" style={{ animationDelay: '200ms' }}>
              {isProcessing ? (
                <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-12 h-12 border-2 border-destructive border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-muted-foreground">Simulating failure...</p>
                </div>
              ) : txResult && errorInfo ? (
                <div className="space-y-6">
                  {/* Error Display */}
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Transaction Failed</h3>
                        <p className="text-sm text-muted-foreground">Analyze the error below</p>
                      </div>
                    </div>

                    {/* Raw Error */}
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 mb-6">
                      <p className="text-sm font-medium text-destructive mb-1">Raw Error Message</p>
                      <code className="text-xs font-mono text-muted-foreground">
                        {txResult.error}
                      </code>
                    </div>

                    {/* Explanation */}
                    <div className="p-4 rounded-lg bg-secondary/50 mb-4">
                      <h4 className="text-sm font-medium text-foreground mb-2">What Happened?</h4>
                      <p className="text-sm text-muted-foreground">
                        {errorInfo.explanation}
                      </p>
                    </div>

                    {/* Fix */}
                    <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                      <div className="flex items-center gap-2 text-success mb-2">
                        <Lightbulb className="w-4 h-4" />
                        <h4 className="text-sm font-medium">How to Fix</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {errorInfo.fix}
                      </p>
                    </div>
                  </div>

                  {/* Developer Tips */}
                  <div className="glass rounded-2xl p-6">
                    <h4 className="font-semibold text-foreground mb-3">🎓 Developer Tips</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">1.</span>
                        Always validate instruction data before sending
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">2.</span>
                        Check account permissions match your intent
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">3.</span>
                        Use Solana Explorer to inspect failed transactions
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">4.</span>
                        Implement proper error handling in your frontend
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No Error to Analyze</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Select a failure scenario from the left to simulate a transaction error and learn how to debug it.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

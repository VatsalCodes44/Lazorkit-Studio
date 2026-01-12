import { ExternalLink, Clock, Cpu, Wallet, Globe, CheckCircle2, XCircle } from 'lucide-react';
import { TransactionResult, getExplorerUrl } from '@/lib/tx-utils';
import { InstructionCard } from './InstructionCard';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';

interface DebugPanelProps {
  result: TransactionResult | null;
  isLoading?: boolean;
}

export function DebugPanel({ result, isLoading }: DebugPanelProps) {
  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground">Processing transaction...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <Cpu className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No Transaction Data</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Send a transaction to see the detailed breakdown of instructions, accounts, and execution details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Transaction Status */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Transaction Result</h3>
          <StatusBadge status={result.success ? 'success' : 'error'}>
            {result.success ? 'Success' : 'Failed'}
          </StatusBadge>
        </div>

        {result.success ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Wallet className="w-3.5 h-3.5" />
                Fee Payer
              </div>
              <code className="text-xs font-mono text-foreground">
                {result.feePayer.slice(0, 8)}...{result.feePayer.slice(-8)}
              </code>
              <p className="text-[10px] text-primary mt-1">Paymaster (Gasless)</p>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Cpu className="w-3.5 h-3.5" />
                Compute Units
              </div>
              <p className="text-sm font-mono text-foreground">{result.computeUnits} CU</p>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Globe className="w-3.5 h-3.5" />
                Network
              </div>
              <p className="text-sm font-medium text-foreground capitalize">{result.network}</p>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Clock className="w-3.5 h-3.5" />
                Timestamp
              </div>
              <p className="text-sm font-mono text-foreground">
                {new Date(result.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive mb-1">Transaction Failed</p>
                <code className="text-xs font-mono text-muted-foreground">{result.error}</code>
              </div>
            </div>
          </div>
        )}

        {result.signature && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Signature</p>
                <code className="text-xs font-mono text-foreground">
                  {result.signature.slice(0, 20)}...{result.signature.slice(-20)}
                </code>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(getExplorerUrl(result.signature, result.network), '_blank')}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Explorer
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions Breakdown */}
      {result.instructions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Instructions ({result.instructions.length})
          </h3>
          <div className="space-y-4">
            {result.instructions.map((instruction, index) => (
              <InstructionCard key={index} instruction={instruction} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Educational Callout */}
      {result.success && (
        <div className="glass rounded-2xl p-6 border-l-4 border-l-primary">
          <h4 className="font-medium text-foreground mb-2">🎓 What Just Happened?</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              Your smart wallet signed the transaction using your device's passkey
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              The paymaster paid all gas fees - you spent 0 SOL
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              No private key exists in your browser - only the device's secure enclave can sign
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@lazorkit/wallet';
import { TransactionResult } from '@/lib/tx-utils';
import {
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// ============================================
// UTILITY: COPY BUTTON
// ============================================
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 hover:bg-secondary rounded transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-500" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
      )}
    </button>
  );
}

// ============================================
// SECTION 1: STORY MODE (THE CORE)
// ============================================

function StoryStep({
  number,
  title,
  description
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 py-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
        <span className="text-sm font-semibold text-primary">①②③④⑤⑥⑦"[number - 1]</span>
      </div>
      <div className="flex-1 pt-1">
        <h4 className="text-base font-medium text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

const circledNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦'];

function StoryMode({ tx }: { tx: TransactionResult }) {
  const actionType = tx.instructions[0]?.programName || 'an action';

  const steps = [
    {
      title: "You expressed intent",
      description: `You wanted to perform ${actionType.toLowerCase()}. No wallet extension opened. No gas prompt appeared.`
    },
    {
      title: "The app created instructions",
      description: "Only instructions were created — no transaction, no gas, no signatures. Just a description of what should happen."
    },
    {
      title: "LazorKit took ownership",
      description: "Instructions were passed to LazorKit for secure execution. It wrapped your intent into a valid Solana transaction."
    },
    {
      title: "A paymaster sponsored the gas",
      description: "Transaction fees were paid by a paymaster, not you. You spent exactly 0 SOL on network costs."
    },
    {
      title: "You approved with a passkey",
      description: "No wallet popup. No private key. Your device's secure enclave signed the intent using WebAuthn cryptography."
    },
    {
      title: "Solana executed the transaction",
      description: "The blockchain processed the transaction. Validators confirmed. The network reached consensus."
    },
    {
      title: "Final state recorded",
      description: tx.success
        ? "The result is now immutable and verifiable on-chain. This cannot be undone or forged."
        : "The transaction failed, but the attempt is still recorded and verifiable on-chain."
    }
  ];

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-foreground mb-2">
        What happened when you clicked the button?
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        A step-by-step breakdown of how your click became an on-chain transaction.
      </p>

      <div className="divide-y divide-border">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4 py-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
              <span className="text-lg text-primary">{circledNumbers[index]}</span>
            </div>
            <div className="flex-1 pt-0.5">
              <h4 className="text-base font-medium text-foreground mb-1">{step.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// SECTION 2: PROOF SNAPSHOT
// ============================================

function ProofSnapshot({ tx }: { tx: TransactionResult }) {
  const explorerUrl = `https://explorer.solana.com/tx/${tx.signature}?cluster=${tx.network}`;

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-foreground mb-4">Proof Snapshot</h2>

      <div className="bg-card border border-border rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          {tx.success ? (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
              Confirmed
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-sm font-medium text-destructive">
              <XCircle className="w-4 h-4" />
              Failed
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Network</span>
          <span className="text-sm font-medium text-foreground capitalize">{tx.network}</span>
        </div>

        {tx.signature && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Signature</span>
            <div className="flex items-center gap-1">
              <code className="text-xs font-mono text-foreground">
                {tx.signature.slice(0, 8)}...{tx.signature.slice(-6)}
              </code>
              <CopyButton text={tx.signature} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Block time</span>
          <span className="text-sm font-mono text-foreground">
            {new Date(tx.timestamp).toLocaleString()}
          </span>
        </div>

        {tx.signature && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-border text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View on Solana Explorer
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </section>
  );
}

// ============================================
// SECTION 3: GASLESS VERIFICATION
// ============================================

function GaslessVerification({ tx }: { tx: TransactionResult }) {
  const networkFee = 0.00001;

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-foreground mb-4">Gasless Verification</h2>

      <div className="bg-card border border-border rounded-lg p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">You paid</span>
            <span className="text-lg font-mono font-bold text-emerald-500">0 SOL</span>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Network cost</span>
            <span className="text-sm font-mono text-foreground">{networkFee.toFixed(6)} SOL</span>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Paid by</span>
            <span className="text-sm font-medium text-primary">Paymaster</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
          This is why the transaction felt gasless.
        </p>
      </div>
    </section>
  );
}

// ============================================
// SECTION 4: INSTRUCTION EXPLAINER (HUMAN-READABLE)
// ============================================

function InstructionExplainer({ tx }: { tx: TransactionResult }) {
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-foreground mb-4">What Instructions Ran</h2>

      <div className="space-y-3">
        {tx.instructions.map((ix, index) => {
          // Generate human-readable explanation
          const programName = ix.programName || 'Unknown Program';
          let explanation = 'Executed a Lazorkit chunk instruction which processed session logic and triggered an inner SOL transfer.';
          let affected = "Smart Wallet, Wallet State, Chunk account, and recipient account (balances changed)."
          let reason = "To execute a chunked operation inside the Lazorkit smart wallet, including refunding or transferring SOL as part of session execution.";

          return (
            <div key={index} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-mono text-muted-foreground">
                  Instruction #{index + 1}
                </span>
                <span className="text-xs font-medium text-primary">{programName}</span>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">What it did: </span>
                  <span className="text-foreground">{explanation}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Account affected: </span>
                  <span className="text-foreground">{affected}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Why needed: </span>
                  <span className="text-foreground">{reason}</span>
                </div>
              </div>

              <Collapsible open={showTechnical} onOpenChange={setShowTechnical}>
                <CollapsibleTrigger className="flex items-center gap-1 mt-3 pt-3 border-t border-border text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronDown className={`w-3 h-3 transition-transform ${showTechnical ? 'rotate-180' : ''}`} />
                  {showTechnical ? 'Hide' : 'Show'} technical details
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="bg-secondary/50 rounded p-3 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Program ID</span>
                      <div className="flex items-center gap-1">
                        <code className="text-foreground">{ix.programId.slice(0, 12)}...</code>
                        <CopyButton text={ix.programId} />
                      </div>
                    </div>
                    {ix.dataDecoded && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Data</span>
                        <code className="text-foreground">{ix.dataDecoded}</code>
                      </div>
                    )}
                    <div className="pt-2 border-t border-border">
                      <span className="text-muted-foreground block mb-1">Accounts ({ix.accounts.length})</span>
                      {ix.accounts.map((acc, i) => (
                        <div key={i} className="flex items-center justify-between py-0.5">
                          <span className="text-muted-foreground flex items-center gap-2 capitalize">
                            {acc.role}
                            {acc.isSigner && (
                              <span className="px-1.5 py-0.5 inline rounded text-[10px] font-medium bg-primary/20 text-primary">
                                SIGNER
                              </span>
                            )}
                            {acc.isWritable && (
                              <span className="px-1.5 py-0.5 inline rounded text-[10px] font-medium bg-warning/20 text-warning">
                                WRITABLE
                              </span>
                            )}
                          </span>
                          <code className="text-foreground truncate px-2">{acc.pubkey}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================
// SECTION 5: WHO DID WHAT (RESPONSIBILITY TABLE)
// ============================================

function ResponsibilityTable() {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-foreground mb-4">Who Did What</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* User */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">User</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              Chose action
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              Approved intent
            </li>
          </ul>
        </div>

        {/* LazorKit */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">LazorKit</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              Built transaction
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              Sponsored gas
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              Managed signing
            </li>
          </ul>
        </div>

        {/* Blockchain */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Blockchain</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              Verified
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              Executed
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              Finalized
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 6: ADVANCED (COLLAPSED RAW DATA)
// ============================================

function AdvancedSection({ tx }: { tx: TransactionResult }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const rawData = {
    signature: tx.signature,
    feePayer: tx.feePayer,
    network: tx.network,
    timestamp: tx.timestamp,
    computeUnits: tx.computeUnits,
    success: tx.success,
    error: tx.error,
    instructions: tx.instructions.map(ix => ({
      programId: ix.programId,
      programName: ix.programName,
      data: ix.dataDecoded,
      accounts: ix.accounts.map(a => ({
        role: a.role,
        pubkey: a.pubkey,
        isSigner: a.isSigner,
        isWritable: a.isWritable
      }))
    }))
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(JSON.stringify(rawData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mb-10">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-4 bg-secondary/50 border border-border rounded-lg hover:bg-secondary/70 transition-colors">
          <span className="text-sm font-medium text-foreground">
            Advanced: Raw Transaction Data
          </span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-3 bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <span className="text-xs text-muted-foreground">For protocol-level inspection</span>
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy all'}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto max-h-80">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}

// ============================================
// EMPTY STATE
// ============================================

function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        No transaction to explain yet
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Perform an action to see how it executes step-by-step.
      </p>
      <button
        onClick={() => navigate('/actions')}
        className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
      >
        Go to Actions →
      </button>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function Debug() {
  const wallet = useWallet();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionResult | null>();

  useEffect(() => {
    const stored = localStorage.getItem('lastTransaction');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      // Normalize timestamp (seconds → ms)
      if (parsed.timestamp < 1e12) {
        parsed.timestamp = parsed.timestamp * 1000;
      }

      setTransaction(parsed);
    } catch (e) {
      console.error("Failed to parse lastTransaction:", e);
    }
  }, []);


  // Redirect if not connected
  useEffect(() => {
    if (!wallet.isConnected) {
      navigate('/login');
    }
  }, [wallet.isConnected, navigate]);

  if (!wallet.isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <header className="mb-10">
            <h1 className="text-xl font-bold text-foreground mb-2">
              Transaction Flow Inspector
            </h1>
            <p className="text-sm text-muted-foreground">
              How your click became an on-chain transaction — step by step
            </p>
          </header>

          {transaction ? (
            <>
              <StoryMode tx={transaction} />
              <ProofSnapshot tx={transaction} />
              <GaslessVerification tx={transaction} />
              <InstructionExplainer tx={transaction} />
              <ResponsibilityTable />
              <AdvancedSection tx={transaction} />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EducationalCard } from '@/components/EducationalCard';
import { EDUCATIONAL_CONTENT } from '@/lib/debug-utils';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Wallet,
  Copy,
  Check,
  Globe,
  Zap,
  Shield,
  ArrowRight,
  ExternalLink,
  Fingerprint,
  CheckCircle2
} from 'lucide-react';
import { CodeBlock } from '@/components/ui/code-block';
import { useWallet } from '@lazorkit/wallet';

export default function Dashboard() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const [copied, setCopied] = useState(false);

  const appTsx =
    `import { LazorkitProvider } from '@lazorkit/wallet';

const CONFIG = {
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: { 
    paymasterUrl: "https://kora.devnet.lazorkit.com" 
  }
};

export default function App() {
  return (
    <LazorkitProvider
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      paymasterConfig={CONFIG.PAYMASTER}
    >
      <MainContent />
    </LazorkitProvider>
  );
}`;

  const connectButtonTsx =
    `import { useWallet } from '@lazorkit/wallet';

export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, wallet } = useWallet();

  if (isConnected && wallet) {
    return (
      <button onClick={() => disconnect()}>
        Disconnect ({wallet.smartWallet.slice(0, 6)}...)
      </button>
    );
  }

  return (
    <button onClick={() => connect()} disabled={isConnecting}>
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}`;

  useEffect(() => {
    if (!wallet.isConnected) {
      navigate('/login');
    }
  }, [wallet.isConnected, navigate]);

  const copyAddress = async () => {
    const address = wallet.wallet.smartWallet;
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Your LazorKit smart wallet is ready</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Info Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Smart Wallet Card */}
              <div className="glass rounded-2xl p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Smart Wallet</h2>
                  <StatusBadge status="success">Connected</StatusBadge>
                </div>

                <div className="space-y-4">
                  {/* Wallet Address */}
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Wallet Address</span>
                      <button
                        onClick={() => copyAddress()}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        {copied === true ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <code className="text-sm font-mono text-foreground break-all">
                      {wallet.wallet.smartWallet}
                    </code>
                  </div>

                  {/* Status Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">Network</span>
                      </div>
                      <p className="font-medium text-foreground capitalize">Devnet</p>
                    </div>

                    <div className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">Fee Mode</span>
                      </div>
                      <p className="font-medium text-foreground capitalize">Paymaster</p>
                      <p className="text-xs text-success">Gasless</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What Happened Card */}
              <div className="glass rounded-2xl p-6 border-l-4 border-l-primary animate-fade-in" style={{ animationDelay: '100ms' }}>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  What Just Happened?
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Fingerprint className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span>You authenticated using your device's passkey (FaceID, TouchID, or PIN)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Wallet className="w-3.5 h-3.5 text-success" />
                    </div>
                    <span>LazorKit automatically created a smart wallet account on Solana Devnet</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Shield className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <span>No browser extension was installed — your private key lives in your device's secure enclave</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-warning" />
                    </div>
                    <span>Paymaster mode is enabled — all transaction fees are sponsored</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <EducationalCard
                  title={EDUCATIONAL_CONTENT.smartWallet.title}
                  points={EDUCATIONAL_CONTENT.smartWallet.points}
                  icon={<Wallet className="w-5 h-5 text-primary" />}
                />

                <EducationalCard
                  title={EDUCATIONAL_CONTENT.paymaster.title}
                  points={EDUCATIONAL_CONTENT.paymaster.points}
                  icon={<Zap className="w-5 h-5 text-primary" />}
                />
              </div>

              {/* Next Steps */}
              <div className="glass rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <h3 className="font-semibold text-foreground mb-4">What's Next?</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link to="/actions" className="block">
                    <div className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-colors group">
                      <div className="flex items-center justify-between mb-2">
                        <Zap className="w-5 h-5 text-primary" />
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h4 className="font-medium text-foreground mb-1">Try a Gasless Action</h4>
                      <p className="text-xs text-muted-foreground">Send an on-chain transaction without paying fees</p>
                    </div>
                  </Link>

                  <Link to="/debug" className="block">
                    <div className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-colors group">
                      <div className="flex items-center justify-between mb-2">
                        <ExternalLink className="w-5 h-5 text-accent" />
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                      </div>
                      <h4 className="font-medium text-foreground mb-1">Explore Debug Panel</h4>
                      <p className="text-xs text-muted-foreground">See how transactions work under the hood</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar: Educational Content */}
            <div className="space-y-6 lg:col-span-2">
              <div className='glass rounded-2xl transition-all duration-300 hover:border-primary/30'>
                <CodeBlock
                  language="jsx"
                  filename="App.tsx"
                  highlightLines={[1, 3, 4, 5, 6, 7, 8, 9, 13, 14, 15, 16, 17, 19]}
                  code={appTsx}
                />
              </div>
              <div className='glass rounded-2xl transition-all duration-300 hover:border-primary/30'>
                <CodeBlock
                  language="jsx"
                  filename="ConnectButton.tsx"
                  highlightLines={[1, 4, 6, 7, 8, 9, 10, 15, 16, 16]}
                  code={connectButtonTsx}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


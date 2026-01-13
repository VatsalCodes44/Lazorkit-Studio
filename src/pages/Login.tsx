import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EducationalCard } from '@/components/EducationalCard';
import { EDUCATIONAL_CONTENT } from '@/lib/debug-utils';
import { Fingerprint, Loader2, Shield, Key, Smartphone, ArrowRight, Wallet } from 'lucide-react';
import { useWallet } from '@lazorkit/wallet';

export default function Login() {
  const navigate = useNavigate();
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.isConnected) {
      navigate('/dashboard');
    }
  }, [wallet.isConnected, navigate]);

  const handleConnect = async () => {
    await wallet.connect();
  };

  return (
    <div className="min-h-screen pt-16 flex items-center">
      <div className=" mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Login Card */}
            <div className="order-1 lg:order-1">
              <div className="glass rounded-3xl p-8 md:p-12 text-center max-w-md mx-auto">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/30 animate-float">
                  <Fingerprint className="w-10 h-10 text-primary-foreground" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-foreground mb-3">
                  Login with Passkey
                </h1>

                {/* Subtitle */}
                <p className="text-muted-foreground mb-8">
                  No wallet. No seed phrase. No extensions.
                  <br />
                  Just your device's biometrics.
                </p>

                {/* Connect Button */}
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  onClick={handleConnect}
                  disabled={wallet.isConnecting}
                >
                  {wallet.isConnecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating your wallet...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-5 h-5" />
                      Continue with FaceID / Passkey
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>

                {/* Loading State Info */}
                {wallet.isConnecting && (
                  <div className="mt-6 p-4 rounded-xl bg-secondary/50 animate-fade-in">
                    <p className="text-sm text-muted-foreground">
                      Creating or restoring your smart wallet on Solana Devnet...
                    </p>
                  </div>
                )}

                {/* Security Note */}
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-success" />
                    Your private keys never leave your device
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Educational Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">How It Works</h2>
                <p className="text-muted-foreground">
                  Understanding the magic behind passkey authentication
                </p>
              </div>

              {/* Visual Flow */}
              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-foreground mb-4">Authentication Flow</h3>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-2">
                      <Smartphone className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">Your Device</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-2">
                      <Key className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-xs text-muted-foreground">Secure Enclave</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center mb-2">
                      <Fingerprint className="w-6 h-6 text-warning" />
                    </div>
                    <span className="text-xs text-muted-foreground">LazorKit</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center mb-2">
                      <Wallet className="w-6 h-6 text-success" />
                    </div>
                    <span className="text-xs text-muted-foreground">Smart Wallet</span>
                  </div>
                </div>
              </div>

              <EducationalCard
                title={EDUCATIONAL_CONTENT.passkey.title}
                points={EDUCATIONAL_CONTENT.passkey.points}
                icon={<Fingerprint className="w-5 h-5 text-primary" />}
              />

              <EducationalCard
                title={EDUCATIONAL_CONTENT.smartWallet.title}
                points={EDUCATIONAL_CONTENT.smartWallet.points}
                icon={<Wallet className="w-5 h-5 text-primary" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Fingerprint, Wallet, Zap, Bug, Shield, ArrowRight, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Fingerprint,
    title: 'Passkey Onboarding',
    description: 'Users authenticate with FaceID, TouchID, or device PIN. No wallet extensions required.',
  },
  {
    icon: Wallet,
    title: 'Smart Wallet Auto-Creation',
    description: 'LazorKit creates and manages on-chain smart wallets automatically for each user.',
  },
  {
    icon: Zap,
    title: 'Gasless Transactions',
    description: 'Paymaster sponsors all transaction fees. Users never need to hold SOL.',
  },
  {
    icon: Bug,
    title: 'Instruction-Level Debugging',
    description: 'See exactly what happens in each transaction with detailed instruction breakdowns.',
  },
];

export default function Index() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(187_94%_43%/0.15),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Developer Playground</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '100ms' }}>
              Build Solana Apps{' '}
              <span className="text-gradient-primary">Without Wallets</span>,{' '}
              <br className="hidden md:block" />
              Seed Phrases, or Gas Fees
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
              LazorKit enables seedless, gasless Solana applications using passkeys.
              This playground demonstrates how it all works under the hood.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <Link to="/login">
                <Button variant="hero" size="xl">
                  <Fingerprint className="w-5 h-5" />
                  Start with Passkey Login
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/debug">
                <Button variant="glass" size="xl">
                  <Bug className="w-5 h-5" />
                  Explore Debug Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What You'll Learn
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              This playground teaches you the core concepts of building with LazorKit
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How LazorKit Works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A simple mental model for understanding the architecture
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="glass rounded-2xl p-8">
              {/* Flow Diagram */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 mb-8">
                {['User', 'Passkey', 'LazorKit', 'Smart Wallet'].map((step, index) => (
                  <div key={step} className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${index === 0 ? 'bg-primary/20' :
                          index === 1 ? 'bg-accent/20' :
                            index === 2 ? 'bg-warning/20' :
                              'bg-success/20'
                        }`}>
                        {index === 0 && <Shield className="w-7 h-7 text-primary" />}
                        {index === 1 && <Fingerprint className="w-7 h-7 text-accent" />}
                        {index === 2 && <Zap className="w-7 h-7 text-warning" />}
                        {index === 3 && <Wallet className="w-7 h-7 text-success" />}
                      </div>
                      <span className="text-sm font-medium text-foreground mt-2">{step}</span>
                    </div>
                    {index < 3 && (
                      <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary text-xs font-bold">1</span>
                  <span><strong className="text-foreground">Passkey</strong> is your cryptographic identity, stored in your device's secure enclave</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary text-xs font-bold">2</span>
                  <span><strong className="text-foreground">LazorKit</strong> links your passkey to an on-chain smart wallet account</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary text-xs font-bold">3</span>
                  <span><strong className="text-foreground">Smart Wallet</strong> holds your assets and executes transactions you sign with your passkey</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary text-xs font-bold">4</span>
                  <span><strong className="text-foreground">Private keys never leave your device</strong> — only signatures are transmitted</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

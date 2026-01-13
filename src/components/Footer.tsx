import { Link } from 'react-router-dom';
import { Fingerprint, Github, Twitter, ExternalLink, Zap, Shield, Cpu } from 'lucide-react';

export function Footer() {
    return (
        <footer className="relative mt-auto  bg-gradient-to-b from-background to-background/80">
            <div className="container mx-auto px-4 py-12 relative">
                <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <p className="text-sm text-muted-foreground">
                            Built using <Link className="text-primary hover:underline" to="https://docs.lazorkit.com/">LazorKit</Link> for <Link className="text-primary hover:underline" to="https://earn.superteam.fun/listing/integrate-passkey-technology-with-lazorkit-to-10x-solana-ux">Superteam Bounty</Link>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/VatsalCodes44/Lazorkit-Playground"
                            className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all hover:scale-105"
                            aria-label="GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all hover:scale-105"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom glow */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </footer>
    );
}

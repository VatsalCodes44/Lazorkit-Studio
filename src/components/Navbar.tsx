import { Link, useLocation } from 'react-router-dom';
import { useWallet } from "@lazorkit/wallet";
import { Button } from '@/components/ui/button';
import { Fingerprint, LayoutDashboard, Zap, Bug, AlertTriangle, LogOut } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/actions', label: 'Actions', icon: Zap },
  { path: '/debug', label: 'Debug', icon: Bug },
  { path: '/simulate-failure', label: 'Failures', icon: AlertTriangle },
];

export function Navbar() {
  const location = useLocation();
  const wallet = useWallet();

  return (
    <nav className="fixed top-0 inset-x-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
              <Fingerprint className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg hidden sm:inline">
              <span className="text-gradient-primary">LazorKit</span>
              <span className="text-foreground pl-2">Studio</span>
            </span>
          </Link>

          {/* Navigation Links */}
          {wallet.isConnected && (
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className={isActive ? 'bg-secondary' : ''}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Wallet Status */}
          <div className="flex items-center gap-3">
            {wallet.isConnected ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-mono text-muted-foreground">
                    {wallet.wallet.smartWallet?.slice(0, 4)}...{wallet.wallet.smartWallet?.slice(-4)}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={wallet.disconnect}>
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Disconnect</span>
                </Button>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

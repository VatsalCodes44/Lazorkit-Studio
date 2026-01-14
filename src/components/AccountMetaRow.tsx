import { Copy, Check, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AccountMeta } from '@/lib/tx-utils';
import { getRoleExplanation } from '@/lib/debug-utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AccountMetaRowProps {
  account: AccountMeta;
}

export function AccountMetaRow({ account }: AccountMetaRowProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(account.pubkey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const roleColors: Record<string, string> = {
    payer: 'bg-success/20 text-success',
    program: 'bg-accent/20 text-accent',
    data: 'bg-warning/20 text-warning',
    system: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
      {/* Role Badge */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'px-2 py-0.5 rounded text-xs font-medium capitalize cursor-help flex items-center gap-1',
            )}
          >
            {account.role}
            <HelpCircle className="w-3 h-3 opacity-50" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs">{getRoleExplanation(account.role)}</p>
        </TooltipContent>
      </Tooltip>

      {/* Address */}
      <div className="flex-1 min-w-0">
        <code className="text-xs font-mono text-muted-foreground truncate block">
          {account.pubkey}
        </code>
      </div>

      {/* Flags */}
      <div className="flex items-center gap-2">
        {account.isSigner && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/20 text-primary">
            SIGNER
          </span>
        )}
        {account.isWritable && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-warning/20 text-warning">
            WRITABLE
          </span>
        )}
      </div>

      {/* Copy Button */}
      <button
        onClick={copyToClipboard}
        className="p-1.5 rounded-md hover:bg-secondary transition-colors"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-success" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

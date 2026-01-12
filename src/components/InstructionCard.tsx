import { useState } from 'react';
import { ChevronDown, ChevronUp, Code, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Instruction } from '@/lib/tx-utils';
import { getInstructionExplanation } from '@/lib/debug-utils';
import { AccountMetaRow } from './AccountMetaRow';

interface InstructionCardProps {
  instruction: Instruction;
  index: number;
}

export function InstructionCard({ instruction, index }: InstructionCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="glass rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Code className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <h4 className="font-medium text-foreground">
              Instruction #{index + 1}: {instruction.programName}
            </h4>
            <p className="text-xs font-mono text-muted-foreground">
              {instruction.programId.slice(0, 8)}...{instruction.programId.slice(-8)}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Explanation */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              {getInstructionExplanation(instruction.programName)}
            </p>
          </div>

          {/* Accounts */}
          <div>
            <h5 className="text-sm font-medium text-muted-foreground mb-2">Accounts ({instruction.accounts.length})</h5>
            <div className="space-y-2">
              {instruction.accounts.map((account, i) => (
                <AccountMetaRow key={i} account={account} />
              ))}
            </div>
          </div>

          {/* Data */}
          <div>
            <h5 className="text-sm font-medium text-muted-foreground mb-2">Instruction Data</h5>
            <div className="p-3 rounded-lg bg-secondary/50">
              <code className="text-xs font-mono text-foreground break-all">
                {instruction.data}
              </code>
              {instruction.dataDecoded && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Decoded: "{instruction.dataDecoded}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

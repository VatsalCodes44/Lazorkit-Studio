import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface EducationalCardProps {
  title: string;
  points: string[];
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight';
}

export function EducationalCard({ title, points, icon, className, variant = 'default' }: EducationalCardProps) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-6 transition-all duration-300 hover:border-primary/30',
        variant === 'highlight' && 'border-l-4 border-l-primary',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            {icon}
          </div>
        )}
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <ul className="space-y-3">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

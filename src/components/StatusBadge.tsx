import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'success' | 'error' | 'pending' | 'info' | 'warning';
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const statusStyles = {
    success: 'bg-success/20 text-success border-success/30',
    error: 'bg-destructive/20 text-destructive border-destructive/30',
    pending: 'bg-warning/20 text-warning border-warning/30',
    info: 'bg-primary/20 text-primary border-primary/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        statusStyles[status],
        className
      )}
    >
      <span
        className={cn('w-1.5 h-1.5 rounded-full', {
          'bg-success': status === 'success',
          'bg-destructive': status === 'error',
          'bg-warning animate-pulse': status === 'pending',
          'bg-primary': status === 'info',
        })}
      />
      {children}
    </span>
  );
}

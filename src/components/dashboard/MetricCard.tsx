import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  className?: string;
}

export function MetricCard({ label, value, change, trend, icon: Icon, className }: MetricCardProps) {
  return (
    <div className={cn("metric-card animate-fade-in", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      
      {change !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          {trend === 'up' && (
            <span className="flex items-center text-sm text-success">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{change}
            </span>
          )}
          {trend === 'down' && (
            <span className="flex items-center text-sm text-destructive">
              <TrendingDown className="h-4 w-4 mr-1" />
              {change}
            </span>
          )}
          {trend === 'neutral' && (
            <span className="flex items-center text-sm text-muted-foreground">
              <Minus className="h-4 w-4 mr-1" />
              No change
            </span>
          )}
          <span className="text-sm text-muted-foreground">from last week</span>
        </div>
      )}
    </div>
  );
}

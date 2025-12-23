import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from './ui/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
  valuePrefix?: string;
  formatValue?: boolean;
}

export function KPICard({
  title,
  value,
  change,
  trend,
  icon,
  subtitle,
  onClick,
  className,
  valuePrefix = '₹',
  formatValue = true,
}: KPICardProps) {
  const formatNumber = (num: number | string) => {
    if (!formatValue) return num;
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (numValue >= 10000000) {
      return `${(numValue / 10000000).toFixed(2)}Cr`;
    } else if (numValue >= 100000) {
      return `${(numValue / 100000).toFixed(2)}L`;
    } else if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(1)}K`;
    }
    return numValue.toLocaleString('en-IN');
  };

  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground';
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (!change) return null;
    if (trend === 'up') return <ArrowUp className="w-4 h-4" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4" />;
    return <TrendingUp className="w-4 h-4" />;
  };

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        onClick && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            {valuePrefix && typeof value === 'number' && (
              <span className="text-xl">{valuePrefix}</span>
            )}
            <p className="text-2xl tracking-tight">
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>
          </div>
          {(change !== undefined || subtitle) && (
            <div className="flex items-center gap-2 text-xs">
              {change !== undefined && (
                <span className={cn('flex items-center gap-1', getTrendColor())}>
                  {getTrendIcon()}
                  <span>
                    {change > 0 ? '+' : ''}
                    {change.toFixed(1)}%
                  </span>
                </span>
              )}
              {subtitle && (
                <span className="text-muted-foreground">{subtitle}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

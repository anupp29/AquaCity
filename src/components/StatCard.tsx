import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent' | 'warning' | 'danger';
}

export const StatCard = ({ title, value, icon: Icon, description, trend, variant = 'default' }: StatCardProps) => {
  const variantClasses = {
    default: 'bg-card',
    primary: 'bg-gradient-water text-white',
    accent: 'bg-gradient-to-br from-accent to-accent/80 text-white',
    warning: 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
  };

  const iconBgClasses = {
    default: 'bg-primary/10 text-primary',
    primary: 'bg-white/20 text-white',
    accent: 'bg-white/20 text-white',
    warning: 'bg-white/20 text-white',
    danger: 'bg-white/20 text-white',
  };

  return (
    <Card className={`p-6 shadow-card hover:shadow-elevated transition-all duration-300 ${variantClasses[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={`text-sm font-medium ${variant === 'default' ? 'text-muted-foreground' : 'text-white/90'}`}>
            {title}
          </p>
          <p className="text-3xl font-bold">{value}</p>
          {description && (
            <p className={`text-sm ${variant === 'default' ? 'text-muted-foreground' : 'text-white/80'}`}>
              {description}
            </p>
          )}
          {trend && (
            <p className={`text-xs font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${iconBgClasses[variant]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

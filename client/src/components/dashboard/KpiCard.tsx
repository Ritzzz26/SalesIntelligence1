import { cn } from '@/lib/utils';
import { DollarSign, CheckSquare, UserPlus, Percent } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: 'dollar' | 'check' | 'user' | 'percent';
  change: number;
  colorClass: 'primary' | 'success' | 'secondary' | 'accent' | 'warning' | 'danger';
  className?: string;
}

const iconMap = {
  dollar: DollarSign,
  check: CheckSquare,
  user: UserPlus,
  percent: Percent
};

const colorMap = {
  primary: {
    bgColor: 'bg-primary-100', 
    textColor: 'text-primary-500'
  },
  success: {
    bgColor: 'bg-green-100', 
    textColor: 'text-green-500'
  },
  secondary: {
    bgColor: 'bg-indigo-100', 
    textColor: 'text-indigo-500'
  },
  accent: {
    bgColor: 'bg-purple-100', 
    textColor: 'text-purple-500'
  },
  warning: {
    bgColor: 'bg-amber-100', 
    textColor: 'text-amber-500'
  },
  danger: {
    bgColor: 'bg-red-100', 
    textColor: 'text-red-500'
  }
};

const KpiCard = ({ title, value, icon, change, colorClass, className }: KpiCardProps) => {
  const Icon = iconMap[icon];
  const { bgColor, textColor } = colorMap[colorClass];
  const isPositive = change >= 0;

  return (
    <div className={cn("bg-white p-5 rounded-lg border border-gray-200", className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", bgColor, textColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-center">
        <span 
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
            isPositive 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          )}
        >
          {isPositive ? (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3 w-3 mr-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M12 7a1 1 0 01-1 1H9a1 1 0 01-1-1V6a1 1 0 011-1h2a1 1 0 011 1v1zm-6 6a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 00-1-1H7a1 1 0 00-1 1v1zm9-5a1 1 0 00-1 1v1a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1-1h-2z" 
                clipRule="evenodd" 
              />
            </svg>
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3 w-3 mr-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M12 13a1 1 0 01-1 1H9a1 1 0 01-1-1v-1a1 1 0 011-1h2a1 1 0 011 1v1zm-6-6a1 1 0 001 1h2a1 1 0 001-1V6a1 1 0 00-1-1H7a1 1 0 00-1 1v1zm9 4a1 1 0 00-1 1v1a1 1 0 001 1h2a1 1 0 001-1v-1a1 1 0 00-1-1h-2z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
          {isPositive ? '+' : ''}{Math.abs(change).toFixed(1)}%
        </span>
        <span className="text-xs text-gray-500 ml-2">vs last period</span>
      </div>
    </div>
  );
};

export default KpiCard;

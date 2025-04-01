import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DealCardProps {
  deal: any;
  users?: any[];
  className?: string;
}

const DealCard = ({ deal, users = [], className }: DealCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return '1d ago';
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
      return format(date, 'MMM d');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getAssignedUser = () => {
    if (!deal.assignedUserId) return null;
    return users.find(user => user.id === deal.assignedUserId);
  };

  const assignedUser = getAssignedUser();
  const lastUpdated = formatTimeAgo(deal.lastUpdatedAt);
  const probabilityClass = 
    deal.probability >= 80 ? "text-green-600" :
    deal.probability >= 50 ? "text-amber-600" :
    "text-red-600";

  return (
    <div className={cn(
      "bg-white p-3 rounded-md border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow",
      className
    )}>
      <h5 className="font-medium text-gray-800 mb-1 line-clamp-1" title={deal.name}>
        {deal.name}
      </h5>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-500">{formatCurrency(deal.value)}</span>
        <span className={cn("font-medium", probabilityClass)}>
          {deal.stage === 'Closed Won' ? 'Won' : `${deal.probability}%`}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {assignedUser ? (
            <>
              <span 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                  deal.assignedUserId % 4 === 0 ? "bg-purple-200 text-purple-700" :
                  deal.assignedUserId % 4 === 1 ? "bg-blue-200 text-blue-700" :
                  deal.assignedUserId % 4 === 2 ? "bg-green-200 text-green-700" :
                  "bg-red-200 text-red-700"
                )}
              >
                {assignedUser.avatar}
              </span>
              <span className="text-xs text-gray-500 ml-1">{assignedUser.fullName}</span>
            </>
          ) : (
            <span className="text-xs text-gray-500">Unassigned</span>
          )}
        </div>
        <span className="text-xs text-gray-400">{lastUpdated}</span>
      </div>
    </div>
  );
};

export default DealCard;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface TeamPerformanceProps {
  data: any;
  className?: string;
}

const TeamPerformance = ({ data, className }: TeamPerformanceProps) => {
  if (!data || !data.metadata || !data.metadata.teamMembers) {
    return <TeamPerformanceSkeleton className={className} />;
  }
  
  const { teamMembers } = data.metadata;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold text-gray-800">Team Performance</CardTitle>
          <button className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {teamMembers.map((member: any, index: number) => {
            const isOverTarget = member.percentOfTarget >= 100;
            const progressColor = member.percentOfTarget >= 100 
              ? 'bg-primary-500'
              : member.percentOfTarget >= 90
                ? 'bg-amber-500'
                : 'bg-red-500';
            
            return (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <div className="flex items-center">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2",
                      index === 0 ? "bg-purple-200 text-purple-700" :
                      index === 1 ? "bg-blue-200 text-blue-700" :
                      index === 2 ? "bg-green-200 text-green-700" :
                      "bg-red-200 text-red-700"
                    )}>
                      {member.avatar}
                    </span>
                    <span className="font-medium">{member.name}</span>
                  </div>
                  <span className="font-semibold">${member.revenue.toLocaleString()}</span>
                </div>
                <Progress value={member.percentOfTarget} max={120} className={cn("h-2 bg-gray-200")} indicatorClassName={progressColor} />
                <div className="flex justify-between text-xs mt-1">
                  <span className={cn(
                    "font-medium",
                    isOverTarget ? "text-green-500" : member.percentOfTarget >= 90 ? "text-amber-500" : "text-red-500"
                  )}>
                    {isOverTarget ? '+' : ''}{member.percentOfTarget - 100}% vs target
                  </span>
                  <span className="text-gray-500">{member.deals} deals</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const TeamPerformanceSkeleton = ({ className }: { className?: string }) => (
  <Card className={className}>
    <CardHeader className="pb-3 border-b border-gray-100">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <Skeleton className="w-6 h-6 rounded-full mr-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-2 w-full mb-1" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default TeamPerformance;

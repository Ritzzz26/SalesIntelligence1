import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface LeadAnalysisProps {
  data: any;
  className?: string;
}

const LeadAnalysis = ({ data, className }: LeadAnalysisProps) => {
  if (!data || !data.metadata) {
    return <LeadAnalysisSkeleton className={className} />;
  }
  
  const { website, socialMedia, referral, outbound } = data.metadata;
  
  const chartData = [
    { name: 'Website', value: website },
    { name: 'Social Media', value: socialMedia },
    { name: 'Referral', value: referral },
    { name: 'Outbound', value: outbound }
  ];
  
  const COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b'];
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold text-gray-800">Lead Analysis</CardTitle>
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
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, 'Percentage']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                <div 
                  className={cn("w-3 h-3 rounded-full mr-2")} 
                  style={{ backgroundColor: COLORS[index] }}
                ></div>
                <span className="text-sm">{item.name}</span>
              </div>
              <div className="text-sm font-medium">{item.value}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const LeadAnalysisSkeleton = ({ className }: { className?: string }) => (
  <Card className={className}>
    <CardHeader className="pb-3 border-b border-gray-100">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="flex justify-center items-center h-[200px]">
        <Skeleton className="h-40 w-40 rounded-full" />
      </div>
      
      <div className="mt-4 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center">
              <Skeleton className="w-3 h-3 rounded-full mr-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-10" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default LeadAnalysis;

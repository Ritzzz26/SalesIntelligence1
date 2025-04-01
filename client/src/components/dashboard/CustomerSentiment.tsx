import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { MessageSquare, AlertCircle } from 'lucide-react';

interface CustomerSentimentProps {
  data: any;
  className?: string;
}

const CustomerSentiment = ({ data, className }: CustomerSentimentProps) => {
  if (!data || !data.metadata) {
    return <CustomerSentimentSkeleton className={className} />;
  }

  const { promoters, neutral, detractors, positiveThemes, improvementAreas } = data.metadata;
  const npsScore = data.metricValue;

  return (
    <Card className={className}>
      <CardHeader className="pb-3 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold text-gray-800">Customer Sentiment</CardTitle>
          <div className="flex items-center text-xs text-purple-500 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            AI Analysis
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 rounded-full border-8 border-green-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{npsScore}</div>
              <div className="text-sm text-gray-500">NPS Score</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-green-50 p-3 rounded-md text-center">
            <div className="text-lg font-bold text-green-700">{promoters}%</div>
            <div className="text-xs text-green-800">Promoters</div>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-md text-center">
            <div className="text-lg font-bold text-amber-700">{neutral}%</div>
            <div className="text-xs text-amber-800">Neutral</div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-md text-center">
            <div className="text-lg font-bold text-red-700">{detractors}%</div>
            <div className="text-xs text-red-800">Detractors</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 mr-2">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Top positive themes</p>
                  <p className="text-xs text-gray-500">From 128 conversations</p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {positiveThemes.map((theme: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  {theme}
                </span>
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mr-2">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Areas for improvement</p>
                  <p className="text-xs text-gray-500">From 45 conversations</p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {improvementAreas.map((area: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CustomerSentimentSkeleton = ({ className }: { className?: string }) => (
  <Card className={className}>
    <CardHeader className="pb-3 border-b border-gray-100">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="flex justify-center mb-4">
        <Skeleton className="w-32 h-32 rounded-full" />
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-3 rounded-md">
            <Skeleton className="h-6 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
      
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-md">
            <div className="flex items-start">
              <Skeleton className="w-8 h-8 rounded-full mr-2" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default CustomerSentiment;

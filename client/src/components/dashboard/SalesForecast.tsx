import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, ArrowUpCircle, Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const SalesForecast = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/forecasting'],
  });

  if (isLoading) {
    return <SalesForecastSkeleton />;
  }

  // Display a placeholder card when forecast data is not available
  // This handles both error cases and missing data
  if (error || !data || !data.forecasts || data.forecasts.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-semibold text-gray-800">Sales Forecast</CardTitle>
            <div className="flex items-center text-xs text-purple-500 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              AI Powered
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-500">Forecast data unavailable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use the first forecast as the current quarter forecast
  const forecast = data.forecasts?.[0] || {};
  
  // Add additional null checks for metadata properties
  const metadata = forecast.metadata || {};
  const currentProgress = metadata.currentProgress || 0;
  const percentAchieved = metadata.percentAchieved || 0;
  const predictions = metadata.predictions || [];

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold text-gray-800">Sales Forecast</CardTitle>
          <div className="flex items-center text-xs text-purple-500 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            AI Powered
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-500">Q3 Target</span>
              <span className="font-semibold">${(forecast.forecastValue || 0).toLocaleString()}</span>
            </div>
            <Progress value={percentAchieved} className="h-2.5" />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-500">Current: ${currentProgress.toLocaleString()}</span>
              <span className="text-green-500 font-medium">{percentAchieved}% achieved</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-500">Forecast Accuracy</span>
              <span className="font-semibold">{Math.round((forecast.confidence || 0) * 100)}%</span>
            </div>
            <Progress value={(forecast.confidence || 0) * 100} className="h-2.5 bg-gray-200" indicatorClassName="bg-green-500" />
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-sm font-medium mb-3">AI Predictions</h4>
            
            <div className="space-y-3">
              {predictions.map((prediction: any, index: number) => {
                let Icon;
                let bgColor;
                let textColor;
                
                if (prediction.type === 'deal') {
                  Icon = ArrowUpCircle;
                  bgColor = 'bg-green-100';
                  textColor = 'text-green-500';
                } else if (prediction.type === 'risk') {
                  Icon = AlertCircle;
                  bgColor = 'bg-amber-100';
                  textColor = 'text-amber-500';
                } else {
                  Icon = Lightbulb;
                  bgColor = 'bg-primary-100';
                  textColor = 'text-primary-500';
                }
                
                return (
                  <div key={index} className="flex items-start">
                    <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center ${textColor} mr-3 flex-shrink-0`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{prediction.description}</p>
                      <p className="text-xs text-gray-500">
                        {prediction.value && `$${prediction.value.toLocaleString()}`}
                        {prediction.probability && ` · ${Math.round(prediction.probability * 100)}% probability`}
                        {prediction.detail && ` · ${prediction.detail}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SalesForecastSkeleton = () => (
  <Card>
    <CardHeader className="pb-3 border-b border-gray-100">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2.5 w-full mb-1" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2.5 w-full" />
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <Skeleton className="h-4 w-28 mb-3" />
          
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start">
                <Skeleton className="w-8 h-8 rounded-full mr-3 flex-shrink-0" />
                <div className="w-full">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default SalesForecast;

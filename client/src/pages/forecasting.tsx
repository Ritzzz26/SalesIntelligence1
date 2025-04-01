import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { format } from 'date-fns';
import { BrainCircuit, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';

const predictionFormSchema = z.object({
  dealId: z.string().optional(),
  customInput: z.string().min(5, { message: "Please provide more context for the prediction" }).max(500),
});

const Forecasting = () => {
  const [aiResponse, setAIResponse] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: forecastData, isLoading: forecastLoading } = useQuery({
    queryKey: ['/api/forecasting'],
  });

  const { data: deals, isLoading: dealsLoading } = useQuery({
    queryKey: ['/api/deals'],
  });

  const form = useForm<z.infer<typeof predictionFormSchema>>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      customInput: '',
    },
  });

  const predictionMutation = useMutation({
    mutationFn: async (values: z.infer<typeof predictionFormSchema>) => {
      setIsSubmitting(true);
      const formattedValues = {
        dealId: values.dealId ? parseInt(values.dealId, 10) : undefined,
        customInput: values.customInput,
      };
      
      const response = await apiRequest('POST', '/api/forecasting/predict', formattedValues);
      return response.json();
    },
    onSuccess: (data) => {
      setAIResponse(data);
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Prediction failed:', error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: z.infer<typeof predictionFormSchema>) => {
    predictionMutation.mutate(values);
  };

  // Format the monthly forecast data
  const formatMonthlyForecastData = () => {
    if (!forecastData || !forecastData.monthly) return [];
    
    return forecastData.monthly.map((forecast: any) => {
      const startDate = new Date(forecast.periodStart);
      const monthName = format(startDate, 'MMM yyyy');
      
      return {
        name: monthName,
        value: forecast.forecastValue,
        confidence: Math.round(forecast.confidence * 100),
        deals: forecast.metadata.deals,
        avgDealSize: forecast.metadata.avgDealSize,
      };
    });
  };

  const monthlyForecastData = formatMonthlyForecastData();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Sales Forecasting</h1>
        <div className="flex items-center text-sm text-purple-600 font-medium">
          <BrainCircuit className="mr-2 h-5 w-5" />
          AI-Powered Forecasting
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecast</CardTitle>
              <CardDescription>
                Projected revenue based on pipeline and historical performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {forecastLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyForecastData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${value / 1000}k`}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => {
                          if (name === 'value') return [`$${value.toLocaleString()}`, 'Forecast'];
                          return [value, name];
                        }}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        name="Revenue" 
                        stroke="#8b5cf6" 
                        fill="#8b5cf6" 
                        fillOpacity={0.2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {forecastLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-6 w-24 mb-1" />
                <Skeleton className="h-2 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-4" />
                
                <Skeleton className="h-6 w-28 mb-1" />
                <Skeleton className="h-2 w-full mb-4" />
                
                <Skeleton className="h-5 w-32 mb-3" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start mb-3">
                    <Skeleton className="h-8 w-8 rounded-full mr-3 flex-shrink-0" />
                    <div className="w-full">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : forecastData?.currentQuarter ? (
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Goal Progress</CardTitle>
                <CardDescription>
                  Track progress towards Q3 revenue target
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-500">Q3 Target</span>
                    <span className="font-semibold">${(forecastData.currentQuarter.forecastValue || 0).toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(forecastData.currentQuarter.metadata?.percentAchieved || 0)} 
                    className="h-2.5" 
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-500">
                      Current: ${(forecastData.currentQuarter.metadata?.currentProgress || 0).toLocaleString()}
                    </span>
                    <span className="text-green-500 font-medium">
                      {(forecastData.currentQuarter.metadata?.percentAchieved || 0)}% achieved
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-500">Forecast Accuracy</span>
                    <span className="font-semibold">
                      {Math.round((forecastData.currentQuarter.confidence || 0) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(forecastData.currentQuarter.confidence || 0) * 100} 
                    className="h-2.5 bg-gray-200" 
                    indicatorClassName="bg-green-500" 
                  />
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <h4 className="text-sm font-medium mb-3">AI Predictions</h4>
                  
                  <div className="space-y-3">
                    {(forecastData.currentQuarter.metadata?.predictions || []).map((prediction: any, index: number) => {
                      let icon;
                      let bgColor;
                      let textColor;
                      
                      if (prediction.type === 'deal') {
                        icon = <ThumbsUp className="h-4 w-4" />;
                        bgColor = 'bg-green-100';
                        textColor = 'text-green-500';
                      } else if (prediction.type === 'risk') {
                        icon = <ThumbsDown className="h-4 w-4" />;
                        bgColor = 'bg-amber-100';
                        textColor = 'text-amber-500';
                      } else {
                        icon = <BrainCircuit className="h-4 w-4" />;
                        bgColor = 'bg-primary-100';
                        textColor = 'text-primary-500';
                      }
                      
                      return (
                        <div key={index} className="flex items-start">
                          <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center ${textColor} mr-3 flex-shrink-0`}>
                            {icon}
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
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-6">
                <div className="text-center">
                  <p className="text-gray-500">No quarterly forecast data available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>AI Deal Analyzer</CardTitle>
              <CardDescription>
                Get insights and predictions on specific deals or sales scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="dealId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select a Deal (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a deal to analyze" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No specific deal</SelectItem>
                            {!dealsLoading && deals?.map((deal: any) => (
                              <SelectItem key={deal.id} value={deal.id.toString()}>
                                {deal.name} (${deal.value.toLocaleString()})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customInput"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          What would you like to analyze?
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the sales scenario or ask questions about the deal..."
                            className="min-h-24 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        Generate AI Prediction
                      </>
                    )}
                  </Button>
                </form>
              </Form>
              
              {aiResponse && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">AI Analysis Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500 mb-1">Probability of Success</div>
                      <div className="flex items-center">
                        <div className="text-2xl font-bold mr-2">
                          {Math.round(aiResponse.probability * 100)}%
                        </div>
                        <Progress 
                          value={aiResponse.probability * 100} 
                          className="h-2 flex-1" 
                          indicatorClassName={
                            aiResponse.probability >= 0.7 ? "bg-green-500" :
                            aiResponse.probability >= 0.4 ? "bg-amber-500" :
                            "bg-red-500"
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500 mb-1">Predicted Close Date</div>
                      <div className="text-2xl font-bold">
                        {format(new Date(aiResponse.predictedCloseDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">Recommendation</div>
                    <p className="text-gray-800">{aiResponse.recommendation}</p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">Contributing Factors</div>
                    <div className="space-y-2">
                      {aiResponse.factors.map((factor: any, index: number) => (
                        <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                          <div className={`w-2 h-6 rounded-sm mr-3 ${
                            factor.impact === 'positive' ? 'bg-green-500' :
                            factor.impact === 'negative' ? 'bg-red-500' :
                            'bg-gray-400'
                          }`}></div>
                          <div>
                            <div className="font-medium">{factor.name}</div>
                            <div className="text-xs text-gray-500">
                              Impact: 
                              <span className={
                                factor.impact === 'positive' ? 'text-green-600' :
                                factor.impact === 'negative' ? 'text-red-600' :
                                'text-gray-600'
                              }>
                                {' '}{factor.impact.charAt(0).toUpperCase() + factor.impact.slice(1)}
                              </span>
                              {' · '}Weight: {Math.round(factor.weight * 10)}/10
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Forecast Metrics</CardTitle>
              <CardDescription>
                Key metrics for upcoming sales periods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {forecastLoading ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-28" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {monthlyForecastData.slice(0, 3).map((forecast, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="font-medium text-gray-700">{forecast.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold">${(forecast.value || 0).toLocaleString()}</div>
                        <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          {forecast.confidence || 0}% confidence
                        </div>
                      </div>
                      <Progress
                        value={forecast.confidence || 0}
                        className="h-1.5"
                        indicatorClassName="bg-purple-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Expected deals: {forecast.deals || 0}</span>
                        <span>Avg deal: ${(forecast.avgDealSize || 0).toLocaleString()}</span>
                      </div>
                      {index < 2 && <Separator className="my-2" />}
                    </div>
                  ))}
                </>
              )}
            </CardContent>
            <CardFooter className="bg-gray-50 border-t rounded-b-lg">
              <div className="w-full text-xs text-gray-500 flex justify-between items-center">
                <div className="flex items-center">
                  <BrainCircuit className="h-3 w-3 mr-1" />
                  <span>AI confidence score</span>
                </div>
                <span>Updated {format(new Date(), 'MMM d, yyyy')}</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;

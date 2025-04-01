import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PipelineManagement from '@/components/dashboard/PipelineManagement';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

const Pipeline = () => {
  const [activeTab, setActiveTab] = useState('pipeline');

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/analytics/dashboard'],
  });

  const { data: deals, isLoading: dealsLoading } = useQuery({
    queryKey: ['/api/deals'],
  });

  // Prepare data for pipeline value by stage
  const preparePipelineData = () => {
    if (!deals) return [];

    const stages = ['Qualified Lead', 'Product Demo', 'Proposal', 'Negotiation', 'Closed Won'];
    const stageValues = stages.map(stage => {
      const stageDeals = deals.filter((deal: any) => deal.stage === stage);
      const totalValue = stageDeals.reduce((sum: number, deal: any) => sum + deal.value, 0);
      const count = stageDeals.length;
      
      return {
        name: stage,
        value: totalValue,
        count,
        avg: count > 0 ? Math.round(totalValue / count) : 0
      };
    });

    return stageValues;
  };

  // Prepare conversion data
  const prepareConversionData = () => {
    if (!deals) return [];

    const totalDeals = deals.length;
    if (totalDeals === 0) return [];

    const stages = ['Qualified Lead', 'Product Demo', 'Proposal', 'Negotiation', 'Closed Won'];
    
    const stageData = stages.map(stage => {
      const count = deals.filter((deal: any) => deal.stage === stage).length;
      return {
        name: stage,
        value: Math.round((count / totalDeals) * 100)
      };
    });

    return stageData;
  };

  // Prepare projected revenue data by month
  const prepareProjectedRevenueData = () => {
    if (!deals) return [];

    // Get the next 6 months
    const months = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push({
        month,
        name: month.toLocaleString('default', { month: 'short' }),
        year: month.getFullYear()
      });
    }

    return months.map(({ month, name, year }) => {
      // Get deals expected to close in this month, considering probability
      const monthDeals = deals.filter((deal: any) => {
        if (!deal.expectedCloseDate) return false;
        const closeDate = new Date(deal.expectedCloseDate);
        return closeDate.getMonth() === month.getMonth() && 
               closeDate.getFullYear() === month.getFullYear();
      });

      const totalValue = monthDeals.reduce((sum: number, deal: any) => {
        return sum + (deal.value * (deal.probability / 100));
      }, 0);
      
      const worstCase = totalValue * 0.7;
      const bestCase = totalValue * 1.3;

      return {
        name: `${name} ${year !== now.getFullYear() ? year : ''}`,
        projected: Math.round(totalValue),
        worstCase: Math.round(worstCase),
        bestCase: Math.round(bestCase),
      };
    });
  };

  const pipelineData = preparePipelineData();
  const conversionData = prepareConversionData();
  const projectedRevenueData = prepareProjectedRevenueData();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Pipeline Management</h1>
      </div>

      <Tabs defaultValue="pipeline" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-gray-100">
          <TabsTrigger value="pipeline">Kanban Pipeline</TabsTrigger>
          <TabsTrigger value="analytics">Pipeline Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pipeline" className="mt-0">
          <PipelineManagement />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Value by Stage</CardTitle>
                <CardDescription>Total value of deals in each pipeline stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {dealsLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Skeleton className="h-[250px] w-full" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pipelineData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis 
                          tickFormatter={(value) => `$${value / 1000}k`}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                          labelStyle={{ color: '#374151' }}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem'
                          }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Stage Conversion</CardTitle>
                <CardDescription>Percentage of deals in each pipeline stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {dealsLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Skeleton className="h-[250px] w-full" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={conversionData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis 
                          tickFormatter={(value) => `${value}%`}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${value}%`, 'Percentage']}
                          labelStyle={{ color: '#374151' }}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Projected Revenue (Next 6 Months)</CardTitle>
              <CardDescription>Based on weighted pipeline values and probability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {dealsLoading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectedRevenueData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
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
                        formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="worstCase" 
                        name="Worst Case" 
                        fill="#ef4444" 
                        stackId="a" 
                        fillOpacity={0.4}
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar 
                        dataKey="projected" 
                        name="Projected" 
                        fill="#3b82f6" 
                        stackId="a" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="bestCase" 
                        name="Best Case" 
                        fill="#10b981" 
                        stackId="a" 
                        fillOpacity={0.4}
                        radius={[0, 0, 0,, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pipeline;

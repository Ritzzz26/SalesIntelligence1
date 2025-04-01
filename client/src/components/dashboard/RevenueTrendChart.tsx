import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface RevenueTrendChartProps {
  data: any;
  className?: string;
}

const RevenueTrendChart = ({ data, className }: RevenueTrendChartProps) => {
  const chartData = data ? prepareChartData(data) : [];

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold text-gray-800">Revenue Trend</CardTitle>
          <div className="flex space-x-2">
            <button className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">Export</button>
            <button className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center mt-2 text-sm">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 rounded-full bg-primary-500 mr-1"></div>
            <span>Actual</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
            <span>Previous</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
            <span className="flex items-center">AI Forecast <span className="ml-1 px-1 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">AI</span></span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={{ r: 0 }}
                isAnimationActive={true}
                fill="url(#colorActual)"
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#d1d5db"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 0 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={{ r: 0 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Transform data for the chart
function prepareChartData(data: any) {
  if (!data || !data.metadata || !data.metadata.months) {
    return [];
  }

  const { months, currentPeriod, previousPeriod } = data.metadata;
  
  // Add forecast data for the last months
  const forecastValues = [null, null, null, null, null, null, null, 58000, 65000, 72000, 78000];
  
  return months.map((month: string, index: number) => ({
    name: month,
    actual: currentPeriod[index] || null,
    previous: previousPeriod[index] || null,
    forecast: forecastValues[index] || null
  }));
}

export default RevenueTrendChart;

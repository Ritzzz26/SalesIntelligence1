import { useQuery } from '@tanstack/react-query';
import KpiCard from './KpiCard';
import RevenueTrendChart from './RevenueTrendChart';
import SalesForecast from './SalesForecast';
import PipelineManagement from './PipelineManagement';
import LeadAnalysis from './LeadAnalysis';
import TeamPerformance from './TeamPerformance';
import CustomerSentiment from './CustomerSentiment';
import { Skeleton } from '@/components/ui/skeleton';

const AnalyticsDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/analytics/dashboard'],
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-red-600">Error loading dashboard</h3>
        <p className="text-gray-600 mt-2">Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  // Check the structure of data to prevent errors
  // The database structure might be different than what the component expects
  return (
    <div className="p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {data.kpi?.revenue && (
          <KpiCard
            title="Total Revenue"
            value={`$${data.kpi.revenue.metricValue.toLocaleString()}`}
            icon="dollar"
            change={data.kpi.revenue.metadata?.percentChange || 0}
            colorClass="primary"
          />
        )}
        
        {/* Fallback cards for data that might not be available yet */}
        <KpiCard
          title="Deals Won"
          value={data.kpi?.dealsWon?.metricValue || "0"}
          icon="check"
          change={data.kpi?.dealsWon?.metadata?.percentChange || 0}
          colorClass="success"
        />
        
        <KpiCard
          title="New Leads"
          value={data.kpi?.newLeads?.metricValue || "0"}
          icon="user"
          change={data.kpi?.newLeads?.metadata?.percentChange || 0}
          colorClass="secondary"
        />
        
        <KpiCard
          title="Conversion Rate"
          value={data.kpi?.conversionRate?.metricValue ? `${data.kpi.conversionRate.metricValue}%` : "0%"}
          icon="percent"
          change={data.kpi?.conversionRate?.metadata?.percentChange || 0}
          colorClass="accent"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {data.revenueTrend ? (
          <RevenueTrendChart 
            data={data.revenueTrend} 
            className="col-span-2"
          />
        ) : (
          <div className="bg-white p-5 rounded-lg border border-gray-200 col-span-2">
            <h3 className="text-lg font-medium mb-4">Revenue Trend</h3>
            <p className="text-gray-500">No revenue trend data available.</p>
          </div>
        )}
        <SalesForecast />
      </div>

      {/* Pipeline */}
      <PipelineManagement className="mb-6" />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LeadAnalysis data={data.leadSources || {}} />
        <TeamPerformance data={data.teamPerformance || {}} />
        <CustomerSentiment data={data.customerSentiment || {}} />
      </div>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="p-6">
    {/* KPI Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>

    {/* Charts Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-lg border border-gray-200 col-span-2">
        <div className="p-5 border-b border-gray-100">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-5">
          <Skeleton className="h-[250px] w-full" />
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-5">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-2 w-full mb-4" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-2 w-full mb-6" />
          
          <Skeleton className="h-4 w-32 mb-3" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start mb-3">
              <Skeleton className="h-8 w-8 rounded-full mr-3 flex-shrink-0" />
              <div className="w-full">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Pipeline Skeleton */}
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      <div className="p-5 border-b border-gray-100">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="p-5 overflow-x-auto">
        <div className="flex space-x-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="min-w-[300px] bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-6 rounded-full" />
              </div>
              
              {[...Array(2)].map((_, j) => (
                <div key={j} className="bg-white p-3 rounded-md border border-gray-200 mb-3">
                  <Skeleton className="h-5 w-full mb-1" />
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-3 w-16 ml-1" />
                    </div>
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom Section Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-5">
            <Skeleton className="h-[200px] w-full mb-4" />
            <div className="space-y-3">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Skeleton className="h-3 w-3 rounded-full mr-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AnalyticsDashboard;

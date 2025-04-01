import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import CreateDealDialog from '../deals/CreateDealDialog';
import DealCard from '../deals/DealCard';

interface PipelineManagementProps {
  className?: string;
}

const PipelineManagement = ({ className }: PipelineManagementProps) => {
  const [openCreateDeal, setOpenCreateDeal] = useState(false);
  
  const { data: deals, isLoading, error } = useQuery({
    queryKey: ['/api/deals'],
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
  });

  if (isLoading) {
    return <PipelineSkeleton className={className} />;
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-semibold text-gray-800">Pipeline Management</CardTitle>
            <div>
              <Button size="sm" variant="outline" onClick={() => setOpenCreateDeal(true)}>
                <Plus className="mr-1 h-4 w-4" />
                New Deal
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Failed to load pipeline data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pipelineStages = [
    'Qualified Lead',
    'Product Demo',
    'Proposal',
    'Negotiation',
    'Closed Won'
  ];

  // Group deals by stage
  const dealsByStage = pipelineStages.reduce((acc, stage) => {
    acc[stage] = deals.filter((deal: any) => deal.stage === stage);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      <Card className={className}>
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-semibold text-gray-800">Pipeline Management</CardTitle>
            <div className="flex space-x-2">
              <Button size="sm" onClick={() => setOpenCreateDeal(true)}>
                <Plus className="mr-1 h-4 w-4" />
                New Deal
              </Button>
              <Button size="sm" variant="ghost" className="px-2">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 overflow-x-auto">
          <div className="flex space-x-4 pb-2">
            {pipelineStages.map((stage) => (
              <div 
                key={stage} 
                className="min-w-[300px] max-w-[300px] bg-gray-50 rounded-lg p-3 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">{stage}</h4>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    stage === 'Closed Won'
                      ? "bg-green-200 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  )}>
                    {dealsByStage[stage]?.length || 0}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {dealsByStage[stage]?.map((deal: any) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      users={users}
                      className={cn(
                        stage === 'Closed Won' && "border-green-200"
                      )}
                    />
                  ))}
                  
                  {dealsByStage[stage]?.length === 0 && (
                    <div className="bg-white p-3 rounded-md border border-dashed border-gray-300 text-center">
                      <p className="text-xs text-gray-500">No deals in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <CreateDealDialog 
        open={openCreateDeal} 
        onOpenChange={setOpenCreateDeal} 
        stages={pipelineStages}
        users={users}
      />
    </>
  );
};

const PipelineSkeleton = ({ className }: { className?: string }) => (
  <Card className={className}>
    <CardHeader className="pb-3 border-b border-gray-100">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40" />
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-5 overflow-x-auto">
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
    </CardContent>
  </Card>
);

export default PipelineManagement;

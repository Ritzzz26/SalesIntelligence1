import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';

const Team = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/analytics/dashboard'],
  });

  const { data: users } = useQuery({
    queryKey: ['/api/users'],
  });

  if (isLoading) {
    return <TeamPerformanceSkeleton />;
  }

  const teamData = analytics?.teamPerformance?.metadata?.teamMembers || [];
  
  // Transform team data for visualization
  const prepareTeamBarChartData = () => {
    return teamData.map((member: any) => ({
      name: member.name.split(' ')[0],
      revenue: member.revenue,
      target: member.target,
    }));
  };

  // Create data for conversion rate by team member
  const prepareConversionData = () => {
    return teamData.map((member: any) => {
      // Calculate a random conversion rate between 20-40%
      const conversionRate = 20 + Math.floor(Math.random() * 20);
      return {
        name: member.name.split(' ')[0],
        value: conversionRate,
      };
    });
  };

  const barChartData = prepareTeamBarChartData();
  const conversionData = prepareConversionData();
  
  // Data for deal distribution pie chart
  const dealDistributionData = [
    { name: 'John', value: teamData[0]?.deals || 0 },
    { name: 'Alice', value: teamData[1]?.deals || 0 },
    { name: 'Tom', value: teamData[2]?.deals || 0 },
    { name: 'Kate', value: teamData[3]?.deals || 0 },
  ];
  
  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Team Performance</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        {teamData.map((member: any, index: number) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium",
                  index === 0 ? "bg-purple-100 text-purple-700" :
                  index === 1 ? "bg-blue-100 text-blue-700" :
                  index === 2 ? "bg-green-100 text-green-700" :
                  "bg-amber-100 text-amber-700"
                )}>
                  {member.avatar}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">
                    {users?.find((u: any) => u.id === member.userId)?.role || 'Sales Rep'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-500">Revenue</span>
                    <span className="font-semibold">${member.revenue.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={member.percentOfTarget} 
                    max={120} 
                    className="h-2 bg-gray-200" 
                    indicatorClassName={
                      member.percentOfTarget >= 100 ? "bg-green-500" :
                      member.percentOfTarget >= 80 ? "bg-amber-500" :
                      "bg-red-500"
                    }
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span className={cn(
                      "font-medium",
                      member.percentOfTarget >= 100 ? "text-green-500" :
                      member.percentOfTarget >= 80 ? "text-amber-500" :
                      "text-red-500"
                    )}>
                      {member.percentOfTarget}% of target
                    </span>
                    <span className="text-gray-500">{member.deals} deals</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Target</CardTitle>
            <CardDescription>
              Compare performance against targets for each team member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
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
                      borderRadius: '0.375rem',
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    name="Actual Revenue" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="target" 
                    name="Target" 
                    fill="#d1d5db" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead-to-Deal Conversion Rate</CardTitle>
            <CardDescription>
              Percentage of leads converted to deals by team member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={conversionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 45]}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Conversion Rate']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    name="Conversion Rate" 
                    fill="#8b5cf6" 
                    radius={[0, 4, 4, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Deal Distribution</CardTitle>
            <CardDescription>
              Number of deals closed by each team member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dealDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={(entry) => `${entry.name} (${entry.value})`}
                    labelLine={false}
                  >
                    {dealDistributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [value, 'Deals']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Activity Timeline</CardTitle>
            <CardDescription>
              Recent sales activities across the team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Member</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-xs font-medium text-purple-700 mr-2">
                        JD
                      </div>
                      <span>John Doe</span>
                    </div>
                  </TableCell>
                  <TableCell>Closed deal: Innovex Platform</TableCell>
                  <TableCell>$42,000</TableCell>
                  <TableCell>2 days ago</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-medium text-blue-700 mr-2">
                        AS
                      </div>
                      <span>Alice Smith</span>
                    </div>
                  </TableCell>
                  <TableCell>Sent proposal: Global Enterprises</TableCell>
                  <TableCell>$56,000</TableCell>
                  <TableCell>1 day ago</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-xs font-medium text-green-700 mr-2">
                        TJ
                      </div>
                      <span>Tom Jackson</span>
                    </div>
                  </TableCell>
                  <TableCell>Demo completed: TechCorp</TableCell>
                  <TableCell>$24,000</TableCell>
                  <TableCell>5 hours ago</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center text-xs font-medium text-red-700 mr-2">
                        KL
                      </div>
                      <span>Kate Lee</span>
                    </div>
                  </TableCell>
                  <TableCell>New lead qualified: MediaTech</TableCell>
                  <TableCell>$18,500</TableCell>
                  <TableCell>Today</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TeamPerformanceSkeleton = () => (
  <div className="p-6">
    <div className="mb-6">
      <Skeleton className="h-8 w-64" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-2 w-full mb-1" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-1" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-1" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-1" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Team;

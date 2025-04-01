import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  MoreHorizontal, 
  Check, 
  PencilLine, 
  Trash2,
  Mail,
  Phone
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface LeadTableProps {
  searchQuery?: string;
  selectedStatus?: string;
  selectedSource?: string;
}

const LeadTable = ({ searchQuery = '', selectedStatus = '', selectedSource = '' }: LeadTableProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['/api/leads'],
  });

  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: number) => {
      setIsDeleting(id);
      await apiRequest('DELETE', `/api/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: 'Lead deleted',
        description: 'The lead has been removed successfully.',
      });
      setIsDeleting(null);
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete lead',
        description: error.message,
        variant: 'destructive',
      });
      setIsDeleting(null);
    },
  });

  if (isLoading) {
    return <LeadTableSkeleton />;
  }

  // Filter leads based on search query and filters
  const filteredLeads = leads.filter((lead: any) => {
    const searchMatch = searchQuery === '' || 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const statusMatch = selectedStatus === '' || selectedStatus === 'all' || lead.status === selectedStatus;
    const sourceMatch = selectedSource === '' || selectedSource === 'all' || lead.source === selectedSource;
    
    return searchMatch && statusMatch && sourceMatch;
  });

  // Get assigned user names
  const getAssignedUserName = (userId: number) => {
    if (!users) return 'Unassigned';
    const user = users.find((u: any) => u.id === userId);
    return user ? user.fullName : 'Unassigned';
  };

  // Render status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Contacted</Badge>;
      case 'qualified':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Qualified</Badge>;
      case 'unqualified':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Unqualified</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  No leads found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead: any) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.company}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <a href={`mailto:${lead.email}`} className="text-xs text-gray-500 flex items-center hover:text-primary-600">
                          <Mail className="h-3 w-3 mr-1" />
                          {lead.email}
                        </a>
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} className="text-xs text-gray-500 flex items-center hover:text-primary-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {lead.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span 
                        className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium mr-1",
                          lead.score >= 80 ? "bg-green-100 text-green-700" :
                          lead.score >= 60 ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        )}
                      >
                        {lead.score}
                      </span>
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            lead.score >= 80 ? "bg-green-500" :
                            lead.score >= 60 ? "bg-amber-500" :
                            "bg-red-500"
                          )}
                          style={{ width: `${lead.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getAssignedUserName(lead.assignedUserId)}</TableCell>
                  <TableCell>{formatDate(lead.lastContactedAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center">
                          <Check className="mr-2 h-4 w-4" />
                          <span>Mark as Contacted</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                          <PencilLine className="mr-2 h-4 w-4" />
                          <span>Edit Lead</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center text-red-600"
                          onClick={() => deleteLeadMutation.mutate(lead.id)}
                          disabled={isDeleting === lead.id}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>{isDeleting === lead.id ? 'Deleting...' : 'Delete Lead'}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const LeadTableSkeleton = () => (
  <div className="rounded-lg border border-gray-200 bg-white">
    <div className="p-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]"><Skeleton className="h-4 w-20" /></TableHead>
            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
            <TableHead><Skeleton className="h-4 w-12" /></TableHead>
            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
            <TableHead className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-md ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default LeadTable;

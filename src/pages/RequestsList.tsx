import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { RequestsTable } from '@/components/dashboard/RequestsTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { materialRequests, projects } from '@/data/mockData';
import { RequestStatus } from '@/types';

export default function RequestsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const filteredRequests = materialRequests.filter(request => {
    const matchesSearch = request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesProject = projectFilter === 'all' || request.projectId === projectFilter;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  return (
    <MainLayout 
      title="Material Requests" 
      subtitle="View and manage all material requests"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Link to="/requests/new">
          <Button variant="accent" className="gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </Link>
        
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as RequestStatus | 'all')}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="pm_approved">PM Approved</SelectItem>
                <SelectItem value="pm_rejected">PM Rejected</SelectItem>
                <SelectItem value="procurement_approved">Procurement Approved</SelectItem>
                <SelectItem value="stock_issued">Stock Issued</SelectItem>
                <SelectItem value="po_raised">PO Raised</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredRequests.length} of {materialRequests.length} requests
      </p>

      {/* Table */}
      <RequestsTable requests={filteredRequests} />
    </MainLayout>
  );
}

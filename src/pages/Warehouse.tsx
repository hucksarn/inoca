import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Package, 
  Truck, 
  CheckCircle,
  Clock,
  Search,
  Filter,
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface StockIssue {
  id: string;
  requestNumber: string;
  projectName: string;
  requesterName: string;
  items: { name: string; quantity: number; unit: string; issuedQty: number }[];
  status: 'pending' | 'processing' | 'dispatched' | 'delivered';
  createdAt: Date;
}

const mockStockIssues: StockIssue[] = [
  {
    id: 'si-001',
    requestNumber: 'MR-2024-002',
    projectName: 'Riverside Complex',
    requesterName: 'Sarah Johnson',
    items: [
      { name: 'Cable Wire 2.5mm', quantity: 1000, unit: 'nos', issuedQty: 0 }
    ],
    status: 'pending',
    createdAt: new Date('2024-01-16T10:00:00'),
  },
  {
    id: 'si-002',
    requestNumber: 'MR-2024-004',
    projectName: 'Tech Park Phase 2',
    requesterName: 'Mike Chen',
    items: [
      { name: 'PVC Pipes 4 inch', quantity: 100, unit: 'nos', issuedQty: 100 }
    ],
    status: 'dispatched',
    createdAt: new Date('2024-01-12T08:00:00'),
  },
  {
    id: 'si-003',
    requestNumber: 'MR-2024-006',
    projectName: 'Marina Bay Tower',
    requesterName: 'David Park',
    items: [
      { name: 'Safety Helmets', quantity: 50, unit: 'nos', issuedQty: 50 },
      { name: 'Safety Vests', quantity: 50, unit: 'nos', issuedQty: 50 }
    ],
    status: 'delivered',
    createdAt: new Date('2024-01-10T09:00:00'),
  },
];

const statusConfig = {
  pending: { label: 'Pending Issue', className: 'bg-warning/10 text-warning' },
  processing: { label: 'Processing', className: 'bg-info/10 text-info' },
  dispatched: { label: 'Dispatched', className: 'bg-primary/10 text-primary' },
  delivered: { label: 'Delivered', className: 'bg-success/10 text-success' },
};

export default function Warehouse() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<StockIssue | null>(null);
  const [issuedQuantities, setIssuedQuantities] = useState<Record<string, number>>({});

  const filteredIssues = mockStockIssues.filter(issue => {
    const matchesSearch = issue.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleIssueStock = (issue: StockIssue) => {
    setSelectedIssue(issue);
    const quantities: Record<string, number> = {};
    issue.items.forEach((item, idx) => {
      quantities[idx] = item.quantity;
    });
    setIssuedQuantities(quantities);
  };

  const confirmIssue = () => {
    if (!selectedIssue) return;
    
    toast({
      title: 'Stock Issued Successfully',
      description: `Materials for ${selectedIssue.requestNumber} have been issued and ready for dispatch.`,
    });
    setSelectedIssue(null);
  };

  const markAsDispatched = (issue: StockIssue) => {
    toast({
      title: 'Marked as Dispatched',
      description: `${issue.requestNumber} materials are on the way to ${issue.projectName}.`,
    });
  };

  return (
    <MainLayout 
      title="Warehouse" 
      subtitle="Manage stock issues and dispatches"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-warning" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockStockIssues.filter(i => i.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending Issue</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-info/10 border border-info/20">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-info" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockStockIssues.filter(i => i.status === 'processing').length}
              </p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockStockIssues.filter(i => i.status === 'dispatched').length}
              </p>
              <p className="text-sm text-muted-foreground">In Transit</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockStockIssues.filter(i => i.status === 'delivered').length}
              </p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by request or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending Issue</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="dispatched">Dispatched</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stock Issue Cards */}
      <div className="space-y-4">
        {filteredIssues.map((issue, index) => (
          <div 
            key={issue.id}
            className="bg-card rounded-xl border border-border p-6 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Issue Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-lg font-semibold text-foreground">
                    {issue.requestNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[issue.status].className}`}>
                    {statusConfig[issue.status].label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{issue.projectName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{issue.requesterName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{format(issue.createdAt, 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {issue.status === 'pending' && (
                  <Button 
                    variant="accent" 
                    size="sm"
                    onClick={() => handleIssueStock(issue)}
                  >
                    <Package className="h-4 w-4 mr-1" />
                    Issue Stock
                  </Button>
                )}
                {issue.status === 'processing' && (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => markAsDispatched(issue)}
                  >
                    <Truck className="h-4 w-4 mr-1" />
                    Mark Dispatched
                  </Button>
                )}
                {(issue.status === 'dispatched' || issue.status === 'delivered') && (
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                )}
              </div>
            </div>

            {/* Items List */}
            <div className="mt-4 pt-4 border-t border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Material</th>
                    <th className="pb-2 font-medium text-right">Requested</th>
                    <th className="pb-2 font-medium text-right">Issued</th>
                  </tr>
                </thead>
                <tbody>
                  {issue.items.map((item, idx) => (
                    <tr key={idx} className="border-t border-border/50">
                      <td className="py-2 font-medium">{item.name}</td>
                      <td className="py-2 text-right text-muted-foreground">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-2 text-right">
                        {item.issuedQty > 0 ? (
                          <span className="text-success">{item.issuedQty} {item.unit}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No stock issues found</h3>
            <p className="text-muted-foreground">No matching records for your search criteria.</p>
          </div>
        )}
      </div>

      {/* Issue Stock Dialog */}
      <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Issue Stock</DialogTitle>
            <DialogDescription>
              Confirm quantities to issue for {selectedIssue?.requestNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {selectedIssue?.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Requested: {item.quantity} {item.unit}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-24 text-right"
                    value={issuedQuantities[idx] || 0}
                    onChange={(e) => setIssuedQuantities({
                      ...issuedQuantities,
                      [idx]: parseInt(e.target.value) || 0
                    })}
                    max={item.quantity}
                  />
                  <span className="text-sm text-muted-foreground w-12">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedIssue(null)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={confirmIssue}>
              Confirm Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Warehouse as WarehouseIcon, 
  FileText, 
  Clock,
  ChevronRight,
  Building2,
  User,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { materialRequests } from '@/data/mockData';
import { MaterialRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Procurement() {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<MaterialRequest | null>(null);
  const [actionType, setActionType] = useState<'stock' | 'purchase' | null>(null);
  const [poNumber, setPoNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter requests that are approved by PM and pending procurement action
  const pendingProcurement = materialRequests.filter(
    r => r.status === 'pm_approved' || r.status === 'procurement_approved'
  );

  const filteredRequests = pendingProcurement.filter(request =>
    request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (request: MaterialRequest, action: 'stock' | 'purchase') => {
    setSelectedRequest(request);
    setActionType(action);
    setPoNumber('');
    setNotes('');
  };

  const confirmAction = () => {
    if (!selectedRequest || !actionType) return;

    const actionLabel = actionType === 'stock' ? 'Stock Issue' : 'Purchase Order';
    toast({
      title: `${actionLabel} Created`,
      description: `${selectedRequest.requestNumber} has been processed for ${actionLabel.toLowerCase()}.`,
    });

    setSelectedRequest(null);
    setActionType(null);
  };

  return (
    <MainLayout 
      title="Procurement" 
      subtitle="Process approved requests and manage purchase orders"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-info/10 border border-info/20">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-info" />
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingProcurement.length}</p>
              <p className="text-sm text-muted-foreground">Pending Action</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-warning" />
            <div>
              <p className="text-2xl font-bold text-foreground">8</p>
              <p className="text-sm text-muted-foreground">POs Raised</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <div className="flex items-center gap-3">
            <WarehouseIcon className="h-5 w-5 text-success" />
            <div>
              <p className="text-2xl font-bold text-foreground">15</p>
              <p className="text-sm text-muted-foreground">Stock Issues</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-2xl font-bold text-foreground">2</p>
              <p className="text-sm text-muted-foreground">Urgent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="stock_request">Stock Request</SelectItem>
            <SelectItem value="purchase_request">Purchase Request</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {filteredRequests.map((request, index) => (
          <div 
            key={request.id}
            className="bg-card rounded-xl border border-border p-6 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Request Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-lg font-semibold text-foreground">
                    {request.requestNumber}
                  </span>
                  <StatusBadge status={request.status} />
                  {request.priority === 'urgent' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                      <AlertTriangle className="h-3 w-3" />
                      Urgent
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium capitalize">
                    {request.requestType.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{request.projectName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{request.requesterName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{request.items.length} items</span>
                  </div>
                </div>

                {request.requiredDate && (
                  <p className="text-sm text-muted-foreground">
                    Required by: {format(request.requiredDate, 'MMM d, yyyy')}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAction(request, 'stock')}
                >
                  <WarehouseIcon className="h-4 w-4 mr-1" />
                  Issue Stock
                </Button>
                <Button 
                  variant="accent" 
                  size="sm"
                  onClick={() => handleAction(request, 'purchase')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Raise PO
                </Button>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Items Preview */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {request.items.map((item) => (
                  <span 
                    key={item.id}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-muted text-sm"
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="mx-2 text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      {item.quantity} {item.unit}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No pending requests</h3>
            <p className="text-muted-foreground">All approved requests have been processed.</p>
          </div>
        )}
      </div>

      {/* Action Dialog */}
      <Dialog open={!!selectedRequest && !!actionType} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'stock' ? 'Issue from Stock' : 'Raise Purchase Order'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'stock' 
                ? 'This will notify the warehouse to issue materials from stock.'
                : 'Create a purchase order for this request.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {actionType === 'purchase' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">PO Reference Number</label>
                <Input
                  placeholder="e.g., PO-2024-001"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                placeholder="Add any notes or instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Cancel
            </Button>
            <Button 
              variant="accent"
              onClick={confirmAction}
            >
              {actionType === 'stock' ? 'Confirm Stock Issue' : 'Create Purchase Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

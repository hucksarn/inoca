import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  Eye,
  User,
  Building2,
  Package,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { usePendingApprovals, useApproveRequest, useRejectRequest, MaterialRequest, useMaterialRequestItems, MaterialRequestItem } from '@/hooks/useDatabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function Approvals() {
  const { toast } = useToast();
  const { data: pendingRequests = [], isLoading } = usePendingApprovals();
  const approveRequest = useApproveRequest();
  const rejectRequest = useRejectRequest();
  
  const [selectedRequest, setSelectedRequest] = useState<MaterialRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState('');
  const [requestType, setRequestType] = useState<'stock_request' | 'purchase_request'>('stock_request');
  const [isProcessing, setIsProcessing] = useState(false);
  const [requestItems, setRequestItems] = useState<Record<string, MaterialRequestItem[]>>({});

  // Fetch items for all pending requests
  useEffect(() => {
    const fetchItems = async () => {
      const items: Record<string, MaterialRequestItem[]> = {};
      for (const request of pendingRequests) {
        const { data } = await import('@/integrations/supabase/client').then(m => 
          m.supabase
            .from('material_request_items')
            .select('*')
            .eq('request_id', request.id)
        );
        if (data) {
          items[request.id] = data as MaterialRequestItem[];
        }
      }
      setRequestItems(items);
    };
    
    if (pendingRequests.length > 0) {
      fetchItems();
    }
  }, [pendingRequests]);

  const handleAction = (request: MaterialRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setComment('');
    setRequestType('stock_request');
  };

  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    setIsProcessing(true);
    
    try {
      if (actionType === 'approve') {
        await approveRequest.mutateAsync({ 
          requestId: selectedRequest.id, 
          comment: comment || undefined,
          requestType: requestType
        });
      } else {
        await rejectRequest.mutateAsync({ requestId: selectedRequest.id, comment });
      }

      toast({
        title: actionType === 'approve' ? 'Request Approved' : 'Request Rejected',
        description: `${selectedRequest.request_number} has been ${actionType === 'approve' ? 'approved' : 'rejected'}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to process request',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setSelectedRequest(null);
      setActionType(null);
      setComment('');
      setRequestType('stock_request');
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Pending Approvals" subtitle="Review and approve material requests">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Pending Approvals" 
      subtitle="Review and approve material requests"
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
        <div className="p-3 md:p-4 rounded-xl bg-warning/10 border border-warning/20">
          <div className="flex items-center gap-2 md:gap-3">
            <Clock className="h-4 w-4 md:h-5 md:w-5 text-warning shrink-0" />
            <div className="min-w-0">
              <p className="text-lg md:text-2xl font-bold text-foreground">{pendingRequests.length}</p>
              <p className="text-xs md:text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="p-3 md:p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2 md:gap-3">
            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-destructive shrink-0" />
            <div className="min-w-0">
              <p className="text-lg md:text-2xl font-bold text-foreground">
                {pendingRequests.filter(r => r.priority === 'urgent').length}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">Urgent</p>
            </div>
          </div>
        </div>
        <div className="p-3 md:p-4 rounded-xl bg-success/10 border border-success/20">
          <div className="flex items-center gap-2 md:gap-3">
            <Check className="h-4 w-4 md:h-5 md:w-5 text-success shrink-0" />
            <div className="min-w-0">
              <p className="text-lg md:text-2xl font-bold text-foreground">-</p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">Approved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Cards */}
      <div className="space-y-4">
        {pendingRequests.map((request, index) => (
          <div 
            key={request.id}
            className="bg-card rounded-xl border border-border p-4 md:p-6 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="space-y-4">
              {/* Request Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="text-base md:text-lg font-semibold text-foreground">
                      {request.request_number}
                    </span>
                    <StatusBadge status={request.status as any} />
                    {request.priority === 'urgent' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                        <AlertTriangle className="h-3 w-3" />
                        Urgent
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-foreground truncate">{request.project_name}</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-foreground truncate">{request.requester_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-foreground">
                      {requestItems[request.id]?.length || 0} items
                    </span>
                  </div>
                </div>

                {request.remarks && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {request.remarks}
                  </p>
                )}

                <div className="text-xs text-muted-foreground">
                  Submitted {format(new Date(request.created_at), 'MMM d, yyyy')}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAction(request, 'reject')}
                  className="flex-1 sm:flex-none text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button 
                  variant="success" 
                  size="sm"
                  onClick={() => handleAction(request, 'approve')}
                  className="flex-1 sm:flex-none"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Link to={`/requests/${request.id}`}>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Items Preview */}
            {requestItems[request.id] && requestItems[request.id].length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {requestItems[request.id].map((item) => (
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
            )}
          </div>
        ))}

        {pendingRequests.length === 0 && (
          <div className="text-center py-12">
            <Check className="h-12 w-12 mx-auto text-success mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No pending approvals at the moment.</p>
          </div>
        )}
      </div>

      {/* Approval/Rejection Dialog */}
      <Dialog open={!!selectedRequest && !!actionType} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'Select whether this is a stock request (items available) or purchase request (items need to be purchased).'
                : 'Please provide a reason for rejection. This will be visible to the requester.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Request Type Selection for approval */}
            {actionType === 'approve' && (
              <div className="space-y-2">
                <Label htmlFor="requestType">Request Type *</Label>
                <Select 
                  value={requestType} 
                  onValueChange={(v) => setRequestType(v as 'stock_request' | 'purchase_request')}
                >
                  <SelectTrigger id="requestType">
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock_request">Stock Request (Available in stock)</SelectItem>
                    <SelectItem value="purchase_request">Purchase Request (Need to purchase)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Textarea
              placeholder={actionType === 'approve' ? 'Add a comment (optional)' : 'Reason for rejection (required)'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              variant={actionType === 'approve' ? 'success' : 'destructive'}
              onClick={confirmAction}
              disabled={(actionType === 'reject' && !comment.trim()) || isProcessing}
            >
              {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

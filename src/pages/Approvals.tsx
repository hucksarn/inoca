import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
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
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  ChevronRight,
  User,
  Building2,
  Package
} from 'lucide-react';
import { format } from 'date-fns';
import { materialRequests } from '@/data/mockData';
import { MaterialRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Approvals() {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<MaterialRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState('');

  const pendingRequests = materialRequests.filter(
    r => r.status === 'submitted' || r.status === 'pm_approved'
  );

  const handleAction = (request: MaterialRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setComment('');
  };

  const confirmAction = () => {
    if (!selectedRequest || !actionType) return;

    toast({
      title: actionType === 'approve' ? 'Request Approved' : 'Request Rejected',
      description: `${selectedRequest.requestNumber} has been ${actionType === 'approve' ? 'approved' : 'rejected'}.`,
    });

    setSelectedRequest(null);
    setActionType(null);
    setComment('');
  };

  return (
    <MainLayout 
      title="Pending Approvals" 
      subtitle="Review and approve material requests"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-warning" />
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingRequests.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {pendingRequests.filter(r => r.priority === 'urgent').length}
              </p>
              <p className="text-sm text-muted-foreground">Urgent</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-success" />
            <div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Approved Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Cards */}
      <div className="space-y-4">
        {pendingRequests.map((request, index) => (
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

                {request.remarks && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {request.remarks}
                  </p>
                )}

                <div className="text-xs text-muted-foreground">
                  Submitted {format(request.createdAt, 'MMM d, yyyy \'at\' h:mm a')}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAction(request, 'reject')}
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button 
                  variant="success" 
                  size="sm"
                  onClick={() => handleAction(request, 'approve')}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Items Preview */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {request.items.map((item, idx) => (
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
                ? 'This request will be sent to procurement for processing.'
                : 'Please provide a reason for rejection. This will be visible to the requester.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder={actionType === 'approve' ? 'Add a comment (optional)' : 'Reason for rejection (required)'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Cancel
            </Button>
            <Button 
              variant={actionType === 'approve' ? 'success' : 'destructive'}
              onClick={confirmAction}
              disabled={actionType === 'reject' && !comment.trim()}
            >
              {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

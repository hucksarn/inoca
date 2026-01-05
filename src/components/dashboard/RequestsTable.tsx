import { MaterialRequest } from '@/types';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface RequestsTableProps {
  requests: MaterialRequest[];
  showActions?: boolean;
}

export function RequestsTable({ requests, showActions = true }: RequestsTableProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <table className="data-table">
        <thead>
          <tr>
            <th>Request #</th>
            <th>Project</th>
            <th>Type</th>
            <th>Priority</th>
            <th>Requester</th>
            <th>Status</th>
            <th>Date</th>
            {showActions && <th className="text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="animate-fade-in">
              <td>
                <span className="font-medium text-foreground">{request.requestNumber}</span>
              </td>
              <td>
                <div>
                  <p className="font-medium text-foreground">{request.projectName}</p>
                  <p className="text-xs text-muted-foreground">{request.items.length} items</p>
                </div>
              </td>
              <td>
                <span className="capitalize text-sm">
                  {request.requestType.replace('_', ' ')}
                </span>
              </td>
              <td>
                {request.priority === 'urgent' ? (
                  <span className="inline-flex items-center gap-1 text-sm text-warning font-medium">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Urgent
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Normal</span>
                )}
              </td>
              <td>
                <div>
                  <p className="text-sm font-medium">{request.requesterName}</p>
                  <p className="text-xs text-muted-foreground">{request.requesterDesignation}</p>
                </div>
              </td>
              <td>
                <StatusBadge status={request.status} />
              </td>
              <td>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {format(request.createdAt, 'MMM d, yyyy')}
                </div>
              </td>
              {showActions && (
                <td className="text-right">
                  <Link to={`/requests/${request.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {requests.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No requests found
        </div>
      )}
    </div>
  );
}

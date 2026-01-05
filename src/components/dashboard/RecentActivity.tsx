import { CheckCircle, XCircle, Clock, Package, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

const activities = [
  {
    id: 1,
    type: 'approved',
    message: 'MR-2024-002 approved by John Mitchell',
    time: '2 hours ago',
    icon: CheckCircle,
    iconClass: 'text-success',
  },
  {
    id: 2,
    type: 'submitted',
    message: 'New request MR-2024-005 submitted',
    time: '3 hours ago',
    icon: Clock,
    iconClass: 'text-info',
  },
  {
    id: 3,
    type: 'delivered',
    message: 'Stock issued for MR-2024-004',
    time: '5 hours ago',
    icon: Package,
    iconClass: 'text-warning',
  },
  {
    id: 4,
    type: 'rejected',
    message: 'MR-2024-003 rejected - needs revision',
    time: '1 day ago',
    icon: XCircle,
    iconClass: 'text-destructive',
  },
  {
    id: 5,
    type: 'delivery',
    message: 'Delivery scheduled for MR-2024-001',
    time: '1 day ago',
    icon: Truck,
    iconClass: 'text-primary',
  },
];

export function RecentActivity() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="flex items-start gap-3 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn("p-2 rounded-lg bg-muted", activity.iconClass)}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

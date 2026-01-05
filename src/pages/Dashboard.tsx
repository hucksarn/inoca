import { MainLayout } from '@/components/layout/MainLayout';
import { RequestsTable } from '@/components/dashboard/RequestsTable';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ProjectOverview } from '@/components/dashboard/ProjectOverview';
import { Button } from '@/components/ui/button';
import { Plus, CheckSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMaterialRequests } from '@/hooks/useDatabase';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const { data: requests = [], isLoading: requestsLoading } = useMaterialRequests();

  const pendingCount = requests.filter(r => r.status === 'submitted').length;

  if (requestsLoading) {
    return (
      <MainLayout title="Dashboard" subtitle="Overview of your procurement activities">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Dashboard" 
      subtitle="Overview of your procurement activities"
    >
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
        {!isAdmin && (
          <Link to="/requests/new">
            <Button variant="accent" size="sm" className="gap-2 md:h-10 md:px-4 md:py-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Request</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        )}
        {isAdmin && (
          <Link to="/approvals">
            <Button variant="outline" size="sm" className="gap-2 md:h-10 md:px-4 md:py-2">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Pending Approvals</span>
              <span className="sm:hidden">Approvals</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                  {pendingCount}
                </span>
              )}
            </Button>
          </Link>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Requests Table */}
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-semibold text-foreground">
              {isAdmin ? 'All Requests' : 'My Requests'}
            </h2>
            <Link to="/requests">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <RequestsTable requests={requests.slice(0, 5)} />
        </div>

        {/* Sidebar - hidden on mobile, shown below on tablet */}
        <div className="space-y-4 md:space-y-6">
          <RecentActivity />
          <ProjectOverview />
        </div>
      </div>
    </MainLayout>
  );
}

import { projects } from '@/data/mockData';
import { Building2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProjectOverview() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Active Projects</h3>
      
      <div className="space-y-3">
        {projects.filter(p => p.status === 'active').map((project, index) => (
          <div 
            key={project.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{project.name}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {project.location}
              </p>
            </div>
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              project.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
            )}>
              Active
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

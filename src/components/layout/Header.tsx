import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center gap-3 px-4 md:px-6 py-4">
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Search - hidden on mobile */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search requests..." 
              className="w-64 pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative shrink-0">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
          </Button>
        </div>
      </div>
    </header>
  );
}
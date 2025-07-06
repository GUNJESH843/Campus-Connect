import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground hidden md:block">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
          Alex Doe
        </span>
        <Avatar className="w-9 h-9">
          <AvatarImage
            src="https://placehold.co/100x100.png"
            data-ai-hint="profile picture"
            alt="User Avatar"
          />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

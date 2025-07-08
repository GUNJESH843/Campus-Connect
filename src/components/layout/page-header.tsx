'use client';

import { LogOut } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="w-9 h-9">
                <AvatarImage
                  src="https://placehold.co/100x100.png"
                  data-ai-hint="profile picture"
                  alt="User Avatar"
                />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Alex Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  alex.doe@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

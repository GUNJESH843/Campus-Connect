'use client';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  BrainCircuit,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  Users,
} from 'lucide-react';

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/study-buddy', label: 'Study Buddy', icon: Users },
  { href: '/map', label: 'Campus Map', icon: MapPin },
  { href: '/courses', label: 'Course Reviews', icon: BookOpen },
  { href: '/tutor', label: 'AI Tutor', icon: BrainCircuit },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <div className="flex h-full flex-col gap-2 p-2">
        <div className="flex h-12 items-center justify-center rounded-md bg-background group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:justify-center">
          <GraduationCap className="h-6 w-6 text-primary group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
          <span className="ml-2 text-lg font-bold group-data-[collapsible=icon]:hidden">
            CampusConnect
          </span>
        </div>
        <SidebarMenu className="flex-1">
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={{ children: link.label }}
                className="justify-start"
              >
                <a href={link.href}>
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}

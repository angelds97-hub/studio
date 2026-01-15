'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Settings,
  Truck,
  Newspaper,
  Users,
  ClipboardList,
  Folder,
} from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { SheetClose } from '@/components/ui/sheet';
import { LoadingLink } from '../loading-link';
import { useEffect, useState } from 'react';

export function AppSidebar() {
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // This runs on the client, after hydration
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
    }
  }, [pathname]); // Re-check on path change

  const navItems = {
    all: [{ href: '/dashboard', label: 'Panell', icon: LayoutDashboard }],
    administrador: [
      { href: '/solicituts', label: 'Sol·licituds', icon: FileText },
      { href: '/dashboard/documents', label: 'Documents', icon: Folder },
      { href: '/dashboard/registre-enviaments', label: "Registre d'Enviaments", icon: ClipboardList},
      { href: '/dashboard/blog', label: 'Blog', icon: Newspaper },
      { href: '/dashboard/usuaris', label: 'Usuaris', icon: Users },
      { href: '/configuracio', label: 'Configuració', icon: Settings },
    ],
    treballador: [
      { href: '/dashboard/documents', label: 'Documents', icon: Folder },
      { href: '/dashboard/registre-enviaments', label: "Registre d'Enviaments", icon: ClipboardList},
      { href: '/dashboard/blog', label: 'Blog', icon: Newspaper },
      { href: '/configuracio', label: 'Configuració', icon: Settings },
    ],
    'client/proveidor': [
      { href: '/solicituts', label: 'Sol·licituds', icon: FileText },
      { href: '/dashboard/documents', label: 'Documents', icon: Folder },
      { href: '/blog', label: 'Blog', icon: Newspaper },
      { href: '/configuracio', label: 'Configuració', icon: Settings },
    ],
     client: [
      { href: '/solicituts', label: 'Sol·licituds', icon: FileText },
      { href: '/dashboard/documents', label: 'Documents', icon: Folder },
      { href: '/blog', label: 'Blog', icon: Newspaper },
      { href: '/configuracio', label: 'Configuració', icon: Settings },
    ],
    extern: [{ href: '/configuracio', label: 'Configuració', icon: Settings }],
  };

  const getNavItems = () => {
    if (!userProfile) return [];
    const roleNavs = navItems[userProfile.role] || [];
    return [...navItems.all, ...roleNavs];
  };

  const filteredNavItems = getNavItems();

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <SheetClose asChild>
          <LoadingLink
            className="flex items-center gap-2 font-semibold"
            href="/"
          >
            <Truck className="h-6 w-6 text-primary" />
            <span className="font-headline text-lg group-data-[state=collapsed]:hidden">
              EnTrans
            </span>
          </LoadingLink>
        </SheetClose>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu>
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SheetClose asChild>
                <LoadingLink href={item.href}>
                  <SidebarMenuButton
                    isActive={
                      item.href === '/dashboard'
                        ? pathname === item.href
                        : pathname.startsWith(item.href)
                    }
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="group-data-[state=collapsed]:hidden">
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </LoadingLink>
              </SheetClose>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

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
  ScrollText,
  PlusCircle,
  Settings,
  Truck,
  Newspaper,
  Users,
  Home,
  FileText,
} from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { SheetClose } from '@/components/ui/sheet';
import { LoadingLink } from '../loading-link';


export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const navItems = {
    all: [
       { href: '/dashboard', label: 'Panell', icon: LayoutDashboard },
    ],
    administrador: [
      { href: '/solicituts', label: 'Sol·licituds', icon: FileText },
      { href: '/dashboard/blog', label: 'Blog', icon: Newspaper },
      { href: '/dashboard/usuaris', label: "Usuaris", icon: Users },
      { href: '/configuracio', label: 'Configuració', icon: Settings },
    ],
    treballador: [
      { href: '/dashboard/blog', label: 'Blog', icon: Newspaper },
      { href: '/configuracio', label: 'Configuració', icon: Settings },
    ],
    'client/proveidor': [
        { href: '/solicituts', label: 'Les meves sol·licituds', icon: FileText },
        { href: '/solicituts/nova', label: 'Nova sol·licitud', icon: PlusCircle },
        { href: '/dashboard/blog', label: 'Blog', icon: Newspaper },
        { href: '/configuracio', label: 'Configuració', icon: Settings },
    ],
    extern: [
       { href: '/configuracio', label: 'Configuració', icon: Settings },
    ]
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
            <LoadingLink className="flex items-center gap-2 font-semibold" href="/">
              <Truck className="h-6 w-6 text-primary" />
              <span className="font-headline text-lg group-data-[state=collapsed]:hidden">EnTrans</span>
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
                        <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
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

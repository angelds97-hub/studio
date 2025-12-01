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
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  ScrollText,
  PlusCircle,
  Settings,
  Truck,
  Newspaper,
  Users
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

  const navItems = [
    // { href: '/dashboard', label: 'Panell', icon: LayoutDashboard, roles: ['administrador', 'treballador', 'client/proveidor', 'extern'] },
    // { href: '/solicituts', label: 'Sol·licituds', icon: ScrollText, roles: ['administrador', 'treballador', 'client/proveidor'] },
    { href: '/dashboard/blog', label: 'Blog', icon: Newspaper, roles: ['administrador', 'treballador'] },
    { href: '/dashboard/usuaris', label: 'Usuaris', icon: Users, roles: ['administrador'] },
    { href: '/configuracio', label: 'Configuració', icon: Settings, roles: ['administrador', 'treballador', 'client/proveidor', 'extern'] },
  ];

  const filteredNavItems = navItems.filter(item => userProfile && item.roles.includes(userProfile.role));

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

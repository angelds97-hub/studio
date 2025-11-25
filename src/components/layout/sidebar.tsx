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
  useSidebar,
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


export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const firestore = useFirestore();
  const { isMobile } = useSidebar();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const navItems = [
    { href: '/dashboard', label: 'Panell', icon: LayoutDashboard, roles: ['administrador', 'treballador', 'client/proveidor', 'extern'] },
    { href: '/solicituts', label: 'Sol·licituds', icon: ScrollText, roles: ['administrador', 'treballador', 'client/proveidor'] },
    { href: '/dashboard/blog', label: 'Blog', icon: Newspaper, roles: ['administrador', 'treballador'] },
    { href: '/dashboard/usuaris', label: 'Usuaris', icon: Users, roles: ['administrador'] },
    { href: '/configuracio', label: 'Configuració', icon: Settings, roles: ['administrador', 'treballador', 'client/proveidor', 'extern'] },
  ];

  const filteredNavItems = navItems.filter(item => userProfile && item.roles.includes(userProfile.role));

  const NavLink = isMobile ? SheetClose : 'div';

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
         <NavLink asChild>
            <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
              <Truck className="h-6 w-6 text-primary" />
              <span className="font-headline text-lg group-data-[state=collapsed]:hidden">EnTrans</span>
            </Link>
        </NavLink>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu>
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
               <NavLink asChild>
                  <Link href={item.href}>
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
                  </Link>
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
         <Separator className="my-2" />
         <div className="p-2 group-data-[state=collapsed]:p-0 group-data-[state=collapsed]:w-fit group-data-[state=collapsed]:mx-auto">
            <NavLink asChild>
                <Button size="sm" className="w-full group-data-[state=collapsed]:w-8 group-data-[state=collapsed]:h-8 group-data-[state=collapsed]:p-0" asChild>
                    <Link href="/solicituts/nova">
                        <PlusCircle className="mr-2 h-4 w-4 group-data-[state=collapsed]:mr-0" />
                        <span className="group-data-[state=collapsed]:hidden">Nova Sol·licitud</span>
                    </Link>
                </Button>
            </NavLink>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}

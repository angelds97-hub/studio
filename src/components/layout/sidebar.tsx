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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useUser, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import type { UserProfile } from '@/lib/types';


export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const firestore = useFirestore();

  const { data: userProfile } = useDoc<UserProfile>(
    user && firestore ? doc(firestore, 'users', user.uid) : null
  );

  const navItems = [
    { href: '/dashboard', label: 'Panell', icon: LayoutDashboard, roles: ['administrador', 'treballador', 'client/proveidor', 'extern'] },
    { href: '/solicituts', label: 'Sol·licituds', icon: ScrollText, roles: ['administrador', 'treballador', 'client/proveidor'] },
    { href: '/dashboard/blog', label: 'Blog', icon: Newspaper, roles: ['administrador', 'treballador', 'extern'] },
    { href: '/dashboard/usuaris', label: 'Usuaris', icon: Users, roles: ['administrador'] },
    { href: '/configuracio', label: 'Configuració', icon: Settings, roles: ['administrador', 'treballador', 'client/proveidor', 'extern'] },
  ];

  const filteredNavItems = navItems.filter(item => userProfile && item.roles.includes(userProfile.role));


  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
          <Truck className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg">EnTrans</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu>
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={
                    item.href === '/dashboard'
                      ? pathname === item.href
                      : pathname.startsWith(item.href)
                  }
                >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
         <Separator className="my-2" />
         <div className="p-2">
            <Button size="sm" className="w-full" asChild>
                <Link href="/solicituts/nova">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Sol·licitud
                </Link>
            </Button>
         </div>
        <Separator className="my-2" />
        <Card className="shadow-none border-none bg-transparent">
          <CardHeader className="p-2 pt-0">
            <CardTitle className="text-base font-semibold">
              Actualitza a Pro
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="text-xs text-muted-foreground mb-4">
              Aconsegueix més funcions i seguiment il·limitat.
            </div>
            <Button size="sm" className="w-full">
              Actualitzar
            </Button>
          </CardContent>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
}

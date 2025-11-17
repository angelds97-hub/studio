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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Panell', icon: LayoutDashboard },
  { href: '/solicituts', label: 'Sol·licituds', icon: ScrollText },
  { href: '/solicituts/nova', label: 'Nova Sol·licitud', icon: PlusCircle },
  { href: '/configuracio', label: 'Configuració', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

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
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={
                    item.href === '/dashboard'
                      ? pathname === '/dashboard'
                      : pathname.startsWith(item.href) && item.href !== '/dashboard'
                  }
                >
                  <a>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
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

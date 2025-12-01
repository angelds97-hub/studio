
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Truck,
  FileText,
  Newspaper,
  PlusCircle,
  Settings,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const roleDashboardConfig = {
  administrador: {
    title: 'Benvingut, Administrador',
    description: 'Gestiona tota la plataforma des d\'aquí.',
    links: [
      { href: '/dashboard/usuaris', label: 'Gestionar Usuaris', icon: Users },
      { href: '/dashboard/blog', label: 'Gestionar Blog', icon: Newspaper },
      { href: '/solicituts', label: 'Veure Sol·licituds', icon: FileText },
    ],
  },
  treballador: {
    title: 'Benvingut/da',
    description: 'Gestiona el contingut de la plataforma.',
    links: [
      { href: '/dashboard/blog', label: 'Gestionar Blog', icon: Newspaper },
      { href: '/dashboard/blog/nou', label: 'Nou Article', icon: PlusCircle },
    ],
  },
  'client/proveidor': {
    title: 'La teva Àrea de Client',
    description: 'Gestiona les teves sol·licituds de transport.',
    links: [
      { href: '/solicituts/nova', label: 'Nova Sol·licitud', icon: PlusCircle },
      { href: '/solicituts', label: 'Les meves Sol·licituds', icon: FileText },
      { href: '/configuracio', label: 'Configuració del Compte', icon: Settings },
    ],
  },
  extern: {
    title: 'El teu Perfil',
    description: 'Actualitza la teva informació personal i preferències.',
    links: [
        { href: '/configuracio', label: 'Anar a la Configuració', icon: Settings },
    ],
  },
};


export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile, isLoading } = useDoc<UserProfile>(profileRef);

  if (isLoading || !profile) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  const config = roleDashboardConfig[profile.role] || roleDashboardConfig.extern;

  return (
    <div className="flex flex-col gap-4">
       <div>
        <h1 className="text-3xl font-bold font-headline">{config.title}</h1>
        <p className="text-muted-foreground">{config.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {config.links.map((link) => (
          <Card key={link.href}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{link.label}</CardTitle>
              <link.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <Link href={link.href}>
                  Anar-hi <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}



'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Truck,
  FileText,
  MoreHorizontal,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import type { TransportRequest } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardStats({
  requests,
  isLoading,
}: {
  requests: any[] | null;
  isLoading: boolean;
}) {
  const openRequests = requests?.filter((r) => r.status === 'oberta').length ?? 0;
  const activeTransports = requests?.filter((r) => r.status === 'assignada').length ?? 0;

  if (isLoading) {
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sol·licituds Obertes
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-4 w-28 mt-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transports en Curs
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-4 w-24 mt-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transportistes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-4 w-24 mt-1" />
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Sol·licituds Obertes
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openRequests}</div>
          <p className="text-xs text-muted-foreground">
            Esperant ofertes de transportistes.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Transports en Curs
          </CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeTransports}</div>
          <p className="text-xs text-muted-foreground">
            Actualment en ruta.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transportistes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-muted-foreground">+5 nous aquest mes</p>
        </CardContent>
      </Card>
    </>
  );
}


export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const requestsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
        collection(firestore, 'users', user.uid, 'transportRequests'), 
        orderBy('dates.from', 'desc'), 
        limit(10)
    );
  }, [firestore, user]);

  const { data: requests, isLoading: requestsLoading } =
    useCollection<TransportRequest>(requestsQuery);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <DashboardStats requests={requests} isLoading={requestsLoading} />
      </div>
    </div>
  );
}

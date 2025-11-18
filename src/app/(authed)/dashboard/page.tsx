
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

function RecentRequestsTable({
  requests,
  isLoading,
}: {
  requests: WithId<TransportRequest>[] | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ruta</TableHead>
            <TableHead className="hidden sm:table-cell">Tipus</TableHead>
            <TableHead className="text-right">Data</TableHead>
            <TableHead>
              <span className="sr-only">Accions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(4)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-5 w-24 ml-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <FileText className="mx-auto h-12 w-12" />
        <h3 className="mt-2 text-lg font-semibold">No hi ha sol·licituds</h3>
        <p className="mt-1 text-sm">
          Crea la teva primera sol·licitud de transport per començar.
        </p>
        <Button asChild className="mt-4">
            <Link href="/solicituts/nova">
                Nova Sol·licitud
            </Link>
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ruta</TableHead>
          <TableHead className="hidden sm:table-cell">Tipus</TableHead>
          <TableHead className="text-right">Data</TableHead>
          <TableHead>
            <span className="sr-only">Accions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>
              <div className="font-medium">
                {request.origin} → {request.destination}
              </div>
               <div className="hidden text-sm text-muted-foreground md:inline">
                ID: {request.id.slice(0, 8)}...
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge variant="outline" className="capitalize">
                {request.transportType}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {format(new Date(request.dates.from), 'dd MMM, yyyy', {
                locale: ca,
              })}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-haspopup="true"
                    size="icon"
                    variant="ghost"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Obrir menú</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Accions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/transports/${request.id}`}
                      className="w-full"
                    >
                      Veure detalls
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Contactar client</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const requestsQuery = useMemoFirebase(() => {
    if (!user) return null;
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

      <div className="grid gap-4 md:gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Sol·licituds Recents</CardTitle>
              <CardDescription>
                Les darreres sol·licituds de transport que has registrat.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/solicituts">
                Veure-les totes
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <RecentRequestsTable requests={requests} isLoading={requestsLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    
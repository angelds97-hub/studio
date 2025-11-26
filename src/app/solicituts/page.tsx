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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListFilter, File, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { TransportRequest, UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

function SolicitutsTable({
  requests,
  users,
  isLoading,
}: {
  requests: WithId<TransportRequest>[] | null;
  users: WithId<UserProfile>[] | null;
  isLoading: boolean;
}) {
  const getUserById = (id: string) => {
    return users?.find((user) => user.id === id);
  };
  
  if (isLoading) {
    return (
       <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Ruta</TableHead>
            <TableHead className="hidden md:table-cell">Tipus</TableHead>
            <TableHead className="hidden md:table-cell">Data</TableHead>
            <TableHead>Estat</TableHead>
            <TableHead>
              <span className="sr-only">Accions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                </TableRow>
            ))}
        </TableBody>
      </Table>
    )
  }

  if (!requests || requests.length === 0) {
      return (
        <div className="text-center py-16">
            <File className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No s'han trobat sol·licituds</h3>
            <p className="mt-2 text-sm text-muted-foreground">No tens cap sol·licitud de transport en aquesta categoria.</p>
        </div>
      )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Ruta</TableHead>
          <TableHead className="hidden md:table-cell">Tipus</TableHead>
          <TableHead className="hidden md:table-cell">Data</TableHead>
          <TableHead>Estat</TableHead>
          <TableHead>
            <span className="sr-only">Accions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((req) => {
          const user = getUserById(req.userProfileId);
          return (
            <TableRow key={req.id}>
              <TableCell>
                <div className="font-medium">
                  {user ? `${user.firstName} ${user.lastName}` : 'Desconegut'}
                </div>
                 <div className="text-sm text-muted-foreground hidden md:block">ID: {req.id.slice(0, 8)}...</div>
              </TableCell>
              <TableCell>{`${req.origin} → ${req.destination}`}</TableCell>
              <TableCell className="hidden md:table-cell capitalize">
                {req.transportType}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {format(new Date(req.dates.from), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    req.status === 'completada'
                      ? 'default'
                      : req.status === 'assignada'
                      ? 'secondary'
                      : 'outline'
                  }
                  className="capitalize"
                >
                  {req.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/transports/${req.id}`}>Veure</Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default function SolicitutsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = useState('totes');

  // Query for all users to map names later
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);
  const { data: users, isLoading: usersLoading } = useCollection<UserProfile>(usersQuery);

  const requestsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    
    const baseQuery = collection(firestore, 'users', user.uid, 'transportRequests');

    if (activeTab === 'totes') {
        return query(baseQuery);
    } else {
        return query(baseQuery, where('status', '==', activeTab));
    }
  }, [user, firestore, activeTab]);

  const { data: requests, isLoading: requestsLoading } = useCollection<TransportRequest>(requestsQuery);

  return (
    <Tabs defaultValue="totes" onValueChange={setActiveTab}>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="totes">Totes</TabsTrigger>
          <TabsTrigger value="oberta">Obertes</TabsTrigger>
          <TabsTrigger value="assignada">Assignades</TabsTrigger>
          <TabsTrigger value="completada">Completades</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1" asChild>
            <Link href="/solicituts/nova">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Nova Sol·licitud
              </span>
            </Link>
          </Button>
        </div>
      </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Sol·licituds de Transport</CardTitle>
            <CardDescription>
              Gestiona totes les teves sol·licituds de transport des d'un sol lloc.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="totes" forceMount>
                 <SolicitutsTable requests={requests} users={users} isLoading={requestsLoading || usersLoading} />
            </TabsContent>
            <TabsContent value="oberta" forceMount>
                 <SolicitutsTable requests={requests} users={users} isLoading={requestsLoading || usersLoading} />
            </TabsContent>
             <TabsContent value="assignada" forceMount>
                 <SolicitutsTable requests={requests} users={users} isLoading={requestsLoading || usersLoading} />
            </TabsContent>
             <TabsContent value="completada" forceMount>
                 <SolicitutsTable requests={requests} users={users} isLoading={requestsLoading || usersLoading} />
            </TabsContent>
          </CardContent>
        </Card>
    </Tabs>
  );
}

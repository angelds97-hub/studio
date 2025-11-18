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
import { useCollection, useFirestore, useUser, useMemoFirebase, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import React from 'react';

function UsersTable({
  users,
  isLoading,
  error
}: {
  users: WithId<UserProfile>[] | null;
  isLoading: boolean;
  error: Error | null;
}) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Correu Electrònic</TableHead>
            <TableHead>Rol</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (error) {
     return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Error de Permisos</AlertTitle>
        <AlertDescription>
          No s'ha pogut carregar la llista d'usuaris. Assegura't que les regles de seguretat de Firestore permeten als administradors llistar usuaris.
        </AlertDescription>
      </Alert>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <h3 className="mt-2 text-lg font-semibold">No s'han trobat usuaris</h3>
        <p className="mt-1 text-sm">
          No hi ha usuaris registrats a la plataforma.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Correu Electrònic</TableHead>
          <TableHead>Rol</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{`${user.firstName} ${user.lastName}`}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge
                variant={
                  user.role === 'administrador'
                    ? 'default'
                    : user.role === 'treballador'
                    ? 'secondary'
                    : 'outline'
                }
              >
                {user.role}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AdminUserManagement() {
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading: usersLoading, error: usersError } = useCollection<UserProfile>(usersQuery);

  return (
     <Card>
      <CardHeader>
        <CardTitle>Gestió d'Usuaris</CardTitle>
        <CardDescription>
          Visualitza i gestiona els usuaris de la plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UsersTable users={users} isLoading={usersLoading} error={usersError} />
      </CardContent>
    </Card>
  );
}


export default function UserManagementPage() {
  const firestore = useFirestore();
  const { user: currentUser } = useUser();

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !currentUser) return null;
    return doc(firestore, 'users', currentUser.uid);
  }, [firestore, currentUser]);

  const { data: profile, isLoading: profileLoading } = useDoc<UserProfile>(profileRef);

  if (profileLoading) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (profile?.role !== 'administrador') {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Accés Denegat</AlertTitle>
        <AlertDescription>
          No tens permisos per accedir a aquesta pàgina.
        </AlertDescription>
      </Alert>
    );
  }

  return <AdminUserManagement />;
}

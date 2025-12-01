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
  useCollection,
  useFirestore,
  useUser,
  useMemoFirebase,
  useDoc,
  useAuth,
} from '@/firebase';
import {
  collection,
  doc,
  deleteDoc,
  setDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import type { UserProfile, RegistrationRequest, WithId } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ShieldAlert,
  MoreHorizontal,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { users as mockUsers } from '@/lib/data';


function UsersTable({
  users,
  isLoading,
  currentUserId,
}: {
  users: WithId<UserProfile>[] | null;
  isLoading: boolean;
  currentUserId: string | undefined;
}) {
  const { toast } = useToast();

  const handleRoleChange = async (userId: string, newRole: UserProfile['role']) => {
    toast({
        title: 'Funcionalitat no disponible',
        description: "En una web estàtica, els rols es canvien manualment al fitxer 'src/lib/data.ts'.",
        variant: 'destructive',
    });
  };

  const handleDeleteUser = async (userId: string) => {
     toast({
        title: 'Funcionalitat no disponible',
        description: "En una web estàtica, els usuaris s'eliminen manualment del fitxer 'src/lib/data.ts'.",
        variant: 'destructive',
    });
  };

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Correu Electrònic</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>
              <span className="sr-only">Accions</span>
            </TableHead>
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
              <TableCell>
                <Skeleton className="h-8 w-8 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
          <TableHead>
            <span className="sr-only">Accions</span>
          </TableHead>
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
            <TableCell>
              {user.id !== currentUserId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Obrir menú</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Accions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Canviar Rol
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={() =>
                            handleRoleChange(user.id, 'administrador')
                          }
                        >
                          Administrador
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleRoleChange(user.id, 'treballador')
                          }
                        >
                          Treballador
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleRoleChange(user.id, 'client/proveidor')
                          }
                        >
                          Client/Proveïdor
                        </DropdownMenuItem>
                         <DropdownMenuItem
                          onClick={() =>
                            handleRoleChange(user.id, 'extern')
                          }
                        >
                          Extern
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Eliminar Usuari
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function RegistrationRequestsTable({
  requests,
  isLoading,
  error,
}: {
  requests: any[] | null;
  isLoading: boolean;
  error: Error | null;
}) {

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
      <div className="text-center py-10 text-muted-foreground">
        <h3 className="mt-2 text-lg font-semibold">
          Gestió Manual
        </h3>
        <p className="mt-1 text-sm max-w-md mx-auto">
         Les sol·licituds de registre s'envien a través de Formspree. Per aprovar un usuari nou, afegeix-lo manualment a l'array `users` al fitxer `src/lib/data.ts` i torna a compilar l'aplicació.
        </p>
      </div>
    );
}

function AdminUserManagement({ user }: { user: WithId<UserProfile> }) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestió d'Usuaris</CardTitle>
        <CardDescription>
          Visualitza els usuaris actius i gestiona les sol·licituds de registre.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Usuaris Actius</TabsTrigger>
            <TabsTrigger value="requests">
              Sol·licituds
            </TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-4">
            <UsersTable
              users={mockUsers}
              isLoading={false}
              currentUserId={user.id}
            />
          </TabsContent>
          <TabsContent value="requests" className="mt-4">
            <RegistrationRequestsTable
              requests={[]}
              isLoading={false}
              error={null}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default function UserManagementPage() {
    const [profile, setProfile] = useState<WithId<UserProfile> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setProfile(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);


  if (isLoading) {
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

  return <AdminUserManagement user={profile} />;
}

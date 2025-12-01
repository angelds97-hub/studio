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
} from '@/firebase';
import {
  collection,
  doc,
  deleteDoc,
  setDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import type { UserProfile, RegistrationRequest, WithId } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ShieldAlert,
  MoreHorizontal,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import React from 'react';
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


function UsersTable({
  users,
  isLoading,
  error,
  currentUserId,
}: {
  users: WithId<UserProfile>[] | null;
  isLoading: boolean;
  error: Error | null;
  currentUserId: string | undefined;
}) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleRoleChange = async (userId: string, newRole: UserProfile['role']) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', userId);
    try {
      await setDoc(userRef, { role: newRole }, { merge: true });
      toast({
        title: 'Rol actualitzat',
        description: `L'usuari ha estat actualitzat a ${newRole}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: "No s'ha pogut actualitzar el rol.",
      });
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!firestore) return;
    if (
      !window.confirm(
        "Estàs segur que vols eliminar aquest usuari? Aquesta acció no es pot desfer."
      )
    )
      return;

    const userRef = doc(firestore, 'users', userId);
    try {
      await deleteDoc(userRef);
      toast({
        title: 'Usuari eliminat',
        description: "L'usuari ha estat eliminat correctament.",
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: "No s'ha pogut eliminar l'usuari.",
      });
      console.error(error);
    }
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

  if (error) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Error de Permisos</AlertTitle>
        <AlertDescription>
          No s'ha pogut carregar la llista d'usuaris. Assegura't que les regles
          de seguretat de Firestore permeten als administradors llistar usuaris.
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
  requests: WithId<RegistrationRequest>[] | null;
  isLoading: boolean;
  error: Error | null;
}) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleApprove = async (request: WithId<RegistrationRequest>) => {
     if (!firestore) return;
     if (!window.confirm(`Estàs segur que vols aprovar el registre de ${request.firstName} ${request.lastName}?`)) return;

    const newUserId = doc(collection(firestore, 'users')).id; // Generate a new ID
    const newUserRef = doc(firestore, "users", newUserId);
    const requestRef = doc(firestore, "registrationRequests", request.id);
    
    const newUserProfile: Omit<UserProfile, 'id' | 'creationDate'> = {
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        role: "client/proveidor", // Default role
    };

    try {
        const batch = writeBatch(firestore);

        batch.set(newUserRef, {
            ...newUserProfile,
            id: newUserId,
            creationDate: serverTimestamp()
        });

        batch.delete(requestRef);

        await batch.commit();

        toast({
            title: "Usuari Aprovat",
            description: `${request.firstName} ${request.lastName} ha estat afegit a la plataforma. Hauràs de crear les seves credencials d'autenticació.`,
        });

    } catch (e: any) {
        console.error("Error approving request: ", e);
        
        if (e.code === 'permission-denied') {
             const permissionError = new FirestorePermissionError({
                path: newUserRef.path,
                operation: 'create',
                requestResourceData: newUserProfile,
            });
            errorEmitter.emit('permission-error', permissionError);
        }

        toast({
            variant: "destructive",
            title: "Error en aprovar",
            description: e.message || "No s'ha pogut aprovar la sol·licitud. Revisa els permisos.",
        });
    }
  };

  const handleReject = async (requestId: string) => {
     if (!firestore) return;
     if (!window.confirm("Estàs segur que vols rebutjar aquesta sol·licitud?")) return;

    const requestRef = doc(firestore, 'registrationRequests', requestId);
    try {
      await deleteDoc(requestRef);
      toast({
        title: 'Sol·licitud Rebutjada',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: "No s'ha pogut rebutjar la sol·licitud.",
      });
      console.error(error);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Error de Permisos</AlertTitle>
        <AlertDescription>
          No s'han pogut carregar les sol·licituds de registre.
        </AlertDescription>
      </Alert>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <h3 className="mt-2 text-lg font-semibold">
          No hi ha sol·licituds pendents
        </h3>
        <p className="mt-1 text-sm">
          No hi ha cap usuari esperant aprovació en aquests moments.
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
          <TableHead className="text-right">Accions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{`${request.firstName} ${request.lastName}`}</TableCell>
            <TableCell>{request.email}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => handleApprove(request)}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Aprovar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => handleReject(request.id)}
              >
                <XCircle className="mr-2 h-4 w-4" /> Rebutjar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AdminUserManagement({ user }: { user: WithId<UserProfile> }) {
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const requestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'registrationRequests');
  }, [firestore]);

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useCollection<UserProfile>(usersQuery);

  const {
    data: requests,
    isLoading: requestsLoading,
    error: requestsError,
  } = useCollection<RegistrationRequest>(requestsQuery);
  const pendingRequestsCount = requests?.length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestió d'Usuaris</CardTitle>
        <CardDescription>
          Visualitza, gestiona els usuaris i aprova noves sol·licituds de
          registre.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Usuaris Actius</TabsTrigger>
            <TabsTrigger value="requests">
              Sol·licituds Pendents
              {pendingRequestsCount > 0 && (
                <Badge className="ml-2">{pendingRequestsCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-4">
            <UsersTable
              users={users}
              isLoading={usersLoading}
              error={usersError}
              currentUserId={user.id}
            />
          </TabsContent>
          <TabsContent value="requests" className="mt-4">
            <RegistrationRequestsTable
              requests={requests}
              isLoading={requestsLoading}
              error={requestsError}
            />
          </TabsContent>
        </Tabs>
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

  const { data: profile, isLoading: profileLoading } =
    useDoc<UserProfile>(profileRef);

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

  return <AdminUserManagement user={profile} />;
}

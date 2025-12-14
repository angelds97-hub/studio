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
import type { UserProfile, WithId } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, History } from 'lucide-react';
import React, { useState, useEffect } from 'react';

type Shipment = {
  id: string;
  client: string;
  desti: string;
  descripcio: string;
  estat: 'Pendent' | 'En preparació' | 'En trànsit' | 'Duanes' | 'Lliurat';
};

function UsersTable({
  users,
  isLoading,
}: {
  users: UserProfile[] | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Correu Electrònic</TableHead>
            <TableHead>Empresa</TableHead>
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
                <Skeleton className="h-5 w-24" />
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

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <h3 className="mt-2 text-lg font-semibold">No s'han trobat usuaris</h3>
        <p className="mt-1 text-sm">
          No hi ha usuaris registrats a la base de dades externa.
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
          <TableHead>Empresa</TableHead>
          <TableHead>Rol</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={user.id || index}>
            <TableCell className="font-medium">{`${user.firstName} ${user.lastName}`}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.empresa}</TableCell>
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

function ShipmentHistory({
  shipments,
  companyName,
  isLoading,
  error
}: {
  shipments: Shipment[] | null;
  companyName: string;
  isLoading: boolean;
  error: string | null;
}) {
  const companyShipments = shipments?.filter(s => s.client === companyName) || [];

   if (error) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
       <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Enviament</TableHead>
            <TableHead>Destí</TableHead>
            <TableHead>Descripció</TableHead>
            <TableHead>Estat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-48" /></TableCell>
              <TableCell><Skeleton className="h-6 w-28" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (companyShipments.length === 0) {
    return (
       <div className="text-center py-16 text-muted-foreground">
        <History className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">No hi ha historial d'enviaments</h3>
        <p className="mt-1 text-sm max-w-md mx-auto">
          No s'han trobat enviaments associats a l'empresa '{companyName}'.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID Enviament</TableHead>
          <TableHead>Destí</TableHead>
          <TableHead>Descripció</TableHead>
          <TableHead>Estat</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companyShipments.map((shipment) => (
          <TableRow key={shipment.id}>
            <TableCell className="font-mono text-xs">{shipment.id}</TableCell>
            <TableCell>{shipment.desti}</TableCell>
            <TableCell>{shipment.descripcio}</TableCell>
            <TableCell>
              <Badge variant="outline">{shipment.estat}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


export default function UserManagementPage() {
  const [profile, setProfile] = useState<WithId<UserProfile> | null>(null);
  const [users, setUsers] = useState<UserProfile[] | null>(null);
  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setProfile(parsedUser);

      if (parsedUser.role === 'administrador') {
        fetchUsers();
      } else {
        fetchShipments();
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUsers = async () => {
      try {
        const response = await fetch('https://sheetdb.io/api/v1/sjvdps9wa0f8z?sheet=usuaris');
        if (!response.ok) {
          throw new Error("No s'ha pogut carregar la llista d'usuaris.");
        }
        const data = await response.json();
        const mappedUsers: UserProfile[] = data.map((item: any) => {
             const [firstName, ...lastNameParts] = item.treballador.split(' ');
             return {
                id: item.usuari,
                email: item.usuari,
                firstName: firstName,
                lastName: lastNameParts.join(' '),
                role: item.rol.toLowerCase(),
                empresa: item.empresa
             }
        });
        setUsers(mappedUsers);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
  
  const fetchShipments = async () => {
    try {
        const response = await fetch('https://sheetdb.io/api/v1/sjvdps9wa0f8z?sheet=seguiment');
        if (!response.ok) {
            throw new Error("No s'ha pogut carregar l'historial d'enviaments.");
        }
        const data = await response.json();
        setShipments(data);
    } catch(e: any) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  }


  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
     return (
       <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Accés Denegat</AlertTitle>
        <AlertDescription>
          No s'ha pogut verificar la teva sessió. Si us plau, torna a iniciar sessió.
        </AlertDescription>
      </Alert>
     )
  }

  if (profile.role === 'administrador') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestió d'Usuaris</CardTitle>
          <CardDescription>
            Visualitza els usuaris actius de la plataforma des de la base de dades externa (Google Sheets).
          </CardDescription>
        </CardHeader>
        <CardContent>
           {error ? (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <UsersTable users={users} isLoading={isLoading} />
          )}
        </CardContent>
      </Card>
    )
  }

  // Vista para clientes/proveedores
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial d'Enviaments de la teva Empresa</CardTitle>
        <CardDescription>
          Aquí pots veure totes les comandes associades a la teva empresa,{' '}
          <span className="font-bold text-primary">{profile.empresa}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ShipmentHistory shipments={shipments} companyName={profile.empresa || ''} isLoading={isLoading} error={error} />
      </CardContent>
    </Card>
  )
}

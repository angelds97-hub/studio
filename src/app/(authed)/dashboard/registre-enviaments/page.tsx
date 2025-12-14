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
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, History } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { UserProfile } from '@/lib/types';

type Shipment = {
  id: string;
  client: string;
  desti: string;
  descripcio: string;
  estat: 'Pendent' | 'En preparació' | 'En trànsit' | 'Duanes' | 'Lliurat';
};

function FullShipmentHistory({
  shipments,
  isLoading,
  error,
}: {
  shipments: Shipment[] | null;
  isLoading: boolean;
  error: string | null;
}) {
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
            <TableHead>Client</TableHead>
            <TableHead>Destí</TableHead>
            <TableHead>Descripció</TableHead>
            <TableHead>Estat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-28" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (!shipments || shipments.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <History className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">
          No hi ha cap enviament registrat
        </h3>
        <p className="mt-1 text-sm max-w-md mx-auto">
          El registre d'enviaments de la base de dades externa està buit.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID Enviament</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Destí</TableHead>
          <TableHead>Descripció</TableHead>
          <TableHead>Estat</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shipments.map((shipment) => (
          <TableRow key={shipment.id}>
            <TableCell className="font-mono text-xs">{shipment.id}</TableCell>
            <TableCell className="font-medium">{shipment.client}</TableCell>
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

export default function GlobalShipmentRegistryPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setProfile(parsedUser);

      if (
        parsedUser.role === 'administrador' ||
        parsedUser.role === 'treballador'
      ) {
        fetchShipments();
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchShipments = async () => {
    try {
      const response = await fetch(
        'https://sheetdb.io/api/v1/sjvdps9wa0f8z?sheet=seguiment'
      );
      if (!response.ok) {
        throw new Error("No s'ha pogut carregar el registre d'enviaments.");
      }
      const data = await response.json();
      setShipments(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!profile || (profile.role !== 'administrador' && profile.role !== 'treballador')) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Accés Denegat</AlertTitle>
        <AlertDescription>
          No tens permís per veure aquesta pàgina. Contacta amb un
          administrador.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registre Global d'Enviaments</CardTitle>
        <CardDescription>
          Visualitza tots els enviaments registrats a la plataforma des de la
          base de dades externa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FullShipmentHistory
          shipments={shipments}
          isLoading={isLoading}
          error={error}
        />
      </CardContent>
    </Card>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, History, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import type { UserProfile } from '@/lib/types';
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

type Shipment = {
  id: string;
  client: string;
  desti: string;
  descripcio: string;
  estat: 'Pendent' | 'En preparació' | 'En trànsit' | 'Duanes' | 'Lliurat';
};

function ShipmentHistoryTable({
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
            <TableHead>Destí</TableHead>
            <TableHead>Descripció</TableHead>
            <TableHead>Estat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-24" />
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
      <div className="text-center py-16 text-muted-foreground border rounded-lg">
        <History className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">
          No hi ha historial d'enviaments
        </h3>
        <p className="mt-1 text-sm max-w-md mx-auto">
          Encara no s'han registrat enviaments per a la teva empresa.
        </p>
      </div>
    );
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
        {shipments.map((shipment) => (
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

export default function SolicitutsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setProfile(parsedUser);
      if (parsedUser.empresa) {
        fetchShipments(parsedUser.empresa);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchShipments = async (companyName: string) => {
    try {
      const response = await fetch(
        `https://sheetdb.io/api/v1/sjvdps9wa0f8z/search?client=${companyName}&sheet=seguiment`
      );
      if (!response.ok) {
        throw new Error("No s'ha pogut carregar l'historial d'enviaments.");
      }
      const data = await response.json();
      setShipments(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const companyShipments =
    shipments?.filter((s) => s.client === profile?.empresa) || [];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">
              Gestió de Sol·licituds
            </CardTitle>
            <CardDescription>
              Crea noves sol·licituds de transport i consulta el teu historial
              d'enviaments.
            </CardDescription>
          </div>
          <Button size="lg" asChild>
            <Link href="/solicituts/nova">
              <PlusCircle className="mr-2 h-5 w-5" />
              Crear Nova Sol·licitud
            </Link>
          </Button>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Historial d'Enviaments</CardTitle>
          <CardDescription>
            Aquí pots veure totes les comandes associades a la teva empresa,{' '}
            <span className="font-bold text-primary">{profile?.empresa}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ShipmentHistoryTable
            shipments={companyShipments}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
}

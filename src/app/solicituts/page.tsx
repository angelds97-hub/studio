'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, PlusCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SolicitutsInfoPage() {
  return (
    <div className="container py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tornar al Panell
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Les Teves Sol·licituds de Transport
            </CardTitle>
            <CardDescription>
              Crea i gestiona les teves peticions de transport. Totes les
              comunicacions es faran per correu electrònic.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-16">
            <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-6 text-xl font-semibold">
              Gestió centralitzada per correu
            </h3>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
              Quan envies una sol·licitud de transport, el nostre equip la rep
              instantàniament. Ens posarem en contacte amb tu per correu per
              confirmar detalls, assignar un transportista i mantenir-te
              informat sobre l'estat.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/solicituts/nova">
                <PlusCircle className="mr-2 h-5 w-5" />
                Crear una Nova Sol·licitud
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

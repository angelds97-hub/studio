'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function SolicitutsInfoPage() {

  return (
     <div className="container py-12">
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Gestió de Sol·licituds</CardTitle>
                    <CardDescription>
                    Aquí trobaràs informació sobre com gestionem les teves sol·licituds de transport.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-16">
                     <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
                    <h3 className="mt-6 text-xl font-semibold">El teu portal de sol·licituds</h3>
                    <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
                        Totes les sol·licituds de transport que envies a través del nostre formulari són rebudes i processades pel nostre equip d'administradors.
                    </p>
                     <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
                        Un cop hagis enviat una sol·licitud, un dels nostres agents es posarà en contacte amb tu per correu electrònic o telèfon per confirmar els detalls, assignar un transportista i informar-te sobre l'estat.
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

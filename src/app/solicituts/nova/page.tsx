'use client';
import { TransportRequestForm } from '@/components/transport-request-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NovaSolicitutPage() {
  return (
    <div className="container py-12">
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Crear una nova sol·licitud de transport</CardTitle>
                    <CardDescription>
                        Omple el formulari següent amb els detalls del transport que necessites. Com més informació proporcionis, millors seran les ofertes que rebràs.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TransportRequestForm />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

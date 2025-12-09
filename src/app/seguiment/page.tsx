'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Loader2,
  Search,
  AlertCircle,
  Package,
  Warehouse,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type Shipment = {
  id: string;
  client: string;
  desti: string;
  descripcio: string;
  estat: 'Pendent' | 'En preparació' | 'En trànsit' | 'Lliurat';
};

const statusSteps = [
  { name: 'Pendent', icon: Package },
  { name: 'En preparació', icon: Warehouse },
  { name: 'En trànsit', icon: Truck },
  { name: 'Lliurat', icon: CheckCircle },
];

export default function SeguimentPage() {
  const [trackingId, setTrackingId] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!trackingId) {
      setError('Si us plau, introdueix un número de seguiment.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setShipment(null);

    try {
      const response = await fetch(
        `https://sheetdb.io/api/v1/sjvdps9wa0f8z/search?id=${trackingId}`
      );
      if (!response.ok) {
        throw new Error('No s\'ha pogut connectar amb el servei de seguiment.');
      }
      const data: Shipment[] = await response.json();
      if (data && data.length > 0) {
        setShipment(data[0]);
      } else {
        setError(`No s'ha trobat cap enviament amb l'ID '${trackingId}'.`);
      }
    } catch (e) {
      setError(
        'Hi ha hagut un problema amb la connexió. Intenta-ho de nou més tard.'
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepIndex = shipment
    ? statusSteps.findIndex((step) => step.name === shipment.estat)
    : -1;

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Seguiment d'Enviaments
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Introdueix el teu codi de seguiment per veure l'estat actual del teu
          enviament en temps real.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Cercador d'Enviaments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Introdueix el teu número de seguiment (Ex: TRK-001)"
              className="text-base"
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              type="submit"
              onClick={handleSearch}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" /> Cercar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-8 max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {shipment && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Detalls de l'Enviament #{shipment.id}
            </CardTitle>
            <CardDescription>
              Enviament per a{' '}
              <span className="font-medium text-foreground">
                {shipment.client}
              </span>{' '}
              amb destí a{' '}
              <span className="font-medium text-foreground">
                {shipment.desti}
              </span>
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="font-semibold mb-4">Línia de temps de l'estat</h3>
              <div className="relative">
                {/* Progress Bar */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-muted rounded-full -translate-y-1/2">
                   <div 
                     className="h-full bg-primary rounded-full transition-all duration-500"
                     style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                   ></div>
                </div>
                {/* Timeline Steps */}
                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => (
                    <div
                      key={step.name}
                      className="flex flex-col items-center z-10"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          index <= currentStepIndex
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-background border-border text-muted-foreground'
                        }`}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                      <p
                        className={`mt-2 text-xs font-medium text-center ${
                          index <= currentStepIndex
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {step.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Estat Actual</p>
                <p className="font-bold text-lg text-primary">{shipment.estat}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Descripció</p>
                <p className="font-medium">{shipment.descripcio}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

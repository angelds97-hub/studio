'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Loader2,
  ShieldAlert,
  Send,
  History,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { UserProfile } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


type Comanda = {
  id: string;
  data_solicitud: string;
  usuari: string;
  detalls: string;
  estat: 'Pendent' | 'Aprovada' | 'Rebutjada';
};

function ComandaCard({ comanda }: { comanda: Comanda }) {
  const details = useMemo(() => {
    return comanda.detalls.split('|').map((part) => {
      const [key, ...valueParts] = part.split(':');
      const value = valueParts.join(':');
      return { key: key.trim(), value: value.trim() };
    });
  }, [comanda.detalls]);

  const getStatusBadge = (status: Comanda['estat']) => {
    switch (status) {
      case 'Pendent':
        return (
          <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400/80">
            Pendent
          </Badge>
        );
      case 'Aprovada':
        return (
          <Badge className="bg-green-500 text-white hover:bg-green-500/80">
            Aprovada
          </Badge>
        );
      case 'Rebutjada':
        return (
          <Badge className="bg-red-500 text-white hover:bg-red-500/80">
            Rebutjada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Comanda #{comanda.id}</CardTitle>
            <CardDescription>{comanda.data_solicitud}</CardDescription>
          </div>
          {getStatusBadge(comanda.estat)}
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          {details.map(({ key, value }) => (
            <React.Fragment key={key}>
              <dt className="font-semibold text-muted-foreground">{key}:</dt>
              <dd>{value}</dd>
            </React.Fragment>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

function ComandesList({
  comandes,
  isLoading,
  error,
  currentUserRole,
}: {
  comandes: Comanda[];
  isLoading: boolean;
  error: string | null;
  currentUserRole: UserProfile['role'];
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Error en carregar les comandes</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (comandes.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border rounded-lg">
        <History className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">No tens cap comanda</h3>
        <p className="mt-1 text-sm max-w-md mx-auto">
          Quan creïs una nova sol·licitud de servei, apareixerà aquí.
        </p>
      </div>
    );
  }

  const isAdminOrWorker =
    currentUserRole === 'administrador' || currentUserRole === 'treballador';

  return (
    <div className="space-y-4">
      {isAdminOrWorker && (
        <Alert>
          <AlertTitle>Mode Administrador</AlertTitle>
          <AlertDescription>
            Estàs veient totes les comandes perquè el teu rol és de{' '}
            {currentUserRole}.
          </AlertDescription>
        </Alert>
      )}
      {comandes.map((comanda) => (
        <ComandaCard key={comanda.id} comanda={comanda} />
      ))}
    </div>
  );
}

export default function ComandesPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [comandes, setComandes] = useState<Comanda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string>('');


  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setProfile(JSON.parse(storedUser));
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchComandes = async (userProfile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    try {
      const isAdminOrWorker =
        userProfile.role === 'administrador' ||
        userProfile.role === 'treballador';
      const url = isAdminOrWorker
        ? 'https://sheetdb.io/api/v1/sjvdps9wa0f8z?sheet=solicituds'
        : `https://sheetdb.io/api/v1/sjvdps9wa0f8z/search?usuari=${userProfile.email}&sheet=solicituds`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("No s'ha pogut connectar amb la base de dades.");
      }
      const data: Comanda[] = await response.json();
      setComandes(
        data.sort(
          (a, b) =>
            new Date(b.data_solicitud.split('/').reverse().join('-')).getTime() -
            new Date(a.data_solicitud.split('/').reverse().join('-')).getTime()
        )
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchComandes(profile);
    }
  }, [profile]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) {
      toast({
        variant: 'destructive',
        title: 'No has iniciat sessió',
        description: 'Has d\'iniciar sessió per crear una comanda.',
      });
      return;
    }
    setIsSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const tipusDeServei = formData.get('tipus-de-servei') as string;

    const detailsParts: string[] = [];
    detailsParts.push(`SERVEI: ${tipusDeServei}`);
    
    if (tipusDeServei === 'Transport') {
        const origen = formData.get('origen') as string;
        const desti = formData.get('desti') as string;
        detailsParts.push(`ORIGEN: ${origen}`);
        detailsParts.push(`DESTÍ: ${desti}`);
    }

    const descripcio = formData.get('descripcio') as string;
    
    let descLabel = 'DESCRIPCIÓ';
    if (tipusDeServei === 'Transport') descLabel = 'CÀRREGA';
    if (tipusDeServei === 'Emmagatzematge') descLabel = 'DETALLS';
    if (tipusDeServei === 'Consultoria') descLabel = 'CONSULTA';
    
    detailsParts.push(`${descLabel}: ${descripcio}`);

    const detalls = detailsParts.join(' | ');

    const today = new Date();
    const data_solicitud = `${today
      .getDate()
      .toString()
      .padStart(2, '0')}/${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${today.getFullYear()}`;

    const newComanda = {
      id: `REQ-${Date.now()}`,
      data_solicitud: data_solicitud,
      usuari: profile.email,
      detalls,
      estat: 'Pendent',
    };

    try {
      const response = await fetch(
        'https://sheetdb.io/api/v1/sjvdps9wa0f8z?sheet=solicituds',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: [newComanda] }),
        }
      );

      if (!response.ok) {
        throw new Error("No s'ha pogut enviar la sol·licitud.");
      }

      toast({
        title: 'Sol·licitud enviada correctament!',
        description: 'La teva nova comanda ha estat registrada.',
      });
      form.reset();
      setSelectedService('');
      await fetchComandes(profile); // Refresh the list
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Error en enviar',
        description:
          e.message ||
          "Hi ha hagut un problema. Intenta-ho de nou més tard.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile && !isLoading) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Accés Denegat</AlertTitle>
        <AlertDescription>
          Necessites iniciar sessió o registrar-te per gestionar les teves
          comandes.
        </AlertDescription>
      </Alert>
    );
  }

  const getInitials = () => {
    if (profile) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    }
    return 'U';
  };


  return (
    <div className="space-y-8">

      {profile && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Identificador de la Sol·licitud</CardTitle>
            <CardDescription>Aquesta comanda es crearà en nom de:</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{profile.firstName} {profile.lastName}</p>
              <p className="text-sm text-muted-foreground">{profile.email} ({profile.empresa})</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Nova Sol·licitud de Servei
          </CardTitle>
          <CardDescription>
            Omple el formulari per registrar una nova comanda de servei.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="tipus-de-servei">Tipus de Servei</Label>
                <Select name="tipus-de-servei" required onValueChange={setSelectedService} value={selectedService}>
                  <SelectTrigger id="tipus-de-servei">
                    <SelectValue placeholder="Selecciona un servei" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Emmagatzematge">
                      Emmagatzematge
                    </SelectItem>
                    <SelectItem value="Consultoria">Consultoria</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            
            {selectedService && (
            <div className="space-y-6">
                {selectedService === 'Transport' && (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="origen">Origen</Label>
                        <Input
                        id="origen"
                        name="origen"
                        placeholder="Ex: Barcelona"
                        required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="desti">Destí</Label>
                        <Input
                        id="desti"
                        name="desti"
                        placeholder="Ex: Lió"
                        required
                        />
                    </div>
                </div>
                )}
                
                <div className="space-y-2">
                    <Label htmlFor="descripcio">
                        {selectedService === 'Transport' ? 'Descripció de la Càrrega' : 
                         selectedService === 'Emmagatzematge' ? 'Detalls del Servei d\'Emmagatzematge' :
                         'Descripció de la Consulta'}
                    </Label>
                    <Textarea
                        id="descripcio"
                        name="descripcio"
                        placeholder={
                            selectedService === 'Transport' ? 'Ex: 3 palets, 500kg, mides 120x80x100cm' :
                            selectedService === 'Emmagatzematge' ? 'Ex: 5 palets europeus, 2 setmanes, material no perible' :
                            'Ex: Necessito ajuda per optimitzar les meves rutes de distribució.'
                        }
                        required
                        rows={4}
                    />
                </div>
            </div>
            )}

            <Button type="submit" disabled={isSubmitting || !selectedService}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? 'Enviant...' : 'Enviar Sol·licitud'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">
          Les meves Comandes
        </h2>
        {profile ? (
            <ComandesList
              comandes={comandes}
              isLoading={isLoading}
              error={error}
              currentUserRole={profile.role}
            />
        ) : (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
      </div>
    </div>
  );
}

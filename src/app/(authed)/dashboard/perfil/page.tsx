'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import type { UserProfile } from '@/lib/types';


export default function PerfilPage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
    }
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    fetch("https://formspree.io/f/xblnopqq", {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            toast({
              title: 'Sol·licitud enviada',
              description: "La teva sol·licitud de canvi de dades ha estat enviada. Es revisarà i aplicarà manualment.",
            });
        } else {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: "No s'ha pogut enviar la sol·licitud.",
            });
        }
    }).catch(() => {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: "No s'ha pogut enviar la sol·licitud.",
        });
    });
  };

  return (
    <div className="grid gap-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-headline font-bold">Perfil d'Usuari</h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informació Personal</CardTitle>
            <CardDescription>
              Envia una sol·licitud per actualitzar les teves dades personals.
              Aquests canvis seran revisats i aplicats manualment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nom</Label>
                  <Input id="firstName" name="firstName" placeholder="El teu nom" defaultValue={currentUser?.firstName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Cognom</Label>
                  <Input id="lastName" name="lastName" placeholder="El teu cognom" defaultValue={currentUser?.lastName} />
                </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="email">Correu Electrònic (no editable)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    readOnly
                  />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <input type="hidden" name="_subject" value={`Sol·licitud de canvi de dades per a ${currentUser?.email}`} />
            <Button type="submit">Enviar Sol·licitud de Canvi</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

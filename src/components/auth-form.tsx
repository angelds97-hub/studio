'use client';

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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

export function AuthForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(
        `https://sheetdb.io/api/v1/sjvdps9wa0f8z/search?usuari=${email}&password=${password}&sheet=usuaris`
      );
      if (!response.ok) {
        throw new Error("No s'ha pogut connectar amb el servei d'autenticació.");
      }
      const data: any[] = await response.json();

      if (data && data.length > 0) {
        const userData = data[0];
        const [firstName, ...lastNameParts] = userData.treballador.split(' ');
        const foundUser = {
          id: userData.id || email, // SheetDB might not have a dedicated ID column, use email as fallback
          firstName: firstName,
          lastName: lastNameParts.join(' '),
          email: userData.usuari,
          role: userData.rol.toLowerCase(),
        };

        toast({
          title: 'Sessió iniciada correctament',
          description: `Benvingut/da de nou, ${foundUser.firstName}.`,
        });
        localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error d\'inici de sessió',
          description: 'Les credencials introduïdes no són correctes.',
        });
        setIsProcessing(false);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error de connexió',
        description: error.message || "No s'ha pogut contactar el servidor. Intenta-ho de nou.",
      });
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <Link href="/" className="mx-auto mb-4">
          <Truck className="h-12 w-12 text-primary" />
        </Link>
        <CardTitle className="font-headline text-2xl">
          Benvingut/da a EnTrans
        </CardTitle>
        <CardDescription>
          Introdueix les teves credencials per accedir a la teva àrea personal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correu Electrònic</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="correu@exemple.com"
              required
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contrasenya</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              required
              disabled={isProcessing}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? 'Iniciant...' : 'Iniciar Sessió'}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm border-t pt-4">
          Encara no tens accés?{' '}
          <Link
            href="/registre"
            className="underline font-semibold text-primary"
          >
            Sol·licita l'alta a l'Àrea Client
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

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

export function AuthForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("https://formspree.io/f/xblnopqq", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: 'Notificació d\'inici de sessió enviada',
          description: 'Hem notificat a l\'administrador el teu intent d\'accés. Seràs redirigit al panell de control.',
          duration: 5000,
        });
        // Redirect to dashboard as if login was successful
        setTimeout(() => {
            router.push('/dashboard');
        }, 1000);
      } else {
        throw new Error("No s'ha pogut enviar la notificació.");
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: "Hi ha hagut un problema. Si us plau, contacta amb el suport.",
      });
    } finally {
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
          Aquesta àrea és per a usuaris registrats. Introdueix les teves dades per notificar el teu accés.
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
              />
            </div>
            <input type="hidden" name="_subject" value="Intent d'inici de sessió a EnTrans" />
            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? 'Enviant...' : 'Iniciar Sessió'}
            </Button>
          </form>
        <div className="mt-6 text-center text-sm border-t pt-4">
            Encara no tens accés?{' '}
            <Link href="/registre" className="underline font-semibold text-primary">
              Sol·licita l'alta a l'Àrea Client
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}

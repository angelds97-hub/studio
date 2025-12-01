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
import { users } from '@/lib/data';

export function AuthForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      toast({
        title: 'Sessió iniciada correctament',
        description: `Benvingut/da de nou, ${foundUser.firstName}.`,
      });
      // Store user info in localStorage to simulate session
      localStorage.setItem('loggedInUser', JSON.stringify({
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        role: foundUser.role,
      }));
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error d\'inici de sessió',
        description: 'Les credencials introduïdes no són correctes.',
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

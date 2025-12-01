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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Truck, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
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
          title: 'Sol·licitud enviada!',
          description: "La teva petició d'alta ha estat enviada correctament. Ens posarem en contacte aviat.",
          duration: 5000,
        });
        (event.target as HTMLFormElement).reset();
        router.push('/login');
      } else {
        throw new Error("No s'ha pogut enviar la sol·licitud.");
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error en la sol·licitud',
        description: "No s'ha pogut enviar la teva sol·licitud. Si us plau, intenta-ho de nou més tard.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-background">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader className="text-center">
            <Link href="/" className="mx-auto mb-4">
              <Truck className="h-12 w-12 text-primary" />
            </Link>
            <CardTitle className="font-headline text-2xl">
              Sol·licitud d'Alta a l'Àrea Client
            </CardTitle>
            <CardDescription>
              Omple les teves dades professionals i et donarem accés a la plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'Empresa</Label>
                <Input id="companyName" name="companyName" placeholder="La teva empresa S.L." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">NIF/CIF</Label>
                <Input id="taxId" name="taxId" placeholder="B12345678" required />
              </div>
               <div className="grid sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="contactName">Nom de contacte</Label>
                    <Input id="contactName" name="contactName" placeholder="El teu nom" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone">Telèfon</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="600 123 456" required />
                </div>
               </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correu Electrònic de Contacte</Label>
                <Input id="email" name="email" type="email" placeholder="correu@exemple.com" required />
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Un cop verificades les dades, el nostre departament d'operacions us enviarà les credencials d'accés per correu electrònic.
              </p>
              <input type="hidden" name="_subject" value="Nova Sol·licitud d'Alta a EnTrans!" />
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? 'Enviant...' : 'Enviar Sol·licitud'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <Link href="/login" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Tornar a l'inici de sessió
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

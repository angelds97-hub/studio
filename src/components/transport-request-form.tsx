'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MapPin } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import type { UserProfile } from '@/lib/types';

export function TransportRequestForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Aquest codi s'executa només al client, després que el component s'hagi muntat.
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("No s'ha pogut llegir l'usuari del localStorage", e);
      }
    }
  }, []);

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
          description: "La teva sol·licitud de transport ha estat rebuda. Ens posarem en contacte aviat.",
          duration: 5000,
        });
        (event.target as HTMLFormElement).reset();
        // Optionally, redirect the user after a short delay
        setTimeout(() => router.push('/solicituts'), 2000);
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
    <div className="space-y-8">
      <form 
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Camps ocults per enviar les dades de l'usuari */}
        {currentUser && (
          <>
            <input type="hidden" name="nom_usuari" value={`${currentUser.firstName} ${currentUser.lastName}`} />
            <input type="hidden" name="email_usuari" value={currentUser.email} />
            <input type="hidden" name="empresa_usuari" value={currentUser.empresa || 'N/A'} />
          </>
        )}

        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <Label>Tipus de Transport</Label>
                <Input value="Càrrega de mercaderies" disabled />
                <input type="hidden" name="transportType" value="càrrega" />
                <p className="text-sm text-muted-foreground">Actualment només gestionem transport de mercaderies.</p>
            </div>

            <div className="space-y-2">
                <Label>Dates del Transport</Label>
                 <Input name="dates" placeholder="DD/MM/AAAA - DD/MM/AAAA" required />
                <p className="text-sm text-muted-foreground">Escriu les dates d'inici i final del transport.</p>
            </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <Label>Adreça d'Origen</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="origin" placeholder="Carrer de Sants, 123, Barcelona" className="pl-10" required />
                </div>
                 <p className="text-sm text-muted-foreground">Introdueix l'adreça completa de recollida.</p>
            </div>
             <div className="space-y-2">
                <Label>Adreça de Destinació</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="destination" placeholder="Avinguda del Port, 456, València" className="pl-10" required />
                </div>
                <p className="text-sm text-muted-foreground">Introdueix l'adreça completa de lliurament.</p>
            </div>
        </div>

        <div className="space-y-2">
            <Label>Requisits Especials</Label>
            <Textarea name="specialRequirements" placeholder="Descriu qualsevol necessitat especial (ex: refrigeració, material fràgil...)" />
        </div>
        
        <input type="hidden" name="_subject" value={`Nova Sol·licitud de Transport de ${currentUser?.empresa || currentUser?.email || ''}!`} />

        <Button type="submit" disabled={isProcessing}>{isProcessing ? 'Enviant...' : 'Enviar Sol·licitud'}</Button>
      </form>

    </div>
  );
}

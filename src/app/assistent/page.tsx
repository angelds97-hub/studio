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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Wand2, BrainCircuit } from 'lucide-react';

export default function AssistantPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Si us plau, descriu la teva situació.',
      });
      return;
    }

    setIsLoading(true);
    setAdvice('');

    try {
      const response = await fetch('/.netlify/functions/incoterms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Error de xarxa: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setAdvice(result.advice);
    } catch (error: any) {
      console.error('Error fetching Incoterm advice:', error);
      toast({
        variant: 'destructive',
        title: 'Error en la consulta',
        description:
          "No s'ha pogut obtenir la recomanació. Si us plau, intenta-ho de nou més tard.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <BrainCircuit className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline">
            Assistent d'Incoterms
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            Descriu la teva operació de compravenda internacional i la nostra IA
            et recomanarà l'Incoterm 2020 més adequat per a tu.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fes la teva consulta</CardTitle>
            <CardDescription>
              Explica qui ets (venedor/comprador) i quines responsabilitats
              vols assumir o evitar (transport, assegurança, tràmits, etc.).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="query">
                  Descriu la teva situació
                </Label>
                <Textarea
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Exemple: Sóc el venedor. Vull lliurar la mercaderia al port de Barcelona i que el comprador s'encarregui de tot a partir d'allà, inclosa la càrrega al vaixell."
                  rows={5}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Consultant...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Obtenir Recomanació
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {advice && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-6 w-6 text-primary" />
                Recomanació de la IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap"
              >
                {advice}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

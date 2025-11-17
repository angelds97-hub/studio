"use client";

import React, { useState, useTransition } from 'react';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import { summarizeTransportOffers } from '@/ai/flows/summarize-transport-offers';
import type { TransportOffer } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface OfferSummaryProps {
  offers: TransportOffer[];
}

function formatOffersForAI(offers: TransportOffer[]): string {
  return offers
    .map(
      (offer, index) =>
        `Oferta ${index + 1}:
- Companyia: ${offer.company.name} (Valoració: ${offer.company.rating}/5)
- Preu: ${offer.price} EUR
- Vehicle: ${offer.vehicle}
- Arribada estimada: ${offer.estimatedArrival.toLocaleDateString()}`
    )
    .join('\n\n');
}

export function OfferSummary({ offers }: OfferSummaryProps) {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = () => {
    startTransition(async () => {
      setError(null);
      setSummary(null);
      const offersAsString = formatOffersForAI(offers);
      try {
        const result = await summarizeTransportOffers({ transportOffers: offersAsString });
        setSummary(result.summary);
      } catch (e) {
        console.error(e);
        setError('No s\'ha pogut generar el resum. Intenta-ho de nou.');
      }
    });
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleSummarize} disabled={isPending} className="gap-2">
        <Sparkles className="h-4 w-4" />
        {isPending ? 'Analitzant ofertes...' : 'Resumeix les ofertes amb IA'}
      </Button>

      {error && <p className="text-destructive">{error}</p>}
      
      {isPending && (
         <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
         </Card>
      )}

      {summary && (
        <Card className="bg-accent/30 border-accent">
          <CardHeader>
            <CardTitle>Resum de les Ofertes</CardTitle>
            <CardDescription>Anàlisi realitzada per la nostra IA per ajudar-te a decidir.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

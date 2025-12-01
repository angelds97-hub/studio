'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  MapPin,
  Truck,
  User,
  Star,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { OfferSummary } from '@/components/offer-summary';
import type { TransportRequest, UserProfile, TransportOffer } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


interface TransportDetailProps {
    request: TransportRequest;
    requesterProfile: UserProfile | null;
    offers: TransportOffer[];
}


export default function TransportDetail({ request, requesterProfile, offers }: TransportDetailProps) {

  const requesterName = requesterProfile
    ? `${requesterProfile.firstName} ${requesterProfile.lastName}`
    : 'Carregant...';
  const requesterAvatar = requesterProfile?.avatarUrl || `https://avatar.vercel.sh/${requesterProfile?.email}.png`;


  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Detalls de la Sol·licitud
            </CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription>ID: {request.id}</CardDescription>
              <Badge
                variant={
                  request.status === 'completada'
                    ? 'default'
                    : request.status === 'assignada'
                    ? 'secondary'
                    : 'outline'
                }
                className="capitalize"
              >
                {request.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Client</p>
                  <p className="font-medium">{requesterName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Tipus de Transport</p>
                  <p className="font-medium capitalize">
                    {request.transportType}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Ruta</p>
                  <p className="font-medium">
                    {request.origin} → {request.destination}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Dates</p>
                  <p className="font-medium">
                    {format(new Date(request.dates.from), 'd MMM yyyy', { locale: ca })}{' '}
                    -{' '}
                    {request.dates.to ? format(new Date(request.dates.to), 'd MMM yyyy', { locale: ca }) : 'Oberta'}
                  </p>
                </div>
              </div>
            </div>
            {request.specialRequirements && (
              <div className="space-y-2">
                <h4 className="font-medium">Requisits Especials</h4>
                <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">
                  {request.specialRequirements}
                </p>
              </div>
            )}
          </CardContent>
          <div className="p-6 pt-0">
            <Link href={`/transports/${request.id}/seguiment`}>
              <Button>Anar al Seguiment</Button>
            </Link>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              Ofertes Rebudes ({offers.length})
            </CardTitle>
            <CardDescription>
              Aquestes són les ofertes que han enviat els transportistes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {offers.length > 0 && <OfferSummary offers={offers} />}
            <Separator />
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="flex flex-col sm:flex-row gap-4 justify-between rounded-lg border p-4"
              >
                <div className="flex gap-4">
                  <Image
                    src={offer.company.logoUrl}
                    alt={`Logo de ${offer.company.name}`}
                    width={48}
                    height={48}
                    className="rounded-md w-12 h-12"
                    data-ai-hint="logo abstract"
                  />
                  <div>
                    <h4 className="font-semibold">{offer.company.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span>{offer.company.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {offer.vehicle}
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2">
                  <div className="text-lg font-bold text-right">
                    {offer.price}€
                  </div>
                  <Button size="sm">
                    <CheckCircle className="mr-2 h-4 w-4" /> Acceptar Oferta
                  </Button>
                </div>
              </div>
            ))}
            {offers.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12" />
                <h3 className="mt-2 text-lg font-semibold">
                  No hi ha ofertes
                </h3>
                <p className="mt-1 text-sm">
                  Encara no s'ha rebut cap oferta per a aquesta sol·licitud.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Image
              src={requesterAvatar}
              alt={`Avatar de ${requesterName}`}
              width={56}
              height={56}
              className="rounded-full w-14 h-14"
              data-ai-hint="person portrait"
            />
            <div>
              <p className="font-semibold">{requesterName}</p>
              {requesterProfile?.creationDate && (
                <p className="text-sm text-muted-foreground">
                  Membre des de {format(new Date(requesterProfile.creationDate), 'yyyy')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

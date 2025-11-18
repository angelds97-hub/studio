
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, Sparkles, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { suggestTransportImprovements } from '@/ai/flows/suggest-transport-improvements';
import React, { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import type { TransportRequest } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const transportRequestSchema = z.object({
  transportType: z.enum(['passatgers', 'càrrega'], {
    required_error: 'Has de seleccionar un tipus de transport.',
  }),
  origin: z
    .string()
    .min(2, "L'origen ha de tenir almenys 2 caràcters.")
    .max(100, "L'origen no pot tenir més de 100 caràcters."),
  destination: z
    .string()
    .min(2, 'La destinació ha de tenir almenys 2 caràcters.')
    .max(100, 'La destinació no pot tenir més de 100 caràcters.'),
  dates: z.object(
    {
      from: z.date({ required_error: "La data d'inici és obligatòria." }),
      to: z.date().optional(),
    },
    { required_error: "Has d'especificar un rang de dates." }
  ),
  specialRequirements: z.string().optional(),
});


export function TransportRequestForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const mapImage = PlaceHolderImages.find(img => img.id === 'map-tracking');


  const form = useForm<z.infer<typeof transportRequestSchema>>({
    resolver: zodResolver(transportRequestSchema),
    defaultValues: {
      origin: '',
      destination: '',
      specialRequirements: '',
    },
  });

  const origin = form.watch('origin');
  const destination = form.watch('destination');

  useEffect(() => {
    if (origin && origin.length > 2 && destination && destination.length > 2) {
      setShowMap(true);
    } else {
      setShowMap(false);
    }
  }, [origin, destination]);

  async function onSubmit(values: z.infer<typeof transportRequestSchema>) {
     if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error d\'autenticació',
        description: 'Has d\'iniciar sessió per crear una sol·licitud.',
      });
      return;
    }

    startTransition(async () => {
      try {
        const newRequest: Omit<TransportRequest, 'id'> = {
          userProfileId: user.uid,
          transportType: values.transportType,
          origin: values.origin,
          destination: values.destination,
          dates: {
            from: values.dates.from.toISOString(),
            ...(values.dates.to && { to: values.dates.to.toISOString() }),
          },
          specialRequirements: values.specialRequirements,
          status: 'oberta',
        };

        const collectionRef = collection(firestore, 'users', user.uid, 'transportRequests');
        await addDoc(collectionRef, {
            ...newRequest,
            createdAt: serverTimestamp(),
        }).catch(error => {
            const permissionError = new FirestorePermissionError({
                path: collectionRef.path,
                operation: 'create',
                requestResourceData: newRequest,
            });
            errorEmitter.emit('permission-error', permissionError);
            throw new Error("No s'ha pogut desar la sol·licitud.");
        });

        toast({
          title: 'Sol·licitud Creada amb Èxit',
          description: 'La teva sol·licitud ha estat creada correctament.',
        });

        const { suggestedImprovements } = await suggestTransportImprovements({
            transportType: values.transportType,
            origin: values.origin,
            destination: values.destination,
            dates: `${format(values.dates.from, 'PPP', {
                locale: ca,
            })} - ${
                values.dates.to
                ? format(values.dates.to, 'PPP', { locale: ca })
                : 'Obert'
            }`,
            specialRequirements: values.specialRequirements ?? 'Cap',
        });

        setSuggestions(suggestedImprovements);
        
        setTimeout(() => router.push('/dashboard'), 3000);

      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Error en crear la sol·licitud',
          description: (error as Error).message || "Hi ha hagut un problema. Si us plau, intenta-ho de nou.",
        });
      }
    });
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="transportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipus de Transport</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipus" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="passatgers">Passatgers</SelectItem>
                      <SelectItem value="càrrega">Càrrega</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Quin tipus de transport necessites?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dates"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Dates del Transport</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value?.from && 'text-muted-foreground'
                          )}
                        >
                          {field.value?.from ? (
                            <>
                              {format(field.value.from, 'PPP', {
                                locale: ca,
                              })}{' '}
                              -{' '}
                              {field.value?.to
                                ? format(field.value.to, 'PPP', { locale: ca })
                                : 'Data final oberta'}
                            </>
                          ) : (
                            <span>Tria un rang de dates</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={ca}
                        mode="range"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Selecciona les dates d'inici i final del transport.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adreça d'Origen</FormLabel>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="Carrer de Sants, 123, Barcelona" {...field} className="pl-10" />
                    </FormControl>
                  </div>
                  <FormDescription>Introdueix l'adreça completa de recollida.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adreça de Destinació</FormLabel>
                   <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="Avinguda del Port, 456, València" {...field} className="pl-10" />
                    </FormControl>
                  </div>
                  <FormDescription>Introdueix l'adreça completa de lliurament.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

           {showMap && mapImage && (
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border">
                <Image
                    src={mapImage.imageUrl}
                    alt={mapImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={mapImage.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-xl font-headline">{origin} → {destination}</h3>
                    <p className="text-sm">Visualització de la ruta</p>
                </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="specialRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requisits Especials</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descriu qualsevol necessitat especial (ex: refrigeració, material fràgil...)"
                    className="resize-min"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creant sol·licitud...' : 'Crear Sol·licitud'}
          </Button>
        </form>
      </Form>

      {suggestions && (
        <Card className="bg-accent/30 border-accent mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-accent-foreground h-5 w-5" />
              Suggeriments per millorar la teva sol·licitud
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-accent-foreground/90 whitespace-pre-wrap">{suggestions}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

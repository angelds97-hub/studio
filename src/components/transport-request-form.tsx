
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
import { CalendarIcon, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
  const { toast } = useToast();
  const router = useRouter();

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

  return (
    <div className="space-y-8">
      <form 
        action="https://formspree.io/f/xblnopqq"
        method="POST"
        className="space-y-8"
      >
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <Label>Tipus de Transport</Label>
                <Select name="transportType" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passatgers">Passatgers</SelectItem>
                      <SelectItem value="càrrega">Càrrega</SelectItem>
                    </SelectContent>
                </Select>
                 <p className="text-sm text-muted-foreground">Quin tipus de transport necessites?</p>
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
        
        <input type="hidden" name="_subject" value="Nova Sol·licitud de Transport a EnTrans!" />

        <Button type="submit">Enviar Sol·licitud</Button>
      </form>

    </div>
  );
}

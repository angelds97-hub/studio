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
import { CalendarIcon, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { suggestTransportImprovements } from '@/ai/flows/suggest-transport-improvements';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  transportType: z.enum(['passatgers', 'càrrega'], {
    required_error: 'Has de seleccionar un tipus de transport.',
  }),
  origin: z
    .string()
    .min(2, 'L\'origen ha de tenir almenys 2 caràcters.')
    .max(50, 'L\'origen no pot tenir més de 50 caràcters.'),
  destination: z
    .string()
    .min(2, 'La destinació ha de tenir almenys 2 caràcters.')
    .max(50, 'La destinació no pot tenir més de 50 caràcters.'),
  dates: z.object(
    {
      from: z.date({ required_error: 'La data d\'inici és obligatòria.' }),
      to: z.date().optional(),
    },
    { required_error: 'Has d\'especificar un rang de dates.' }
  ),
  specialRequirements: z.string().optional(),
});

type FormState = {
  message: string;
  suggestions?: string;
  isError?: boolean;
};

async function handleFormSubmit(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    transportType: formData.get('transportType'),
    origin: formData.get('origin'),
    destination: formData.get('destination'),
    dates: {
      from: new Date(formData.get('dates.from') as string),
      to: formData.get('dates.to')
        ? new Date(formData.get('dates.to') as string)
        : undefined,
    },
    specialRequirements: formData.get('specialRequirements'),
  });

  if (!validatedFields.data) {
    return {
      message: 'Dades invàlides. Si us plau, corregeix els errors.',
      isError: true,
    };
  }

  try {
    const { suggestedImprovements } = await suggestTransportImprovements({
      transportType: validatedFields.data.transportType,
      origin: validatedFields.data.origin,
      destination: validatedFields.data.destination,
      dates: `${format(validatedFields.data.dates.from, 'PPP', {
        locale: ca,
      })} - ${
        validatedFields.data.dates.to
          ? format(validatedFields.data.dates.to, 'PPP', { locale: ca })
          : 'Obert'
      }`,
      specialRequirements: validatedFields.data.specialRequirements ?? 'Cap',
    });

    return {
      message: 'Sol·licitud creada amb èxit!',
      suggestions: suggestedImprovements,
    };
  } catch (error) {
    return {
      message: 'Error en generar suggeriments. Intenta-ho de nou.',
      isError: true,
    };
  }
}

export function TransportRequestForm() {
  const [formState, setFormState] = React.useState<FormState | null>(null);
  const [isPending, setIsPending] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: '',
      destination: '',
      specialRequirements: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'dates' && typeof value === 'object' && value !== null) {
        if (value.from) formData.append('dates.from', value.from.toISOString());
        if (value.to) formData.append('dates.to', value.to.toISOString());
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const result = await handleFormSubmit(formState!, formData);
    setFormState(result);
    setIsPending(false);

    toast({
      title: result.isError ? 'Error' : 'Sol·licitud Creada',
      description: result.message,
      variant: result.isError ? 'destructive' : 'default',
    });

    if (!result.isError) {
      form.reset();
      setTimeout(() => router.push('/solicituts'), 2000);
    }
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
                  <FormLabel>Origen</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Barcelona" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destinació</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: València" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

      {formState?.suggestions && (
        <Card className="bg-accent/30 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-accent-foreground h-5 w-5" />
              Suggeriments per millorar la teva sol·licitud
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-accent-foreground/90 whitespace-pre-wrap">{formState.suggestions}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

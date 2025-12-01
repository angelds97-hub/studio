'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Truck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('El correu electrònic no és vàlid.'),
  password: z.string().min(1, 'La contrasenya és obligatòria.'),
});

export function AuthForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    // In a static site, real login is not possible.
    // We redirect to dashboard, assuming login is handled externally or mocked.
    setIsProcessing(true);
    toast({
      title: 'Inici de sessió simulat',
      description: 'Redirigint al panell de control...',
    });
    // Add a small delay to simulate a network request
    setTimeout(() => {
        router.push('/dashboard');
    }, 1000);
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
          Aquesta àrea és per a usuaris registrats.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correu Electrònic</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="correu@exemple.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contrasenya</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? 'Iniciant sessió...' : 'Iniciar Sessió'}
              </Button>
            </form>
          </Form>
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

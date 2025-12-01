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

const registerSchema = z.object({
  firstName: z.string().min(2, 'El nom ha de tenir almenys 2 caràcters.'),
  lastName: z.string().min(2, 'El cognom ha de tenir almenys 2 caràcters.'),
  email: z.string().email('El correu electrònic no és vàlid.'),
});

type AuthFormProps = {
  isRegister?: boolean;
};

export function AuthForm({ isRegister = false }: AuthFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const schema = isRegister ? registerSchema : loginSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      ...(isRegister ? { firstName: '', lastName: '' } : { password: '' }),
    },
  });

  const onRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');

    if (!firstName || !lastName || !email) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Tots els camps són obligatoris.',
      });
      return;
    }

    setIsProcessing(true);
    fetch("https://formspree.io/f/xblnopqq", {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        setIsProcessing(false);
        if (response.ok) {
            toast({
              title: 'Sol·licitud enviada!',
              description: "Gràcies per registrar-te. T'enviarem un correu quan el teu compte estigui aprovat.",
            });
            (event.target as HTMLFormElement).reset();
            router.push('/login');
        } else {
            toast({
              variant: 'destructive',
              title: 'Error en la sol·licitud',
              description: "No s'ha pogut enviar la teva sol·licitud. Si us plau, intenta-ho de nou més tard.",
            });
        }
    }).catch(error => {
        setIsProcessing(false);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: "Hi ha hagut un problema de xarxa.",
        });
    });
  };

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    // In a static site, real login is not possible.
    // We redirect to dashboard, assuming login is handled externally or mocked.
    toast({
      title: 'Inici de sessió simulat',
      description: 'Redirigint al panell de control...',
    });
    router.push('/dashboard');
  };

  const onSubmit = isRegister ? () => {} : form.handleSubmit(onLoginSubmit);

  return (
    <Card>
      <CardHeader className="text-center">
        <Link href="/" className="mx-auto mb-4">
          <Truck className="h-12 w-12 text-primary" />
        </Link>
        <CardTitle className="font-headline text-2xl">
          {isRegister ? 'Sol·licita accés a la plataforma' : 'Benvingut/da a EnTrans'}
        </CardTitle>
        <CardDescription>
          {isRegister
            ? "Entra les teves dades i t'avisarem quan el teu compte estigui llest."
            : 'Aquesta àrea és per a usuaris registrats. Per accedir-hi, has de ser afegit manualment per un administrador.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRegister ? (
          <form onSubmit={onRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nom</Label>
                <Input id="firstName" name="firstName" placeholder="El teu nom" required />
              </div>
              <div>
                <Label htmlFor="lastName">Cognom</Label>
                <Input id="lastName" name="lastName" placeholder="El teu cognom" required />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Correu Electrònic</Label>
              <Input id="email" name="email" type="email" placeholder="correu@exemple.com" required />
            </div>
             <input type="hidden" name="_subject" value="Nova Sol·licitud de Registre a EnTrans!" />
            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? 'Enviant...' : 'Enviar Sol·licitud'}
            </Button>
          </form>
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
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
        )}
        <div className="mt-4 text-center text-sm">
          {isRegister ? (
            <>
              Ja tens un compte?{' '}
              <Link href="/login" className="underline">
                Inicia sessió
              </Link>
            </>
          ) : (
            <>
              No tens un compte?{' '}
              <Link href="/registre" className="underline">
                Sol·licita accés
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

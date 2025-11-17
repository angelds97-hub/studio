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
import {
  useAuth,
  initiateEmailSignUp,
  initiateEmailSignIn,
  useUser,
} from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { Truck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('El correu electrònic no és vàlid.'),
  password: z.string().min(1, 'La contrasenya és obligatòria.'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'El nom ha de tenir almenys 2 caràcters.'),
  email: z.string().email('El correu electrònic no és vàlid.'),
  password: z
    .string()
    .min(6, 'La contrasenya ha de tenir almenys 6 caràcters.'),
});

type AuthFormProps = {
  isRegister?: boolean;
};

export function AuthForm({ isRegister = false }: AuthFormProps) {
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  const schema = isRegister ? registerSchema : loginSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      ...(isRegister && { name: '' }),
    },
  });

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      if (isRegister) {
        initiateEmailSignUp(auth, values.email, values.password);
      } else {
        initiateEmailSignIn(auth, values.email, values.password);
      }
      toast({
        title: isRegister ? 'Registre completat' : 'Sessió iniciada',
        description: isRegister
          ? 'T\'hem enviat un correu de verificació.'
          : 'Benvingut/da de nou!',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error.message ||
          "Hi ha hagut un problema. Si us plau, intenta-ho de nou.",
      });
    }
  }

  if (isUserLoading || user) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
            <Truck className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl">
          {isRegister ? 'Crea un nou compte' : 'Benvingut/da a EnTrans'}
        </CardTitle>
        <CardDescription>
          {isRegister
            ? 'Entra les teves dades per començar.'
            : "Entra les teves credencials per accedir a la plataforma."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isRegister && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="El teu nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {isRegister ? 'Registrar-se' : 'Iniciar Sessió'}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          {isRegister ? (
            <>
              Ja tens un compte?{' '}
              <Link href="/" className="underline">
                Inicia sessió
              </Link>
            </>
          ) : (
            <>
              No tens un compte?{' '}
              <Link href="/registre" className="underline">
                Registra't
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

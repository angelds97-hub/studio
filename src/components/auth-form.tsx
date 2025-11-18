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
  useFirestore,
} from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { Truck } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const loginSchema = z.object({
  email: z.string().email('El correu electrònic no és vàlid.'),
  password: z.string().min(1, 'La contrasenya és obligatòria.'),
});

const registerSchema = z.object({
  firstName: z.string().min(2, 'El nom ha de tenir almenys 2 caràcters.'),
  lastName: z.string().min(2, 'El cognom ha de tenir almenys 2 caràcters.'),
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
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  const schema = isRegister ? registerSchema : loginSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      ...(isRegister && { firstName: '', lastName: '' }),
    },
  });

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!auth) return;
    try {
      if (isRegister) {
        const userCredential = await auth.createUserWithEmailAndPassword(values.email, values.password);
        const newUser = userCredential.user;

        if (firestore && newUser) {
            const userProfile = {
                id: newUser.uid,
                firstName: (values as z.infer<typeof registerSchema>).firstName,
                lastName: (values as z.infer<typeof registerSchema>).lastName,
                email: values.email,
                role: values.email === 'adomen11@xtec.cat' ? 'administrador' : 'client/proveidor',
                creationDate: serverTimestamp(),
            };
            const docRef = doc(firestore, 'users', newUser.uid);
            setDoc(docRef, userProfile).catch(error => {
                const permissionError = new FirestorePermissionError({
                    path: docRef.path,
                    operation: 'create',
                    requestResourceData: userProfile,
                });
                errorEmitter.emit('permission-error', permissionError);
            });
        }
      } else {
        initiateEmailSignIn(auth, values.email, values.password);
      }
      toast({
        title: isRegister ? 'Registre completat' : 'Sessió iniciada',
        description: isRegister
          ? 'El teu compte ha estat creat.'
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
        <Link href="/inici" className="mx-auto mb-4">
            <Truck className="h-12 w-12 text-primary" />
        </Link>
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
              <>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="firstName"
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
                    <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Cognom</FormLabel>
                        <FormControl>
                            <Input placeholder="El teu cognom" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
              </>
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
              {form.formState.isSubmitting ? (isRegister ? 'Registrant...' : 'Iniciant sessió...') : (isRegister ? 'Registrar-se' : 'Iniciar Sessió')}
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

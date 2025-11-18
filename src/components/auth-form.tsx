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
  useUser,
  useFirestore,
} from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

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
  const [isProcessing, setIsProcessing] = useState(false);

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
    if (user && !isProcessing) {
      router.push('/dashboard');
    }
  }, [user, router, isProcessing]);

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!auth || !firestore) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No s\'ha pogut connectar als serveis d\'autenticació.',
        });
        return;
    }
    setIsProcessing(true);

    try {
      if (isRegister) {
        // --- Registration Flow ---
        const registrationData = {
          firstName: (values as z.infer<typeof registerSchema>).firstName,
          lastName: (values as z.infer<typeof registerSchema>).lastName,
          email: values.email,
          status: 'pending',
          requestedAt: serverTimestamp(),
        };

        const docRef = doc(collection(firestore, 'registrationRequests'));
        await setDoc(docRef, registrationData).catch(error => {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'create',
                requestResourceData: registrationData,
            });
            errorEmitter.emit('permission-error', permissionError);
            throw new Error("No s'ha pogut enviar la sol·licitud de registre.");
        });

        toast({
          title: 'Sol·licitud de registre enviada',
          description: "La teva sol·licitud ha estat enviada. Rebràs una notificació quan sigui aprovada per un administrador.",
        });
        form.reset();

      } else {
        // --- Login Flow ---
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const loggedInUser = userCredential.user;

        const userDocRef = doc(firestore, 'users', loggedInUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // If user doc doesn't exist, they are not approved.
          await signOut(auth);
          toast({
            variant: 'destructive',
            title: 'Inici de sessió fallit',
            description: "El teu compte no està aprovat o no existeix.",
          });
        } else {
            // User exists, login is successful
            toast({
                title: 'Sessió iniciada',
                description: 'Benvingut/da de nou!',
            });
            // The useEffect will handle the redirect to /dashboard
        }
      }
    } catch (error: any) {
      console.error(error);
      const defaultMessage = "Hi ha hagut un problema. Si us plau, intenta-ho de nou.";
      let description = defaultMessage;

      if (error.code) {
          switch (error.code) {
              case 'auth/user-not-found':
              case 'auth/wrong-password':
                  description = 'El correu electrònic o la contrasenya són incorrectes.';
                  break;
              case 'auth/invalid-credential':
                  description = 'Les credencials proporcionades no són vàlides.';
                  break;
              case 'permission-denied':
                  description = error.message;
                  break;
          }
      } else if (error.message) {
          description = error.message;
      }
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description,
      });
    } finally {
        setIsProcessing(false);
    }
  }

  if (isUserLoading || (user && !isProcessing)) {
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
          {isRegister ? 'Sol·licita accés a la plataforma' : 'Benvingut/da a EnTrans'}
        </CardTitle>
        <CardDescription>
          {isRegister
            ? 'Entra les teves dades per sol·licitar un compte.'
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
              disabled={isProcessing}
            >
              {isProcessing ? (isRegister ? 'Enviant sol·licitud...' : 'Iniciant sessió...') : (isRegister ? 'Sol·licitar Registre' : 'Iniciar Sessió')}
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
                Sol·licita accés
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

    
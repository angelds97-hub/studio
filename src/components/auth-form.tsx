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
import { collection, doc, setDoc, serverTimestamp, getDoc, addDoc } from 'firebase/firestore';
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
      ...(isRegister ? { firstName: '', lastName: '' } : { password: '' }),
    },
  });

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
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
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const loggedInUser = userCredential.user;

        const userDocRef = doc(firestore, 'users', loggedInUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            await signOut(auth);
            toast({
                variant: 'destructive',
                title: 'Inici de sessió fallit',
                description: "El teu compte no està aprovat o no existeix.",
            });
        } else {
            toast({
                title: 'Sessió iniciada',
                description: 'Benvingut/da de nou!',
            });
            router.push('/dashboard');
        }
    } catch (error: any) {
      console.error(error);
      const defaultMessage = "Hi ha hagut un problema. Si us plau, intenta-ho de nou.";
      let description = defaultMessage;

      if (error.code) {
          switch (error.code) {
              case 'auth/user-not-found':
              case 'auth/wrong-password':
              case 'auth/invalid-credential':
                  description = 'El correu electrònic o la contrasenya són incorrectes.';
                  break;
              case 'auth/email-already-in-use':
                  description = 'Aquest correu electrònic ja està en ús.';
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
        <Link href="/" className="mx-auto mb-4">
            <Truck className="h-12 w-12 text-primary" />
        </Link>
        <CardTitle className="font-headline text-2xl">
          {isRegister ? 'Sol·licita accés a la plataforma' : 'Benvingut/da a EnTrans'}
        </CardTitle>
        <CardDescription>
          {isRegister
            ? 'Entra les teves dades i t\'avisarem quan el teu compte estigui llest.'
            : "Entra les teves credencials per accedir a la plataforma."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRegister ? (
          <form 
            action="https://formspree.io/f/xblnopqq"
            method="POST"
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nom</Label>
                <Input id="firstName" name="Nom" placeholder="El teu nom" required/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Cognom</Label>
                <Input id="lastName" name="Cognom" placeholder="El teu cognom" required/>
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Correu Electrònic</Label>
                <Input id="email" type="email" name="email" placeholder="correu@exemple.com" required/>
            </div>
            {/* Hidden field for Formspree subject */}
            <input type="hidden" name="_subject" value="Nova Sol·licitud de Registre a EnTrans!" />
            <Button
              type="submit"
              className="w-full"
            >
              Enviar Sol·licitud
            </Button>
          </form>
        ) : (
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
           
            <Button
              type="submit"
              className="w-full"
              disabled={isProcessing}
            >
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

    
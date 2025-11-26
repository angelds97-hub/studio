'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { LogOut, ShieldAlert } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const profileSchema = z.object({
  firstName: z.string().min(2, 'El nom és obligatori.'),
  lastName: z.string().min(2, 'El cognom és obligatori.'),
  email: z.string().email('El correu electrònic no és vàlid.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ConfiguracioPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading } = useDoc<UserProfile>(userProfileRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!userProfileRef) return;
    setIsSubmitting(true);
    try {
      await setDoc(
        userProfileRef,
        {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
        },
        { merge: true }
      ).catch(error => {
         const permissionError = new FirestorePermissionError({
            path: userProfileRef.path,
            operation: 'update',
            requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw new Error("No s'han pogut desar els canvis del perfil.");
      });
      toast({
        title: 'Perfil actualitzat',
        description: 'La teva informació s\'ha desat correctament.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || "No s'han pogut desar els canvis.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = () => {
    if (!auth) return;
    signOut(auth).then(() => {
      toast({ title: 'Sessió tancada correctament.' });
      router.push('/');
    });
  };

  const handleDeleteAccount = () => {
    // Aquí aniria la lògica per eliminar el compte.
    // Per ara, només mostra un missatge.
    toast({
      variant: 'destructive',
      title: 'Acció no implementada',
      description: 'La funcionalitat per eliminar el compte encara no està disponible.',
    });
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-headline font-bold">Configuració</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Skeleton className="h-10 w-28" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-headline font-bold">Configuració</h1>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>
                Gestiona la informació del teu perfil públic.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                   <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correu Electrònic</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Desant...' : 'Desar canvis'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notificacions</CardTitle>
          <CardDescription>Tria com vols rebre les notificacions.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="email-notifications" defaultChecked />
            <label
              htmlFor="email-notifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Notificacions per correu electrònic
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="push-notifications" />
            <label
              htmlFor="push-notifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Notificacions push
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="offers-notifications" defaultChecked />
            <label
              htmlFor="offers-notifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Avisar-me de noves ofertes
            </label>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Desar canvis</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Compte</CardTitle>
          <CardDescription>Gestiona les opcions de la teva sessió.</CardDescription>
        </CardHeader>
        <CardContent>
           <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Tancar Sessió
          </Button>
        </CardContent>
      </Card>
       <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zona Perillosa</CardTitle>
          <CardDescription>Aquestes accions són permanents i no es poden desfer.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
            <div>
                <p className="font-semibold">Eliminar el meu compte</p>
                <p className="text-sm text-muted-foreground">Totes les teves dades seran eliminades permanentment.</p>
            </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Eliminar Compte
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Estàs absolutament segur?</AlertDialogTitle>
                <AlertDialogDescription>
                  Aquesta acció no es pot desfer. Això eliminarà permanentment el teu compte i esborrarà les teves dades dels nostres servidors.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel·lar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

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
import { Input } from '@/components/ui/input';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
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

const profileSchema = z.object({
  firstName: z.string().min(2, 'El nom és obligatori.'),
  lastName: z.string().min(2, 'El cognom és obligatori.'),
  email: z.string().email('El correu electrònic no és vàlid.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function PerfilPage() {
  const { user } = useUser();
  const firestore = useFirestore();
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

  if (isLoading) {
    return (
      <div className="grid gap-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-headline font-bold">Perfil d'Usuari</h1>
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
      <h1 className="text-3xl font-headline font-bold">Perfil d'Usuari</h1>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Informació Personal</CardTitle>
              <CardDescription>
                Aquesta és la teva informació personal.
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
                        <Input type="email" {...field} disabled />
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
    </div>
  );
}

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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { BlogPost, WithId } from '@/lib/types';
import { Textarea } from './ui/textarea';
import { useFirestore } from '@/firebase';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const blogPostSchema = z.object({
  title: z
    .string()
    .min(3, 'El títol ha de tenir almenys 3 caràcters.')
    .max(100, 'El títol no pot superar els 100 caràcters.'),
  category: z
    .string()
    .min(2, 'La categoria ha de tenir almenys 2 caràcters.')
    .max(50, 'La categoria no pot superar els 50 caràcters.'),
  imageHint: z
    .string()
    .min(2, "La descripció de l'imatge ha de tenir almenys 2 caràcters.")
    .max(100, "La descripció de l'imatge no pot superar els 100 caràcters."),
  content: z
    .string()
    .min(10, 'El contingut ha de tenir almenys 10 caràcters.'),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  authorId: string;
  initialData?: WithId<BlogPost>;
}

export function BlogPostForm({ authorId, initialData }: BlogPostFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialData;

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      category: '',
      imageHint: '',
      content: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        category: initialData.category,
        imageHint: initialData.imageHint,
        content: initialData.content,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: BlogPostFormValues) => {
    if (!firestore) return;
    setIsSubmitting(true);

    try {
      const postData = {
        ...data,
        authorId,
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(
          data.imageHint.split(' ').join('-')
        )}/800/600`,
        excerpt:
          data.content.substring(0, 150).replace(/<[^>]*>?/gm, '') + '...',
      };

      if (isEditMode && initialData) {
        const docRef = doc(firestore, 'blogPosts', initialData.id);
        await setDoc(docRef, {
          ...postData,
          updatedAt: serverTimestamp(),
          createdAt: initialData.createdAt, // Preserve original creation date
        }).catch((error) => {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: postData,
          });
          errorEmitter.emit('permission-error', permissionError);
          throw new Error("No s'ha pogut actualitzar l'article.");
        });

        toast({
          title: 'Article actualitzat!',
          description: "L'entrada del blog s'ha desat correctament.",
        });
      } else {
        const collectionRef = collection(firestore, 'blogPosts');
        await addDoc(collectionRef, {
          ...postData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }).catch((error) => {
          const permissionError = new FirestorePermissionError({
            path: collectionRef.path,
            operation: 'create',
            requestResourceData: postData,
          });
          errorEmitter.emit('permission-error', permissionError);
          throw new Error("No s'ha pogut crear l'article.");
        });

        toast({
          title: 'Article creat!',
          description: "La teva nova entrada de blog s'ha publicat correctament.",
        });
      }
      router.push('/dashboard/blog');
      router.refresh(); // Refresh the page to show the new post
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message || 'Hi ha hagut un problema.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Títol de l'article</FormLabel>
              <FormControl>
                <Input
                  placeholder="Un títol atractiu per al teu article"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Logística, Tecnologia..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageHint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripció de la imatge</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: camió modern a la carretera"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Això ajudarà a generar una imatge de capçalera adient.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contingut</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escriu aquí el teu article..."
                  className="min-h-[250px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Pots utilitzar etiquetes HTML bàsiques per formatar el text. Per
                exemple: <code>&lt;h3&gt;Subtítol&lt;/h3&gt;</code>,{' '}
                <code>&lt;p&gt;Paràgraf.&lt;/p&gt;</code>,{' '}
                <code>&lt;strong&gt;Negreta&lt;/strong&gt;</code>, o{' '}
                <code>
                  &lt;ul&gt;&lt;li&gt;Element de llista&lt;/li&gt;&lt;/ul&gt;
                </code>
                .
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? 'Desant...'
              : 'Publicant...'
            : isEditMode
            ? 'Desar Canvis'
            : 'Publicar Article'}
        </Button>
      </form>
    </Form>
  );
}

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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
}

export function BlogPostForm({ authorId }: BlogPostFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      category: '',
      imageHint: '',
      content: '',
    },
  });

  const onSubmit = async (data: BlogPostFormValues) => {
    setIsSubmitting(true);
    
    // In a real app, this would submit to a backend.
    // For this demo, we'll just show a success message.
    console.log("New post data:", {
        ...data,
        authorId,
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(
            data.imageHint.split(' ').join('-')
        )}/600/400`,
        excerpt: data.content.substring(0, 150) + '...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    toast({
        title: 'Article creat!',
        description: "La teva nova entrada de blog s'ha publicat correctament (simulació).",
    });

    router.push('/dashboard/blog');
    setIsSubmitting(false);
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
                <Input placeholder="Un títol atractiu per al teu article" {...field} />
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
                  <Input placeholder="Ex: Logística, Tecnologia..." {...field} />
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
                  <Input placeholder="Ex: camió modern a la carretera" {...field} />
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
                  placeholder="Escriu aquí el teu article. Pots utilitzar Markdown per al format."
                  className="min-h-[250px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Publicant...' : 'Publicar Article'}
        </Button>
      </form>
    </Form>
  );
}

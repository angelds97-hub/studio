'use client';

import { useParams } from 'next/navigation';
import { BlogPostForm } from '@/components/blog-post-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser } from '@/firebase';
import { blogPosts } from '@/lib/blog-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

export default function EditBlogPostPage() {
  const { user } = useUser();
  const params = useParams();
  const { id } = params;

  // In a real app, you'd fetch this data from your backend
  const postToEdit = blogPosts.find((post) => post.id === id);

  if (!user) {
    return null; // Or a loading component
  }
  
  if (!postToEdit) {
    return (
       <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Article no trobat</AlertTitle>
        <AlertDescription>
          No s'ha trobat cap article amb aquest identificador.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Editar l'article
        </CardTitle>
        <CardDescription>
          Modifica el formulari per actualitzar l'entrada del blog.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BlogPostForm authorId={user.uid} initialData={postToEdit} />
      </CardContent>
    </Card>
  );
}

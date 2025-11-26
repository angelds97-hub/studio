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
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import type { BlogPost } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditBlogPostPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const params = useParams();
  const { id } = params;

  const postRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'blogPosts', id as string);
  }, [firestore, id]);

  const { data: postToEdit, isLoading } = useDoc<BlogPost>(postRef);

  if (isLoading || !user) {
    return (
       <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    );
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

  // Check if the current user is the author of the post
  if (postToEdit.authorId !== user.uid) {
     return (
       <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Accés Denegat</AlertTitle>
        <AlertDescription>
          No tens permís per editar aquest article.
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

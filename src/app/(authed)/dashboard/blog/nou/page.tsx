'use client';

import { BlogPostForm } from '@/components/blog-post-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser } from '@/firebase';

export default function NewBlogPostPage() {
  const { user } = useUser();

  if (!user) {
    return null; // O un component de càrrega
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Crear un nou article
        </CardTitle>
        <CardDescription>
          Omple el formulari següent per publicar una nova entrada al teu blog.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BlogPostForm authorId={user.uid} />
      </CardContent>
    </Card>
  );
}

'use client';

import { BlogPostForm } from '@/components/blog-post-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NewBlogPostPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Proposar un nou article
        </CardTitle>
        <CardDescription>
          Omple el formulari següent per enviar una proposta d'article per al blog. Un cop rebuda, es revisarà i publicarà manualment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BlogPostForm />
      </CardContent>
    </Card>
  );
}

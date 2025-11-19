'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from '@/lib/types';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { blogPosts } from "@/lib/blog-data";

function BlogPostList({ blogPosts }: { blogPosts: BlogPost[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogPosts && blogPosts.map(post => (
        <Card key={post.id} className="overflow-hidden flex flex-col">
          {post.imageUrl && (
            <div className="relative aspect-video">
              <Image src={post.imageUrl} alt={post.title} fill className="object-cover" data-ai-hint={post.imageHint} />
            </div>
          )}
          <CardHeader>
            <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
            <CardTitle className="font-headline text-xl">
              <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">{post.title}</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground text-sm">{post.excerpt}</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {post.createdAt && format(new Date(post.createdAt), 'dd MMM, yyyy', {
                locale: ca,
              })}
            </span>
            <Link href={`/blog/${post.id}`} className="flex items-center gap-1 font-semibold text-primary">
              Llegir més <ArrowRight className="w-4 h-4" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}


export default function BlogPage() {

    return (
        <div className="container py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">El Nostre Blog</h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">Notícies, tendències i consells sobre el món del transport i la logística.</p>
        </div>

        {blogPosts ? (
            <BlogPostList blogPosts={blogPosts} />
        ) : (
           <div className="text-center py-10 text-muted-foreground">
                <h3 className="mt-2 text-lg font-semibold">No s'han trobat articles</h3>
                <p className="mt-1 text-sm">
                    Aviat hi haurà notícies i novetats.
                </p>
           </div>
        )}
        </div>
    );
}

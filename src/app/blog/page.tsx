'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { BlogPost } from '@/lib/types';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";

function BlogPostsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="overflow-hidden flex flex-col">
          <div className="relative aspect-video bg-muted">
             <Skeleton className="h-full w-full" />
          </div>
          <CardHeader>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-7 w-3/4" />
          </CardHeader>
          <CardContent className="flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardContent>
          <CardFooter className="flex justify-between items-center text-sm">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}


export default function BlogPage() {
    const firestore = useFirestore();

    const postsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'blogPosts'),
            orderBy('createdAt', 'desc')
        );
    }, [firestore]);

    const { data: blogPosts, isLoading } = useCollection<BlogPost>(postsQuery);

    return (
        <div className="container py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">El Nostre Blog</h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">Notícies, tendències i consells sobre el món del transport i la logística.</p>
        </div>

        {isLoading ? (
            <BlogPostsSkeleton />
        ) : (
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
                        Llegir més <ArrowRight className="w-4 h-4"/>
                    </Link>
                </CardFooter>
            </Card>
            ))}
            </div>
        )}
        </div>
    );
}

>'use client';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { BlogPost, UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { blogPosts as mockBlogPosts } from '@/lib/blog-data';

function BlogPostDetail() {
  const params = useParams();
  const firestore = useFirestore();
  const { id } = params;

  const postRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'blogPosts', id as string);
  }, [firestore, id]);

  const { data: postFromDb, isLoading: postLoading } = useDoc<BlogPost>(postRef);

  const post = postFromDb || mockBlogPosts.find(p => p.id === id);

  const authorRef = useMemoFirebase(() => {
    if (!firestore || !post?.authorId) return null;
    return doc(firestore, 'users', post.authorId);
  }, [firestore, post?.authorId]);

  const { data: author, isLoading: authorLoading } =
    useDoc<UserProfile>(authorRef);

  if (postLoading || authorLoading) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="text-center mb-8">
          <Skeleton className="h-6 w-24 mx-auto mb-4" />
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <div className="mt-6 flex justify-center items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
        <Skeleton className="aspect-video rounded-lg mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  const authorName = author
    ? `${author.firstName} ${author.lastName}`
    : 'Autor desconegut';
  
  const createdAt = post.createdAt ? new Date(post.createdAt as string) : new Date();

  return (
    <article className="container max-w-4xl py-12">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">
          {post.category}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          {post.title}
        </h1>
        <div className="mt-6 flex justify-center items-center gap-4 text-muted-foreground">
          <Avatar>
            <AvatarImage
              src={author?.avatarUrl}
              alt={authorName}
              data-ai-hint="person portrait"
            />
            <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <span>Per {authorName}</span>
            <span className="mx-2">•</span>
            <span>
              {format(createdAt, 'dd MMMM, yyyy', {
                locale: ca,
              })}
            </span>
          </div>
        </div>
      </div>

      {post.imageUrl && (
        <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={800}
            height={600}
            className="object-cover w-full h-full"
            data-ai-hint={post.imageHint}
            priority
          />
        </div>
      )}

      {/* Using a div with prose for markdown rendering */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none mx-auto"
        dangerouslySetInnerHTML={{ __html: post.content }} // In a real app, sanitize this HTML
      />
    </article>
  );
}

export default function BlogPostPage() {
    // This wrapper component is needed because hooks can't be used in generateStaticParams
    return <BlogPostDetail />;
}

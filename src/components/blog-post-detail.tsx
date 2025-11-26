'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { BlogPost, UserProfile, WithId } from '@/lib/types';

interface BlogPostDetailProps {
    post: WithId<BlogPost>;
    author: WithId<UserProfile> | null;
}

function BlogPostDetail({ post, author }: BlogPostDetailProps) {
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

BlogPostDetail.Skeleton = function BlogPostSkeleton() {
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

export default BlogPostDetail;

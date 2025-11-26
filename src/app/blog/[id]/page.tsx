'use client';
import { notFound, useParams } from 'next/navigation';
import type { BlogPost, UserProfile } from '@/lib/types';
import BlogPostDetail from '@/components/blog-post-detail';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';


// This function tells Next.js which pages to generate at build time.
export function generateStaticParams() {
  // In a real app, you'd fetch this from your CMS or database
  // For this static export example, we'll use the mock data
  const { blogPosts: mockBlogPosts } = require('@/lib/blog-data');
  return mockBlogPosts.map((post: BlogPost) => ({
    id: post.id,
  }));
}

export default function BlogPostPage() {
    const params = useParams();
    const firestore = useFirestore();
    const { id } = params;

    // In a real app, you would fetch from the DB.
    // For static export, we get the data from the mock file.
    const { blogPosts: mockBlogPosts } = require('@/lib/blog-data');
    const post = mockBlogPosts.find((p: BlogPost) => p.id === id);


    const authorRef = useMemoFirebase(() => {
        if (!firestore || !post?.authorId) return null;
        return doc(firestore, 'users', post.authorId);
    }, [firestore, post?.authorId]);

    const { data: author, isLoading: authorLoading } = useDoc<UserProfile>(authorRef);

     const { data: postFromDb, isLoading: postLoading } = useDoc<BlogPost>(useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'blogPosts', id as string);
     }, [firestore, id]));

    const displayPost = postFromDb || post;


    if (postLoading || authorLoading) {
        return <BlogPostDetail.Skeleton />;
    }

    if (!displayPost) {
        notFound();
    }
    
    return <BlogPostDetail post={displayPost} author={author} />;
}

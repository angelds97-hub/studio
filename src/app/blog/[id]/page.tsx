'use client';
import { notFound, useParams } from 'next/navigation';
import type { BlogPost, UserProfile } from '@/lib/types';
import { blogPosts as mockBlogPosts } from '@/lib/blog-data';
import BlogPostDetail from '@/components/blog-post-detail';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';


// This function tells Next.js which pages to generate at build time.
export function generateStaticParams() {
  return mockBlogPosts.map((post) => ({
    id: post.id,
  }));
}

export default function BlogPostPage() {
    const params = useParams();
    const firestore = useFirestore();
    const { id } = params;

    const postRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'blogPosts', id as string);
    }, [firestore, id]);

    const { data: postFromDb, isLoading: postLoading } = useDoc<BlogPost>(postRef);

    // Fallback to mock data if Firestore data is not available yet, ensuring static export works
    const post = postFromDb || mockBlogPosts.find(p => p.id === id);

    const authorRef = useMemoFirebase(() => {
        if (!firestore || !post?.authorId) return null;
        return doc(firestore, 'users', post.authorId);
    }, [firestore, post?.authorId]);

    const { data: author, isLoading: authorLoading } = useDoc<UserProfile>(authorRef);

    if (postLoading || authorLoading) {
        return <BlogPostDetail.Skeleton />;
    }

    if (!post) {
        notFound();
    }
    
    return <BlogPostDetail post={post} author={author} />;
}

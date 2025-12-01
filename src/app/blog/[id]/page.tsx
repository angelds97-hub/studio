// This is a Server Component, so it can fetch data and use server-only functions.
import BlogPostDetail from '@/components/blog-post-detail';
import type { BlogPost, UserProfile, WithId } from '@/lib/types';
import { notFound } from 'next/navigation';
// Import mock data directly for static generation and server-side rendering
import { blogPosts as mockBlogPosts } from '@/lib/blog-data';
import { users as mockUsers } from '@/lib/data';

// This function tells Next.js which pages to generate at build time.
// It must be in a Server Component.
export async function generateStaticParams() {
  // In a real app, you'd fetch this from your CMS or database
  // For this static export example, we'll use the mock data
  return mockBlogPosts.map((post: BlogPost) => ({
    id: post.id,
  }));
}

// This is the page component itself, running on the server.
export default async function BlogPostPage({ params }: { params: { id: string } }) {
    const { id } = params;

    // Fetch data on the server.
    // For this example, we'll use the mock data to find the post.
    const post = mockBlogPosts.find((p: BlogPost) => p.id === id);

    if (!post) {
        // If no post is found, trigger a 404 page.
        notFound();
    }
    
    // Find the author from mock data
    const author = mockUsers.find(u => u.id === post.authorId) as UserProfile | null;
    
    // The data is fetched on the server and then passed to the client component for rendering.
    // The BlogPostDetail component is the one marked with 'use client'.
    return <BlogPostDetail post={{...post, id: post.id!}} author={author ? {...author, id: post.authorId} : null} />;
}

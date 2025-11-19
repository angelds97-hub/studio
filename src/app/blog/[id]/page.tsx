import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/blog-data';
import Image from 'next/image';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/lib/data';

// This is a server component, so we can fetch data directly
export async function generateStaticParams() {
    // Generate static routes for each blog post
    return blogPosts.map(post => ({
        id: post.id,
    }));
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find(p => p.id === params.id);

  if (!post) {
    notFound();
  }

  const author = users[post.authorId] ?? { name: 'Autor desconegut', avatarUrl: '' };

  return (
    <article className="container max-w-4xl py-12">
        <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">{post.title}</h1>
            <div className="mt-6 flex justify-center items-center gap-4 text-muted-foreground">
                 <Avatar>
                    <AvatarImage src={author.avatarUrl} alt={author.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <span>Per {author.name}</span>
                    <span className="mx-2">•</span>
                     <span>
                        {format(new Date(post.createdAt), "dd MMMM, yyyy", { locale: ca })}
                    </span>
                </div>
            </div>
        </div>

      {post.imageUrl && (
        <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
          <Image src={post.imageUrl} alt={post.title} width={800} height={600} className="object-cover w-full h-full" data-ai-hint={post.imageHint} priority />
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

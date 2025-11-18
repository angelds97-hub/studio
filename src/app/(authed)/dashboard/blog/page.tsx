'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { BlogPost } from '@/lib/types';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

function BlogPostsTable({
  posts,
  isLoading,
}: {
  posts: WithId<BlogPost>[] | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Títol</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Data de Creació</TableHead>
            <TableHead>
              <span className="sr-only">Accions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <h3 className="mt-2 text-lg font-semibold">No hi ha cap article al blog</h3>
        <p className="mt-1 text-sm">
          Comença a compartir notícies i novetats creant la teva primera entrada.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Títol</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Data de Creació</TableHead>
          <TableHead>
            <span className="sr-only">Accions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell>
              <Badge variant="outline">{post.category}</Badge>
            </TableCell>
            <TableCell>
              {post.createdAt && format(new Date(post.createdAt), 'dd MMM, yyyy', {
                locale: ca,
              })}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Obrir menú</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Accions</DropdownMenuLabel>
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                  <DropdownMenuItem>Eliminar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function BlogManagementPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
        collection(firestore, 'blogPosts'),
        orderBy('createdAt', 'desc')
    );
  }, [firestore]);

  const { data: posts, isLoading } = useCollection<BlogPost>(postsQuery);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestió del Blog</CardTitle>
            <CardDescription>
              Crea, edita i elimina els articles del teu blog.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/blog/nou">
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear nou article
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <BlogPostsTable posts={posts} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}

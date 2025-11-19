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
import type { BlogPost } from '@/lib/types';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { blogPosts } from '@/lib/blog-data';

function BlogPostsTable({ posts }: { posts: BlogPost[] }) {

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
        <BlogPostsTable posts={blogPosts} />
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
    const blogPosts = [
    {
      id: 1,
      title: "5 consells per optimitzar la teva logística d'última milla",
      date: "15 de Juliol, 2024",
      category: "Logística",
      excerpt: "Descobreix com millorar l'eficiència i reduir costos en l'etapa final del teu procés d'entrega.",
      image: PlaceHolderImages.find(i => i.id === "cargo-transport"),
    },
    {
      id: 2,
      title: "La importància de la tecnologia en el transport de passatgers",
      date: "5 de Juliol, 2024",
      category: "Tecnologia",
      excerpt: "Analitzem com la tecnologia està transformant l'experiència de viatjar i la gestió de flotes.",
      image: PlaceHolderImages.find(i => i.id === "passenger-transport"),
    },
    {
      id: 3,
      title: "Sostenibilitat en el transport: Reptes i oportunitats",
      date: "28 de Juny, 2024",
      category: "Sostenibilitat",
      excerpt: "Explorem les iniciatives i tecnologies que estan fent el sector del transport més respectuós amb el medi ambient.",
       image: {
        id: "green-truck",
        description: "A modern, eco-friendly truck on a road surrounded by nature.",
        imageUrl: "https://picsum.photos/seed/greentruck/600/400",
        imageHint: "green truck"
      }
    },
  ];


  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">El Nostre Blog</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">Notícies, tendències i consells sobre el món del transport i la logística.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map(post => (
          <Card key={post.id} className="overflow-hidden flex flex-col">
            {post.image && (
                <div className="relative aspect-video">
                    <Image src={post.image.imageUrl} alt={post.title} fill className="object-cover" data-ai-hint={post.image.imageHint} />
                </div>
            )}
            <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
                <CardTitle className="font-headline text-xl">
                    <Link href="#" className="hover:text-primary transition-colors">{post.title}</Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-muted-foreground text-sm">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{post.date}</span>
                <Link href="#" className="flex items-center gap-1 font-semibold text-primary">
                    Llegir més <ArrowRight className="w-4 h-4"/>
                </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

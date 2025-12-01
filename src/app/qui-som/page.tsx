
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const teamMembers = [
  {
    name: 'Albert Domenech',
    role: 'CEO i Fundador',
    avatarUrl: 'https://picsum.photos/seed/ceo/100/100',
    description:
      'Visió estratègica i lideratge per portar EnTrans al següent nivell.',
    avatarHint: 'man portrait serious',
  },
  {
    name: 'Carla Puig',
    role: 'Directora d\'Operacions',
    avatarUrl: 'https://picsum.photos/seed/coo/100/100',
    description: 'Assegurant que cada transport es realitzi amb la màxima eficiència i qualitat.',
    avatarHint: 'woman portrait professional',
  },
  {
    name: 'Marc Soler',
    role: 'Responsable de Tecnologia',
    avatarUrl: 'https://picsum.photos/seed/cto/100/100',
    description: 'Desenvolupant la tecnologia que fa possible la nostra plataforma.',
    avatarHint: 'man portrait glasses',
  },
];

const initialReviews = [
  {
    name: 'Transports Velocs',
    rating: 5,
    comment: 'Plataforma molt intuïtiva i un servei d\'atenció al client excel·lent. Hem optimitzat les nostres rutes i costos.',
  },
  {
    name: 'Maria Llopis',
    rating: 4,
    comment: 'Fàcil de fer servir per a sol·licituds particulars. Vaig trobar un transportista ràpidament per a la meva mudança.',
  },
];

export default function QuiSomPage() {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviews, setReviews] = useState(initialReviews);

  const handleReviewSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const comment = (form.elements.namedItem('comment') as HTMLTextAreaElement).value;

    if (name && comment && rating > 0) {
      setReviews([{ name, rating, comment }, ...reviews]);
      toast({
        title: 'Ressenya enviada!',
        description: 'Gràcies per la teva opinió.',
      });
      form.reset();
      setRating(0);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Si us plau, omple tots els camps i selecciona una valoració.',
      });
    }
  };

  return (
    <div className="container py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Sobre EnTrans
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          Connectant necessitats amb solucions. El nostre equip i els nostres
          clients són el cor de la nostra missió.
        </p>
      </div>

      {/* Team Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold font-headline text-center mb-12">
          El Nostre Equip
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <Card key={member.name} className="text-center">
              <CardContent className="p-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage asChild src={member.avatarUrl} alt={member.name} >
                     <Image src={member.avatarUrl} alt={member.name} width={100} height={100} data-ai-hint={member.avatarHint} />
                  </AvatarImage>
                  <AvatarFallback>
                    {member.name.charAt(0)}
                    {member.name.split(' ')[1]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold font-headline mb-4">
              La teva opinió ens importa
            </h2>
            <p className="text-muted-foreground mb-8">
              Deixa'ns una ressenya sobre la teva experiència amb EnTrans. Ens
              ajuda a millorar cada dia.
            </p>
            <Card>
              <CardHeader>
                <CardTitle>Escriu una ressenya</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">El teu nom</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Nom o nom de l'empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valoració</Label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 cursor-pointer transition-colors ${
                            (hoverRating || rating) >= star
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comment">Comentari</Label>
                    <Textarea
                      id="comment"
                      name="comment"
                      placeholder="Comparteix la teva experiència..."
                      rows={4}
                    />
                  </div>
                  <Button type="submit">Enviar Ressenya</Button>
                </form>
              </CardContent>
            </Card>
          </div>
          <div>
            <h2 className="text-3xl font-bold font-headline mb-8 text-center md:text-left">
              Què diuen els nostres clients
            </h2>
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-2">
                      <div className="flex-1">
                        <p className="font-semibold">{review.name}</p>
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                           {[...Array(5 - review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-gray-300"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "{review.comment}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

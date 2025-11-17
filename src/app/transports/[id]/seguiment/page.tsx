import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowLeft, Clock, Package, Warehouse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SeguimentPage({ params }: { params: { id: string }}) {
  const mapImage = PlaceHolderImages.find(img => img.id === 'map-tracking');
  const transportId = params.id;

  const timeline = [
    { status: 'Sol·licitud Creada', date: '25 de Juliol, 10:30', completed: true },
    { status: 'Transportista Assignat', date: '25 de Juliol, 14:00', completed: true },
    { status: 'Recollida a Origen', date: '26 de Juliol, 09:00', completed: true },
    { status: 'En Trànsit', date: '26 de Juliol, 09:30', completed: true },
    { status: 'Arribada a Destinació', date: 'Previst: 27 de Juliol, 18:00', completed: false },
    { status: 'Lliurat', date: 'Pendent', completed: false },
  ];

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href={`/transports/${transportId}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Enrere</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 font-headline">
          Seguiment del Transport #{transportId}
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_350px] lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
            <Card className="overflow-hidden">
                {mapImage && (
                    <div className="relative w-full aspect-[16/9]">
                        <Image 
                            src={mapImage.imageUrl}
                            alt={mapImage.description}
                            fill
                            className="object-cover"
                            data-ai-hint={mapImage.imageHint}
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                         <div className="absolute bottom-4 left-4 text-white">
                            <h2 className="font-bold text-2xl font-headline">Barcelona → València</h2>
                            <p className="text-sm">Actualitzat fa 2 minuts</p>
                        </div>
                    </div>
                )}
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Línia de Temps</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {timeline.map((item, index) => (
                        <li key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.completed ? 'bg-primary' : 'bg-muted border'}`}>
                                    {item.completed && <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>}
                                </div>
                                {index < timeline.length - 1 && (
                                <div className={`w-px h-full ${item.completed ? 'bg-primary/50' : 'bg-border'}`}></div>
                                )}
                            </div>
                            <div>
                                <p className={`font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{item.status}</p>
                                <p className="text-sm text-muted-foreground">{item.date}</p>
                            </div>
                        </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Detalls</CardDescription>
                    <CardTitle className="text-xl">Enviament de Palets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Warehouse className="h-4 w-4"/>
                        <span>Origen: Carrer de Sants, 123, Barcelona</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Package className="h-4 w-4"/>
                        <span>Destinació: Avinguda del Port, 456, València</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4"/>
                        <span>Arribada estimada: 27 de Juliol, 18:00</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

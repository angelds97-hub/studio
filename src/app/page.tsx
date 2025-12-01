import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CheckCircle, Truck, Users } from "lucide-react";
import Image from "next/image";
import { LoadingLink } from "@/components/loading-link";

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-truck');

  const services = [
    {
      icon: <Truck className="w-8 h-8 text-primary" />,
      title: "Transport de Càrrega",
      description: "Solucions eficients i segures per al transport de les teves mercaderies."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Transport de Passatgers",
      description: "Viatges còmodes i puntuals per a grups de totes les mides."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: "Solucions a Mida",
      description: "Adaptem els nostres serveis a les teves necessitats específiques."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] bg-gray-900 text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 leading-tight">La teva solució logística de confiança</h1>
          <p className="text-lg md:text-xl max-w-3xl mb-8">Connectem les teves necessitats de transport amb els millors professionals del sector. Ràpid, fàcil i segur.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <LoadingLink href="/solicituts/nova">Sol·licita un transport</LoadingLink>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <LoadingLink href="/serveis">Els nostres serveis</LoadingLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold font-headline">Què oferim?</h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Ens especialitzem a oferir una plataforma robusta per a totes les teves necessitats de transport.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  {services.map(service => (
                      <Card key={service.title} className="text-center">
                          <CardContent className="p-6">
                              <div className="flex justify-center mb-4">{service.icon}</div>
                              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                              <p className="text-muted-foreground">{service.description}</p>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </div>
      </section>

       {/* CTA Section */}
       <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-headline mb-4">Preparat per començar?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">Crea un compte avui mateix i descobreix la forma més senzilla de gestionar els teus transports.</p>
          <Button size="lg" asChild>
            <LoadingLink href="/registre">Registra't gratis</LoadingLink>
          </Button>
        </div>
      </section>
    </div>
  );
}

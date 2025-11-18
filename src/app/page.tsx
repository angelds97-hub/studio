import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CheckCircle, Truck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'cargo-transport');
  const reusImage = PlaceHolderImages.find(img => img.id === 'reus-city');
  const pigImage = PlaceHolderImages.find(img => img.id === 'happy-pig');

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
      <section className="relative w-full h-[60vh] text-white">
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
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">La teva solució logística de confiança</h1>
          <p className="text-lg md:text-xl max-w-3xl mb-8">Connectem les teves necessitats de transport amb els millors professionals del sector. Ràpid, fàcil i segur.</p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/solicituts/nova">Sol·licita un transport</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/serveis">Els nostres serveis</Link>
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

      {/* New Images Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">Imatges Addicionals</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Una petita mostra visual.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {reusImage && (
              <Card>
                <CardContent className="p-4">
                  <div className="relative aspect-video">
                    <Image
                      src={reusImage.imageUrl}
                      alt={reusImage.description}
                      fill
                      className="object-cover rounded-md"
                      data-ai-hint={reusImage.imageHint}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mt-4">{reusImage.description}</h3>
                </CardContent>
              </Card>
            )}
            {pigImage && (
              <Card>
                <CardContent className="p-4">
                  <div className="relative aspect-video">
                    <Image
                      src={pigImage.imageUrl}
                      alt={pigImage.description}
                      fill
                      className="object-cover rounded-md"
                      data-ai-hint={pigImage.imageHint}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mt-4">Un Porquet Feliç</h3>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

       {/* CTA Section */}
       <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-headline mb-4">Preparat per començar?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">Crea un compte avui mateix i descobreix la forma més senzilla de gestionar els teus transports.</p>
          <Button size="lg" asChild>
            <Link href="/registre">Registra't gratis</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

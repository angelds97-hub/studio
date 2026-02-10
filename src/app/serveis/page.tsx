import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function ServeisPage() {
  const serviceFeatures = [
    {
      title: "Transport de Càrrega",
      description: "Solucions logístiques completes per a mercaderies de qualsevol tipus i mida.",
      features: ["Flota de vehicles moderna", "Seguiment en temps real", "Assegurança de mercaderies", "Emmagatzematge i distribució"]
    },
    {
      title: "Logística Integral",
      description: "Optimitzem tota la teva cadena de subministrament.",
      features: ["Gestió d'estocs", "Picking i packing", "Cross-docking", "Logística inversa"]
    }
  ]
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Els Nostres Serveis</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">Oferim una gamma completa de solucions de transport i logística dissenyades per a la màxima eficiència i fiabilitat.</p>
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
        {serviceFeatures.map(service => (
          <Card key={service.title} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-muted-foreground mb-6">{service.description}</p>
              <ul className="space-y-3 text-sm mt-auto">
                {service.features.map(feature => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

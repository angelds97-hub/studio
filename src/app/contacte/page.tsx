import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactePage() {
  return (
    <div className="container py-12">
       <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Contacta amb Nosaltres</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">Tens alguna pregunta o vols un pressupost? Estem aquí per ajudar-te.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
            <Card>
                <CardContent className="p-6">
                    <form
                      action="https://formspree.io/f/xblnopqq"
                      method="POST"
                      className="space-y-4"
                    >
                        <div className="grid sm:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input id="name" name="name" placeholder="El teu nom" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correu electrònic</Label>
                                <Input id="email" type="email" name="email" placeholder="correu@exemple.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Assumpte</Label>
                            <Input id="subject" name="subject" placeholder="Sobre què vols parlar?" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Missatge</Label>
                            <Textarea id="message" name="message" placeholder="Escriu el teu missatge aquí." rows={5} />
                        </div>
                        <Button type="submit" className="w-full">Enviar Missatge</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
         <div className="space-y-8">
            <h2 className="text-2xl font-bold font-headline">Informació de Contacte</h2>
            <div className="space-y-4 text-lg">
                <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-primary" />
                    <span>Carrer de la Logística, 123, 08001 Barcelona</span>
                </div>
                <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-primary" />
                    <a href="tel:+34930123456" className="hover:text-primary">+34 930 123 456</a>
                </div>
                <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-primary" />
                    <a href="mailto:contacte@entrans.app" className="hover:text-primary">contacte@entrans.app</a>
                </div>
            </div>
             <div className="aspect-video w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.686414399723!2d2.152062315394981!3d41.38090297926447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a263c9651a2d%3A0x498a44026043f339!2sPla%C3%A7a%20d'Espanya%2C%20Barcelona!5e0!3m2!1sen!2ses!4v1678886300000!5m2!1sen!2ses"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
        </div>
      </div>
    </div>
  );
}

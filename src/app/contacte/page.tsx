import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);


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
            <div className="space-y-6">
                <div className="flex items-center gap-4 text-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                    <span>Carrer de la Logística, 123, 08001 Barcelona</span>
                </div>
                <div className="flex items-center gap-4 text-lg">
                    <Phone className="w-6 h-6 text-primary" />
                    <a href="tel:+34930123456" className="hover:text-primary">+34 930 123 456</a>
                </div>
                <div className="flex items-center gap-4 text-lg">
                    <Mail className="w-6 h-6 text-primary" />
                    <a href="mailto:contacte@entrans.app" className="hover:text-primary">contacte@entrans.app</a>
                </div>
                <Button asChild size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white">
                  <Link href="https://wa.me/34600000000" target="_blank">
                    <WhatsAppIcon className="w-5 h-5 mr-2" />
                    Parla amb nosaltres per WhatsApp
                  </Link>
                </Button>
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

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ConfiguracioPage() {
  return (
    <div className="grid gap-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-headline font-bold">Configuració</h1>
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>
            Gestiona la informació del teu perfil públic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" defaultValue="Admin" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Correu Electrònic</Label>
                <Input id="email" type="email" defaultValue="admin@entrans.app" />
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Desar canvis</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notificacions</CardTitle>
          <CardDescription>
            Tria com vols rebre les notificacions.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="email-notifications" defaultChecked />
            <label
              htmlFor="email-notifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Notificacions per correu electrònic
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="push-notifications" />
            <label
              htmlFor="push-notifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Notificacions push
            </label>
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id="offers-notifications" defaultChecked />
            <label
              htmlFor="offers-notifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Avisar-me de noves ofertes
            </label>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Desar canvis</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

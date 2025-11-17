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
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Users,
  Truck,
  FileText,
  MoreHorizontal,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { activeTransports, recentRequests } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sol·licituds Obertes
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 des de l'última setmana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transports en Curs
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              1 a punt de finalitzar
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transportistes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +5 nous aquest mes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Sol·licituds Recents</CardTitle>
              <CardDescription>
                Les darreres sol·licituds de transport registrades.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/solicituts">
                Veure-les totes
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead className="hidden sm:table-cell">Tipus</TableHead>
                  <TableHead className="text-right">Data</TableHead>
                  <TableHead>
                    <span className="sr-only">Accions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="font-medium">{request.requester.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        ID: {request.id.slice(0, 8)}...
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.origin} → {request.destination}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="capitalize">
                        {request.transportType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {format(request.dates.from, 'dd MMM, yyyy', {
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
                          <DropdownMenuItem>
                            <Link href={`/transports/${request.id}`} className="w-full">
                              Veure detalls
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Contactar client</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transports Actius</CardTitle>
            <CardDescription>
              Seguiment dels transports que estan actualment en ruta.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {activeTransports.map((transport) => (
              <div key={transport.id} className="flex items-center gap-4">
                <Truck className="h-6 w-6 text-muted-foreground" />
                <div className="grid gap-1 w-full">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {transport.origin} → {transport.destination}
                    </p>
                    <p className="text-sm text-muted-foreground">{transport.progress}%</p>
                  </div>
                  <Progress value={transport.progress} aria-label={`${transport.progress}% completat`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

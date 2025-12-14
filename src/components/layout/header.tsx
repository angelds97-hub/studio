'use client';

import { Bell, Search, Settings, LogOut, User as UserIcon, CheckCircle2, ShieldAlert, Info } from 'lucide-react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '../ui/sidebar';
import { formatDistanceToNow } from 'date-fns';
import { ca } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/types';
import { LoadingLink } from '../loading-link';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

type Shipment = {
  id: string;
  client: string;
  desti: string;
  descripcio: string;
  estat: 'Pendent' | 'En preparació' | 'En trànsit' | 'Duanes' | 'Lliurat' | 'Incidència';
};

type DynamicNotification = {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  date: Date;
};

export function AppHeader() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<DynamicNotification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  useEffect(() => {
    // This runs on the client, after hydration
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
    }
  }, []);

   useEffect(() => {
    if (!userProfile?.empresa) {
      return;
    }

    const fetchShipmentsAndCreateNotifications = async () => {
      setIsLoadingNotifications(true);
      try {
        const response = await fetch(
          `https://sheetdb.io/api/v1/sjvdps9wa0f8z/search?client=${encodeURIComponent(
            userProfile.empresa!
          )}&sheet=seguiment`
        );
        if (!response.ok) {
          throw new Error("No s'han pogut carregar els enviaments.");
        }
        const shipments: Shipment[] = await response.json();

        const generatedNotifications = shipments
          .map((shipment): DynamicNotification | null => {
            const common = { id: shipment.id, date: new Date() }; // Date can be improved if available in sheet
            switch (shipment.estat) {
              case 'Lliurat':
                return {
                  ...common,
                  title: 'Enviament Lliurat',
                  description: `L'enviament ${shipment.id} ha estat lliurat.`,
                  icon: CheckCircle2,
                };
              case 'Duanes':
              case 'Incidència':
                return {
                  ...common,
                  title: 'Incidència en Enviament',
                  description: `L'enviament ${shipment.id} requereix atenció.`,
                  icon: ShieldAlert,
                };
              case 'En trànsit':
                 return {
                  ...common,
                  title: 'Enviament en Camí',
                  description: `L'enviament ${shipment.id} està en trànsit cap a ${shipment.desti}.`,
                  icon: Info,
                };
              default:
                return null;
            }
          })
          .filter((n): n is DynamicNotification => n !== null);
        
        setNotifications(generatedNotifications);

      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    fetchShipmentsAndCreateNotifications();
  }, [userProfile]);


  const handleSignOut = () => {
    localStorage.removeItem('loggedInUser');
    router.push('/');
  };

  const getInitials = () => {
    if (userProfile) {
      return `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`;
    }
    return 'U';
  };
  
  const unreadCount = notifications.length;


  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cercar transports..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="relative shrink-0">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
            <span className="sr-only">Veure notificacions</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div className="p-4 font-medium">Notificacions</div>
          <div className="border-t">
            {isLoadingNotifications ? (
                <div className="p-4 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border-b p-4 grid grid-cols-[2rem_1fr] items-start gap-4 last:border-b-0"
                >
                  <notification.icon className="h-5 w-5 text-muted-foreground" />
                  <div className="grid gap-1">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                     <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.date, {
                        addSuffix: true,
                        locale: ca,
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
                 <p className="p-4 text-sm text-muted-foreground text-center">No tens notificacions noves.</p>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={userProfile?.avatarUrl}
                alt={userProfile?.email}
              />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Obrir menú d'usuari</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>El meu compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <LoadingLink href="/dashboard/perfil">
              <UserIcon className="mr-2 h-4 w-4" />
              Perfil
            </LoadingLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <LoadingLink href="/configuracio">
              <Settings className="mr-2 h-4 w-4" />
              Configuració
            </LoadingLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Tancar sessió
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

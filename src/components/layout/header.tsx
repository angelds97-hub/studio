'use client';

import {
  Bell,
  Home,
  Package2,
  Search,
  Settings,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
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
import { notifications } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { ca } from 'date-fns/locale';
import { useAuth, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { LoadingLink } from '../loading-link';


export function AppHeader() {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const auth = useAuth();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push('/');
    });
  };
  
  const getInitials = () => {
    if (userProfile) {
      return `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`;
    }
    return 'U';
  };

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
            {notifications.map((notification) => (
              <div key={notification.id} className="border-b p-4 grid grid-cols-[2rem_1fr] items-start gap-4 last:border-b-0">
                <notification.icon className="h-5 w-5 text-muted-foreground" />
                <div className="grid gap-1">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(notification.date, { addSuffix: true, locale: ca })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-2 text-center text-sm">
            <Button variant="link" size="sm" asChild>
              <Link href="#">Veure-les totes</Link>
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile?.avatarUrl} alt={userProfile?.email} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Obrir menú d'usuari</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>El meu compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <LoadingLink href="/configuracio"><Settings className="mr-2 h-4 w-4" />Configuració</LoadingLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <LoadingLink href="#"><UserIcon className="mr-2 h-4 w-4" />Perfil</LoadingLink>
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

    
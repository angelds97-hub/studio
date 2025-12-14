'use client';
import { TransportRequestForm } from '@/components/transport-request-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';

function UserIdentifier({
  user,
  isLoading,
}: {
  user: UserProfile | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  
  const getInitials = () => {
    if (user) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return 'U';
  };


  return (
    <Card className="mb-8 bg-secondary/50">
      <CardContent className="p-4 flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatarUrl} alt={user.email} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{`${user.firstName} ${user.lastName}`}</p>
          <p className="text-sm text-muted-foreground">{user.email} ({user.empresa})</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NovaSolicitutPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
    setIsLoading(false);
  }, []);

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <UserIdentifier user={currentUser} isLoading={isLoading} />
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Crear una nova sol·licitud de transport
            </CardTitle>
            <CardDescription>
              Omple el formulari següent amb els detalls del transport que
              necessites. Aquesta sol·licitud quedarà associada al teu compte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransportRequestForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

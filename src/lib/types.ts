import { FieldValue } from 'firebase/firestore';

export type TransportRequest = {
  id: string;
  userProfileId: string;
  requesterId?: string; // Make optional or ensure it's always there
  transportType: 'passatgers' | 'càrrega';
  origin: string;
  destination: string;
  dates: { from: string; to?: string };
  specialRequirements?: string;
  status: 'oberta' | 'assignada' | 'completada';
};

export type TransportOffer = {
  id: string;
  company: {
    name: string;
    logoUrl: string;
    rating: number;
  };
  price: number;
  estimatedArrival: Date;
  vehicle: string;
};

export type User = {
  name: string;
  avatarUrl: string;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  role: 'administrador' | 'treballador' | 'client/proveidor' | 'extern';
  creationDate: string;
  avatarUrl?: string;
};

export type RegistrationRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'pending';
  requestedAt: any; // serverTimestamp
};

export type Notification = {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  read: boolean;
  date: Date;
};

export type ActiveTransport = {
  id: string;
  origin: string;
  destination: string;
  status: 'recollint' | 'en trànsit' | 'lliurat';
  progress: number;
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  imageHint: string;
  excerpt: string;
  authorId: string;
  createdAt: string | FieldValue;
  updatedAt: string | FieldValue;
};

// Utility type to add an 'id' field from Firestore documents
export type WithId<T> = T & { id: string };

export type TransportRequest = {
  id: string;
  userProfileId: string;
  transportType: 'passatgers' | 'càrrega';
  origin: string;
  destination: string;
  dates: { from: string; to: string }; // Changed to string to match firestore
  specialRequirements: string;
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
  createdAt: string;
  updatedAt: string;
};

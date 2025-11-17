export type TransportRequest = {
  id: string;
  requester: User;
  transportType: 'passatgers' | 'càrrega';
  origin: string;
  destination: string;
  dates: { from: Date; to: Date };
  specialRequirements: string;
  status: 'oberta' | 'assignada' | 'completada';
  offersCount: number;
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

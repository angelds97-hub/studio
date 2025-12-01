import { notFound } from 'next/navigation';
import TransportDetail from '@/components/transport-detail';
import type { TransportRequest, UserProfile, TransportOffer } from '@/lib/types';
import { transportRequests as mockTransportRequests } from '@/lib/data';
import { users as mockUsers } from '@/lib/data';
import { transportOffers as mockTransportOffers } from '@/lib/data';

// This function tells Next.js which pages to generate at build time.
export async function generateStaticParams() {
  // In a real app, you'd fetch this from your CMS or database
  // For this static export example, we'll use the mock data
  return mockTransportRequests.map((request) => ({
    id: request.id,
  }));
}

// This is the page component itself, running on the server.
export default async function TransportDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;

    // Fetch data on the server.
    // For this example, we'll use the mock data to find the request.
    const request = mockTransportRequests.find((r) => r.id === id);

    if (!request) {
        // If no request is found, trigger a 404 page.
        notFound();
    }
    
    // Find the requester from mock data
    const requester = mockUsers[request.requesterId] as UserProfile | null;
    
    // Find offers for this request
    const offers = mockTransportOffers[request.id] || [];

    // The data is fetched on the server and then passed to the client component for rendering.
    // The TransportDetail component is the one marked with 'use client'.
    return <TransportDetail request={request} requesterProfile={requester} offers={offers}/>;
}

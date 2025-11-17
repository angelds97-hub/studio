'use server';
/**
 * @fileOverview Summarizes transport offers, highlighting key factors like price, ratings, and estimated arrival.
 *
 * - summarizeTransportOffers - A function that summarizes transport offers.
 * - SummarizeTransportOffersInput - The input type for the summarizeTransportOffers function.
 * - SummarizeTransportOffersOutput - The return type for the summarizeTransportOffers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTransportOffersInputSchema = z.object({
  transportOffers: z.string().describe('A list of transport offers from companies.'),
});
export type SummarizeTransportOffersInput = z.infer<typeof SummarizeTransportOffersInputSchema>;

const SummarizeTransportOffersOutputSchema = z.object({
  summary: z.string().describe('A summary of the transport offers, highlighting the most important factors.'),
});
export type SummarizeTransportOffersOutput = z.infer<typeof SummarizeTransportOffersOutputSchema>;

export async function summarizeTransportOffers(input: SummarizeTransportOffersInput): Promise<SummarizeTransportOffersOutput> {
  return summarizeTransportOffersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTransportOffersPrompt',
  input: {schema: SummarizeTransportOffersInputSchema},
  output: {schema: SummarizeTransportOffersOutputSchema},
  prompt: `You are an AI assistant helping users to find the best transport offers.
  Summarize the following transport offers, highlighting the most important factors such as price, ratings, and estimated arrival, so that the user can quickly compare and choose the best option for their transport needs.
  Transport Offers: {{{transportOffers}}}`,
});

const summarizeTransportOffersFlow = ai.defineFlow(
  {
    name: 'summarizeTransportOffersFlow',
    inputSchema: SummarizeTransportOffersInputSchema,
    outputSchema: SummarizeTransportOffersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

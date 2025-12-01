import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/layout/providers';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EnTrans - La teva plataforma de transports',
  description: 'Contracta transports de manera fàcil i ràpida.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: 'hsl(var(--primary))',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" suppressHydrationWarning className={cn(inter.variable, spaceGrotesk.variable)}>
      <head />
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
        <Toaster />
        <Script id="tawk-to-vars" strategy="beforeInteractive">
            {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();`}
        </Script>
        <Script
            id="tawk-to-script"
            strategy="lazyOnload"
            src="https://embed.tawk.to/692d73b50962891980a79253/1jbconvno"
            async
        />
      </body>
    </html>
  );
}

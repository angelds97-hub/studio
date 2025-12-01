'use client';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider, useUser } from '@/firebase';
import './globals.css';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Truck, Facebook, Twitter, Linkedin, Menu, LogIn, UserPlus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';


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

// Metadata can be defined in a Server Component layout, but not here.
// export const metadata: Metadata = {
//   title: 'EnTrans - La teva plataforma de transports',
//   description: 'Contracta transports de manera fàcil i ràpida.',
// };

const navLinks = [
  { href: '/', label: 'Inici' },
  { href: '/serveis', label: 'Serveis' },
  { href: '/blog', label: 'Blog' },
  { href: '/qui-som', label: 'Qui Som' },
  { href: '/contacte', label: 'Contacte' },
];

function SiteHeader() {
  const { user } = useUser();
  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Truck className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              EnTrans
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
           <div className="md:hidden flex-1">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Obrir menú</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <SheetHeader className="p-4">
                      <SheetTitle className="sr-only">Menú de navegació</SheetTitle>
                  </SheetHeader>
                <div className="flex flex-col gap-4 p-4">
                    <Link href="/" className="flex items-center space-x-2">
                         <Truck className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline">EnTrans</span>
                    </Link>
                    <nav className="flex flex-col gap-4">
                         {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="text-lg font-medium hover:text-primary">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                     <div className="mt-auto flex flex-col gap-2">
                      {isLoggedIn ? (
                        <Button asChild>
                            <Link href="/dashboard">Àrea Client</Link>
                        </Button>
                      ) : (
                        <>
                          <Button asChild>
                              <Link href="/login"><LogIn className="mr-2 h-4 w-4"/> Iniciar Sessió</Link>
                          </Button>
                          <Button asChild variant="outline">
                             <Link href="/registre"><UserPlus className="mr-2 h-4 w-4"/> Registrar-se</Link>
                          </Button>
                        </>
                      )}
                     </div>
                </div>
                </SheetContent>
            </Sheet>
           </div>
           
          <div className="md:hidden flex-1 flex justify-center">
            <Link href="/" className="flex items-center space-x-2">
              <Truck className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline">EnTrans</span>
            </Link>
          </div>

          <nav className="flex items-center gap-2 flex-1 justify-end">
             {isLoggedIn ? (
              <Button asChild className="hidden md:flex">
                  <Link href="/dashboard">Àrea Client</Link>
              </Button>
            ) : (
              <div className="hidden md:flex gap-2">
                <Button asChild variant="ghost">
                    <Link href="/login">Iniciar Sessió</Link>
                </Button>
                <Button asChild>
                    <Link href="/registre">Registrar-se</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container py-12 px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                         <Link href="/" className="flex items-center space-x-2">
                            <Truck className="h-7 w-7 text-primary" />
                            <span className="font-bold text-xl font-headline">EnTrans</span>
                        </Link>
                        <p className="text-sm text-gray-400">La teva solució logística de confiança. Movent el teu negoci cap endavant.</p>
                    </div>
                     <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Navegació</h4>
                        <nav className="grid gap-2">
                            {navLinks.map(link => (
                                <Link key={link.href} href={link.href} className="text-sm text-gray-400 hover:text-white">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                     <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Legal</h4>
                        <nav className="grid gap-2">
                           <Link href="#" className="text-sm text-gray-400 hover:text-white">Política de Privacitat</Link>
                           <Link href="#" className="text-sm text-gray-400 hover:text-white">Termes i Condicions</Link>
                           <Link href="#" className="text-sm text-gray-400 hover:text-white">Política de Cookies</Link>
                        </nav>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Segueix-nos</h4>
                        <div className="flex space-x-2">
                            <Link href="#" aria-label="Facebook" className="text-gray-400 hover:text-white p-2">
                                <Facebook className="h-6 w-6" />
                            </Link>
                            <Link href="#" aria-label="Twitter" className="text-gray-400 hover:text-white p-2">
                                <Twitter className="h-6 w-6" />
                            </Link>
                             <Link href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white p-2">
                                <Linkedin className="h-6 w-6" />
                            </Link>
                        </div>
                    </div>
                </div>
                 <div className="mt-8 border-t border-gray-800 pt-4 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} EnTrans. Tots els drets reservats.</p>
                </div>
            </div>
        </footer>
    )
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/configuracio');

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {!isAuthedRoute && <SiteHeader />}
      <div className="flex-1 flex flex-col">{children}</div>
      {!isAuthedRoute && <SiteFooter />}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" suppressHydrationWarning className={cn(inter.variable, spaceGrotesk.variable)}>
      <head>
        <title>EnTrans - La teva plataforma de transports</title>
        <meta name="description" content="Contracta transports de manera fàcil i ràpida. Connectem les teves necessitats de transport amb els millors professionals." />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
            <MainLayout>
              {children}
            </MainLayout>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}

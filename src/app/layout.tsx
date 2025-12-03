import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { GeistSans } from 'geist/font/sans';
import { AuthProvider } from '@/components/auth/AuthProvider';
import BottomNav from '@/components/pec-ai/BottomNav';

export const metadata: Metadata = {
  title: 'PEC.AI - Comunicação Alternativa com IA',
  description: 'Crie cartões de comunicação PEC personalizados com Inteligência Artificial. Facilitando a comunicação para pessoas com necessidades especiais.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
  openGraph: {
    title: 'PEC.AI - Comunicação Alternativa com IA',
    description: 'Crie cartões de comunicação PEC personalizados com Inteligência Artificial',
    images: ['/logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'PEC.AI - Comunicação Alternativa com IA',
    description: 'Crie cartões de comunicação PEC personalizados com Inteligência Artificial',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={GeistSans.className}>
      <body className="pb-16">
        <AuthProvider>
          <main className="antialiased">{children}</main>
          <BottomNav />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

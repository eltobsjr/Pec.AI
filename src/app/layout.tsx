import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { GeistSans } from 'geist/font/sans';
import { AuthProvider } from '@/components/auth/AuthProvider';
import BottomNav from '@/components/pec-ai/BottomNav';

export const metadata: Metadata = {
  title: 'PEC.AI',
  description: 'Gere cartões de comunicação PEC com IA',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
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

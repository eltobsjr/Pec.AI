import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { GeistSans } from 'geist/font/sans';

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
      <body>
        <main className="antialiased">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}

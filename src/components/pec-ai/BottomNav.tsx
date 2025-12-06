'use client';

import { Home, Library, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';

export default function BottomNav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Não mostrar navbar em páginas de auth ou se não estiver logado
  if (loading || !user || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Início',
    },
    {
      href: '/library',
      icon: Library,
      label: 'Biblioteca',
    },
    {
      href: '/profile',
      icon: User,
      label: 'Perfil',
    },
    {
      href: '/settings',
      icon: Settings,
      label: 'Config',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-around h-14 sm:h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-w-[56px] sm:min-w-[64px] h-full transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5 sm:h-6 sm:w-6', isActive && 'scale-110')} />
                <span className={cn(
                  'text-[10px] sm:text-xs font-medium',
                  isActive && 'font-semibold'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

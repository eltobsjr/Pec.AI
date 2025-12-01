import { MessageCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 100 100" className="text-primary-foreground">
            <rect width="100" height="100" rx="20" fill="currentColor"/>
            <path d="M20 30H80V70H20z" fill="#F0F8FF"/>
            <circle cx="50" cy="50" r="15" fill="#77B5B0"/>
          </svg>
          <h1 className="text-2xl font-bold text-primary-foreground font-headline">
            PEC.AI
          </h1>
        </div>
      </div>
    </header>
  );
}

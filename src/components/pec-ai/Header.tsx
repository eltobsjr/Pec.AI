'use client';

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-center px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">P</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            PEC.AI
          </h1>
        </div>
      </div>
    </header>
  );
}

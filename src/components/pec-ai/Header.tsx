import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="PEC.AI Logo" width={36} height={36} />
          <h1 className="text-2xl font-bold text-foreground">
            PEC.AI
          </h1>
        </div>
      </div>
    </header>
  );
}

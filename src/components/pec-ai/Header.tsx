'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="/logo.svg"
            alt="PEC.AI Logo"
            width={180}
            height={48}
            priority
            className="h-10 w-auto"
          />
        </Link>
      </div>
    </header>
  );
}

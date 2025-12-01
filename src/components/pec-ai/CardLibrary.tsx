'use client';

import type { PecCard as PecCardType } from '@/lib/types';
import PecCard from './PecCard';
import { Inbox } from 'lucide-react';

type CardLibraryProps = {
  cards: PecCardType[];
  onDeleteCard: (id: string) => void;
  onReorderInPhrase: (draggedId: string, targetId: string) => void;
};

export default function CardLibrary({ cards, onDeleteCard, onReorderInPhrase }: CardLibraryProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg mt-4">
        <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-foreground">Biblioteca Vazia</h3>
        <p className="mt-1 text-sm text-muted-foreground">Crie seu primeiro cartão para começar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
      {cards.map((card) => (
        <PecCard
          key={card.id}
          card={card}
          location="library"
          onDeleteFromLibrary={onDeleteCard}
          onReorderInPhrase={onReorderInPhrase}
        />
      ))}
    </div>
  );
}

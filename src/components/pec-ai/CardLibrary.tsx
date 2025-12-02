'use client';

import type { PecCard as PecCardType } from '@/lib/types';
import PecCard from './PecCard';
import { Inbox, PlusCircle } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from '@/lib/utils';


type CardLibraryProps = {
  cards: PecCardType[];
  allCategories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onDeleteCard: (id: string) => void;
  onAddToPhrase: (card: PecCardType) => void;
};

export default function CardLibrary({
  cards,
  allCategories,
  activeCategory,
  onSelectCategory,
  onDeleteCard,
  onAddToPhrase
}: CardLibraryProps) {

  const addCardToLibrary = (newCardData: Omit<PecCardType, 'id'>) => {
    const newCard = { ...newCardData, id: Date.now().toString() };
    // This is a bit of a hack, we should lift the state up
    // for now, we just reload the page to see the new card
    window.location.reload();
  };

  return (
    <div className="bg-card p-4 sm:p-6 rounded-xl shadow-lg border">
       <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Biblioteca de Cartões</h2>
        <ImageUploader onCardGenerated={addCardToLibrary}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Cartão
            </Button>
        </ImageUploader>
      </div>

      {allCategories.length > 2 && (
         <ScrollArea className="w-full whitespace-nowrap rounded-lg">
            <div className="flex w-max space-x-2 pb-4">
                {allCategories.map((category) => (
                <Button
                    key={category}
                    variant={activeCategory === category ? 'default' : 'outline'}
                    onClick={() => onSelectCategory(category)}
                    className={cn(
                        "capitalize",
                        activeCategory === category && "bg-primary text-primary-foreground"
                    )}
                >
                    {category === 'all' ? 'Todos' : category}
                </Button>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      {cards.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg mt-4">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-base font-semibold text-foreground">Biblioteca Vazia</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeCategory === 'all'
                ? 'Crie seu primeiro cartão para começar.'
                : `Nenhum cartão na categoria "${activeCategory}".`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
          {cards.map((card) => (
            <PecCard
              key={card.id}
              card={card}
              location="library"
              onDeleteFromLibrary={onDeleteCard}
              onAddToPhrase={onAddToPhrase}
            />
          ))}
        </div>
      )}
    </div>
  );
}

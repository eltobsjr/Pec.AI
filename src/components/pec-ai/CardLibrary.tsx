'use client';

import { useState, useMemo } from 'react';
import type { PecCard as PecCardType } from '@/lib/types';
import PecCard from './PecCard';
import { Inbox, PlusCircle, Search, X } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from '@/lib/utils';


type CardLibraryProps = {
  cards: PecCardType[];
  allCategories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onDeleteCard: (id: string) => void;
  onAddToPhrase: (card: PecCardType) => void;
  onToggleFavorite: (id: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  newCardButtonRef?: React.RefObject<HTMLButtonElement>;
};

export default function CardLibrary({
  cards,
  allCategories,
  activeCategory,
  onSelectCategory,
  onDeleteCard,
  onAddToPhrase,
  onToggleFavorite,
  searchInputRef,
  newCardButtonRef
}: CardLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const addCardToLibrary = (newCardData: Omit<PecCardType, 'id'>) => {
    // Recarregar a página para buscar novos dados
    window.location.reload();
  };

  // Filtrar cartões por busca
  const filteredCards = useMemo(() => {
    return cards.filter(card => 
      card.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cards, searchQuery]);

  return (
    <section className="bg-card p-3 sm:p-4 md:p-5 rounded-xl shadow-lg border">
       <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Biblioteca de Cartões</h2>
        <ImageUploader onCardGenerated={addCardToLibrary}>
            <Button ref={newCardButtonRef} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Cartão
            </Button>
        </ImageUploader>
      </div>

      {/* Campo de busca */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Buscar cartões por nome..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={() => setSearchQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {allCategories.length > 2 && (
         <ScrollArea className="w-full whitespace-nowrap rounded-lg">
            <div className="flex w-max space-x-2 pb-4">
                <Button
                    key="favorites"
                    variant={activeCategory === 'favorites' ? 'default' : 'outline'}
                    onClick={() => onSelectCategory('favorites')}
                    className={cn(
                        "capitalize",
                        activeCategory === 'favorites' && "bg-primary text-primary-foreground"
                    )}
                >
                    ⭐ Favoritos
                </Button>
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

      {filteredCards.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg mt-4">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-base font-semibold text-foreground">
            {searchQuery ? 'Nenhum Resultado' : 'Biblioteca Vazia'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery 
              ? `Nenhum cartão encontrado para "${searchQuery}"`
              : activeCategory === 'all'
                ? 'Crie seu primeiro cartão para começar.'
                : `Nenhum cartão na categoria "${activeCategory}".`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4">
          {filteredCards.map((card) => (
            <PecCard
              key={card.id}
              card={card}
              location="library"
              onDeleteFromLibrary={onDeleteCard}
              onAddToPhrase={onAddToPhrase}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}

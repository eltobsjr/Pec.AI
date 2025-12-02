'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/pec-ai/Header';
import ImageUploader from '@/components/pec-ai/ImageUploader';
import CardLibrary from '@/components/pec-ai/CardLibrary';
import PhraseBuilder from '@/components/pec-ai/PhraseBuilder';
import type { PecCard } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [cards, setCards] = useState<PecCard[]>([]);
  const [phraseCards, setPhraseCards] = useState<PecCard[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCards = localStorage.getItem('pec-ai-cards');
      if (savedCards) {
        setCards(JSON.parse(savedCards));
      }
    } catch (error) {
      console.error('Failed to load cards from localStorage', error);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('pec-ai-cards', JSON.stringify(cards));
      } catch (error) {
        console.error('Failed to save cards to localStorage', error);
      }
    }
  }, [cards, isMounted]);

  const categories = useMemo(() => {
    const allCategories = cards.map((card) => card.category);
    return ['all', ...Array.from(new Set(allCategories))];
  }, [cards]);
  
  const filteredCards = useMemo(() => {
    if (activeCategory === 'all') {
      return cards;
    }
    return cards.filter((card) => card.category === activeCategory);
  }, [cards, activeCategory]);

  const addCardToLibrary = (newCardData: Omit<PecCard, 'id'>) => {
    const newCard = { ...newCardData, id: Date.now().toString() };
    setCards((prev) => [newCard, ...prev]);
  };

  const addCardToPhrase = (card: PecCard) => {
    setPhraseCards((prev) => [...prev, card]);
  };

  const removeCardFromPhrase = (cardId: string) => {
    setPhraseCards((prev) => {
      const cardIndex = prev.findIndex(c => c.id === cardId);
      if (cardIndex > -1) {
        const newCards = [...prev];
        newCards.splice(cardIndex, 1);
        return newCards;
      }
      return prev;
    });
  };

  const reorderPhraseCards = (draggedId: string, targetId: string) => {
    const dragIndex = phraseCards.findIndex((c) => c.id === draggedId);
    const targetIndex = phraseCards.findIndex((c) => c.id === targetId);

    if (dragIndex > -1 && targetIndex > -1) {
      const newCards = [...phraseCards];
      const [draggedItem] = newCards.splice(dragIndex, 1);
      newCards.splice(targetIndex, 0, draggedItem);
      setPhraseCards(newCards);
    }
  };

  const clearPhrase = () => {
    setPhraseCards([]);
  };

  const deleteCardFromLibrary = (cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    setPhraseCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-48" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="aspect-square w-full rounded-lg" />
                        <Skeleton className="h-6 w-3/4 mx-auto" />
                    </div>
                ))}
              </div>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid gap-8">
          <PhraseBuilder
            cards={phraseCards}
            onDrop={addCardToPhrase}
            onRemove={removeCardFromPhrase}
            onClear={clearPhrase}
            onReorder={reorderPhraseCards}
          />
          <CardLibrary
            cards={filteredCards}
            allCategories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onDeleteCard={deleteCardFromLibrary}
            onAddToPhrase={addCardToPhrase}
          />
        </div>
      </main>
      <footer className="container mx-auto p-4 md:px-6 text-center text-sm text-muted-foreground">
        <p>PEC.AI - Criado com Inteligência Artificial</p>
      </footer>
    </div>
  );
}

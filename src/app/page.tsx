'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/pec-ai/Header';
import ImageUploader from '@/components/pec-ai/ImageUploader';
import CardLibrary from '@/components/pec-ai/CardLibrary';
import PhraseBuilder from '@/components/pec-ai/PhraseBuilder';
import type { PecCard } from '@/lib/types';

export default function Home() {
  const [cards, setCards] = useState<PecCard[]>([]);
  const [phraseCards, setPhraseCards] = useState<PecCard[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCards = localStorage.getItem('pec-ai-cards');
      if (savedCards) {
        setCards(JSON.parse(savedCards));
      }
    } catch (error) {
      console.error("Failed to load cards from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('pec-ai-cards', JSON.stringify(cards));
      } catch (error) {
        console.error("Failed to save cards to localStorage", error);
      }
    }
  }, [cards, isMounted]);

  const addCardToLibrary = (newCardData: Omit<PecCard, 'id'>) => {
    const newCard = { ...newCardData, id: Date.now().toString() };
    setCards((prev) => [newCard, ...prev]);
  };

  const addCardToPhrase = (card: PecCard) => {
    setPhraseCards((prev) => [...prev, card]);
  };
  
  const removeCardFromPhrase = (cardId: string) => {
    setPhraseCards((prev) => prev.filter((c) => c.id !== cardId));
  };
  
  const reorderPhraseCards = (draggedId: string, targetId: string) => {
    const dragIndex = phraseCards.findIndex(c => c.id === draggedId);
    const targetIndex = phraseCards.findIndex(c => c.id === targetId);
    
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
    setCards(prev => prev.filter(c => c.id !== cardId));
    setPhraseCards(prev => prev.filter(c => c.id !== cardId));
  }

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Carregando PEC.AI...</p>
        </div>
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
          <div className="bg-card p-6 rounded-xl shadow-md border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold font-headline">Biblioteca de Cartões</h2>
              <ImageUploader onCardGenerated={addCardToLibrary} />
            </div>
            <CardLibrary cards={cards} onDeleteCard={deleteCardFromLibrary} onReorderInPhrase={reorderPhraseCards}/>
          </div>
        </div>
      </main>
    </div>
  );
}

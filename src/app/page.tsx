'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/pec-ai/Header';
import CardLibrary from '@/components/pec-ai/CardLibrary';
import PhraseBuilder from '@/components/pec-ai/PhraseBuilder';
import type { PecCard, PhraseItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/components/auth/AuthProvider';
import { getCards, deleteCard } from '@/lib/services/cards';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [cards, setCards] = useState<PecCard[]>([]);
  const [phraseItems, setPhraseItems] = useState<PhraseItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Carregar cartões do Supabase
  useEffect(() => {
    const loadCards = async () => {
      if (authLoading) return;
      
      if (!user) {
        setIsLoadingCards(false);
        setIsMounted(true);
        return;
      }
      
      try {
        setIsLoadingCards(true);
        const fetchedCards = await getCards();
        setCards(fetchedCards);
      } catch (error) {
        console.error('Erro ao carregar cartões:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar seus cartões.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingCards(false);
        setIsMounted(true);
      }
    };

    loadCards();
  }, [user, authLoading, toast]);

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

  const addCardToLibrary = async (newCardData: Omit<PecCard, 'id'>) => {
    // Recarregar cartões do servidor
    try {
      const fetchedCards = await getCards();
      setCards(fetchedCards);
    } catch (error) {
      console.error('Erro ao recarregar cartões:', error);
    }
  };

  const addItemToPhrase = (item: Omit<PhraseItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    setPhraseItems((prev) => [...prev, newItem]);
  };

  const addCardToPhrase = (card: PecCard) => {
    addItemToPhrase({ type: 'card', data: card });
  };
  
  const removeItemFromPhrase = (itemId: string) => {
    setPhraseItems((prev) => prev.filter((item) => item.id !== itemId));
  };
  

  const reorderPhraseItems = (draggedId: string, targetId: string) => {
    const dragIndex = phraseItems.findIndex((c) => c.id === draggedId);
    const targetIndex = phraseItems.findIndex((c) => c.id === targetId);

    if (dragIndex > -1 && targetIndex > -1) {
      const newItems = [...phraseItems];
      const [draggedItem] = newItems.splice(dragIndex, 1);
      newItems.splice(targetIndex, 0, draggedItem);
      setPhraseItems(newItems);
    }
  };

  const clearPhrase = () => {
    setPhraseItems([]);
  };

  const deleteCardFromLibrary = async (cardId: string) => {
    try {
      await deleteCard(cardId);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
      setPhraseItems((prev) => prev.filter((item) => {
        if (item.type === 'card') {
          return item.data.id !== cardId;
        }
        return true;
      }));
      toast({
        title: 'Sucesso',
        description: 'Cartão removido da biblioteca.',
      });
    } catch (error) {
      console.error('Erro ao deletar cartão:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o cartão.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || !isMounted) {
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
            items={phraseItems}
            onAddItem={addItemToPhrase}
            onRemoveItem={removeItemFromPhrase}
            onClear={clearPhrase}
            onReorder={reorderPhraseItems}
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

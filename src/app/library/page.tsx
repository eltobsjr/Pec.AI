'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Header from '@/components/pec-ai/Header';
import CardLibrary from '@/components/pec-ai/CardLibrary';
import type { PecCard } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { getCards, deleteCard } from '@/lib/services/cards';
import { useToast } from '@/hooks/use-toast';

export default function LibraryPage() {
  const [cards, setCards] = useState<PecCard[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadCards = async () => {
      if (authLoading) return;
      
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
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
        setIsLoading(false);
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

  const deleteCardFromLibrary = async (cardId: string) => {
    try {
      await deleteCard(cardId);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
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

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full max-w-xs" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Minha Biblioteca</h1>
            <p className="text-muted-foreground mt-2">
              {cards.length} {cards.length === 1 ? 'cartão' : 'cartões'} criados
            </p>
          </div>

          <CardLibrary
            cards={filteredCards}
            allCategories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onDeleteCard={deleteCardFromLibrary}
            onAddToPhrase={() => {}}
          />
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/pec-ai/Header';
import CardLibrary from '@/components/pec-ai/CardLibrary';
import PhraseBuilder from '@/components/pec-ai/PhraseBuilder';
import OnboardingTutorial from '@/components/pec-ai/OnboardingTutorial';
import KeyboardShortcutsDialog from '@/components/pec-ai/KeyboardShortcutsDialog';
import type { PecCard, PhraseItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/components/auth/AuthProvider';
import { getCards, deleteCard, toggleFavorite } from '@/lib/services/cards';
import { useToast } from '@/hooks/use-toast';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { Button } from '@/components/ui/button';
import { Keyboard } from 'lucide-react';

export default function Home() {
  const [cards, setCards] = useState<PecCard[]>([]);
  const [phraseItems, setPhraseItems] = useState<PhraseItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isShortcutsDialogOpen, setIsShortcutsDialogOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const newCardButtonRef = useRef<HTMLButtonElement>(null);
  const historyButtonRef = useRef<HTMLButtonElement>(null);

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

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
    if (activeCategory === 'favorites') {
      return cards.filter((card) => card.isFavorite);
    }
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

  const toggleCardFavorite = async (cardId: string) => {
    try {
      const newFavoriteState = await toggleFavorite(cardId);
      setCards((prev) =>
        prev.map((card) =>
          card.id === cardId ? { ...card, isFavorite: newFavoriteState } : card
        )
      );
      toast({
        title: 'Sucesso',
        description: newFavoriteState
          ? 'Cartão adicionado aos favoritos.'
          : 'Cartão removido dos favoritos.',
      });
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o favorito.',
        variant: 'destructive',
      });
    }
  };

  // Configurar atalhos de teclado
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'n',
        ctrl: true,
        action: () => newCardButtonRef.current?.click(),
        description: 'Criar novo cartão',
      },
      {
        key: 'f',
        ctrl: true,
        action: () => searchInputRef.current?.focus(),
        description: 'Buscar cartões',
      },
      {
        key: 'l',
        ctrl: true,
        action: () => clearPhrase(),
        description: 'Limpar frase',
      },
      {
        key: 'h',
        ctrl: true,
        action: () => historyButtonRef.current?.click(),
        description: 'Abrir histórico de frases',
      },
      {
        key: 'escape',
        action: () => {
          setIsShortcutsDialogOpen(false);
        },
        description: 'Fechar diálogos',
      },
      {
        key: '?',
        shift: true,
        action: () => setIsShortcutsDialogOpen(true),
        description: 'Mostrar atalhos',
      },
    ],
    enabled: isMounted && !!user,
  });

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
      <OnboardingTutorial />
      <Header />
      <main className="flex-grow container mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="grid gap-4 sm:gap-6 md:gap-8">
          <PhraseBuilder
            items={phraseItems}
            onAddItem={addItemToPhrase}
            onRemoveItem={removeItemFromPhrase}
            onClear={clearPhrase}
            onReorder={reorderPhraseItems}
            onClearPhrase={clearPhrase}
            searchInputRef={searchInputRef}
          />
          <CardLibrary
            cards={filteredCards}
            allCategories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onDeleteCard={deleteCardFromLibrary}
            onAddToPhrase={addCardToPhrase}
            onToggleFavorite={toggleCardFavorite}
            searchInputRef={searchInputRef}
            newCardButtonRef={newCardButtonRef}
          />
        </div>
      </main>
      <footer className="container mx-auto px-3 py-3 sm:p-4 md:px-6 text-center text-sm text-muted-foreground border-t">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <p>Desenvolvido por <strong>Uapps by eltobsjr</strong></p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsShortcutsDialogOpen(true)}
            className="gap-2"
          >
            <Keyboard className="h-4 w-4" />
            Atalhos (?)
          </Button>
        </div>
      </footer>
      <KeyboardShortcutsDialog 
        open={isShortcutsDialogOpen} 
        onOpenChange={setIsShortcutsDialogOpen} 
      />
    </div>
  );
}

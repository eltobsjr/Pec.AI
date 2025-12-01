'use client';

import type { PecCard as PecCardType } from '@/lib/types';
import PecCard from './PecCard';
import { Button } from '@/components/ui/button';
import { Volume2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

type PhraseBuilderProps = {
  cards: PecCardType[];
  onDrop: (card: PecCardType) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onReorder: (draggedId: string, targetId: string) => void;
};

export default function PhraseBuilder({ cards, onDrop, onRemove, onClear, onReorder }: PhraseBuilderProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const data = e.dataTransfer.getData('application/pec-ai-card');
      const draggedCard: PecCardType = JSON.parse(data);
      if (draggedCard) {
        onDrop(draggedCard);
      }
    } catch (err) {
      console.error('Drop in phrase builder failed', err);
    }
  };

  const speakPhrase = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis || isSpeaking) return;

    const phraseText = cards.map(card => card.name).join(', ');
    if (!phraseText.trim()) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phraseText);
    utterance.lang = 'pt-BR';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const dropZoneClass = `bg-card p-4 rounded-xl shadow-md border transition-colors ${
    isDragOver ? 'border-accent bg-accent/10' : ''
  }`;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={dropZoneClass}
    >
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold font-headline">Montar Frase</h2>
        <div className="flex items-center gap-2">
          <Button onClick={speakPhrase} disabled={cards.length === 0 || isSpeaking} variant="accent">
            <Volume2 className="mr-2 h-4 w-4" />
            {isSpeaking ? 'Falando...' : 'Falar Frase'}
          </Button>
          <Button onClick={onClear} disabled={cards.length === 0} variant="outline">
            <XCircle className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4 min-h-[200px] w-full overflow-x-auto p-4 rounded-lg bg-muted/50 border-2 border-dashed">
        {cards.length > 0 ? (
          cards.map((card) => (
            <div key={card.id} className="flex-shrink-0 w-36">
              <PecCard
                card={card}
                location="phrase"
                onRemoveFromPhrase={onRemove}
                onReorderInPhrase={onReorder}
              />
            </div>
          ))
        ) : (
          <p className="w-full text-center text-muted-foreground">
            Arraste os cartões da biblioteca para cá para montar uma frase.
          </p>
        )}
      </div>
    </div>
  );
}
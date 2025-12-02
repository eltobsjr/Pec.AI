'use client';

import type { PecCard as PecCardType } from '@/lib/types';
import PecCard from './PecCard';
import { Button } from '@/components/ui/button';
import { Volume2, XCircle, Loader2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from '@/hooks/use-toast';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
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
      if (data) {
        const draggedCard: PecCardType = JSON.parse(data);
        // prevent adding a card that's already in the phrase from the library
        if (!cards.some(c => c.id === draggedCard.id)) {
           onDrop(draggedCard);
        }
      }
    } catch (err) {
      console.error('Drop in phrase builder failed', err);
    }
  };

  const speakPhrase = async () => {
    if (isSpeaking || cards.length === 0) return;

    const phraseText = cards.map(card => card.name).join(', ');
    if (!phraseText.trim()) return;

    setIsSpeaking(true);
    try {
      const { audioDataUri } = await textToSpeech({ text: phraseText });
      
      if(audioRef.current) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play();
      }

    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        title: 'Erro ao Gerar Voz',
        description: 'Não foi possível converter o texto em fala. Por favor, tente novamente.',
        variant: 'destructive',
      });
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    const audioEl = new Audio();
    audioEl.onended = () => setIsSpeaking(false);
    audioEl.onerror = () => {
        setIsSpeaking(false);
        console.error("Error playing audio");
    };
    audioRef.current = audioEl;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const dropZoneClass = `bg-card p-4 rounded-xl shadow-lg border-2 transition-all duration-300 ${
    isDragOver ? 'border-accent bg-accent/10 border-dashed' : 'border-transparent'
  }`;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={dropZoneClass}
      aria-label="Área para montar frase"
    >
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Montar Frase</h2>
        <div className="flex items-center gap-2">
          <Button onClick={speakPhrase} disabled={cards.length === 0 || isSpeaking} variant="accent">
            {isSpeaking ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Volume2 className="mr-2 h-4 w-4" />
            )}
            {isSpeaking ? 'Falando...' : 'Falar Frase'}
          </Button>
          <Button onClick={onClear} disabled={cards.length === 0} variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
            <XCircle className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4 min-h-[170px] w-full overflow-x-auto p-4 rounded-lg bg-muted/50 border-2 border-dashed">
        {cards.length > 0 ? (
          cards.map((card) => (
            <div key={card.id} className="flex-shrink-0 w-32 md:w-36">
              <PecCard
                card={card}
                location="phrase"
                onRemoveFromPhrase={onRemove}
                onReorderInPhrase={onReorder}
              />
            </div>
          ))
        ) : (
          <div className="w-full text-center text-muted-foreground flex flex-col items-center justify-center">
            <p className='font-semibold'>Arraste os cartões para cá</p>
            <p className='text-sm'>Comece a montar uma frase arrastando um cartão da biblioteca.</p>
          </div>
        )}
      </div>
    </div>
  );
}

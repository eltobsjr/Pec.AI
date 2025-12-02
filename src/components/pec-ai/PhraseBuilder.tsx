'use client';

import type { PecCard, PhraseItem } from '@/lib/types';
import PecCardComponent from './PecCard';
import { Button } from '@/components/ui/button';
import { Volume2, XCircle, Loader2, MessageSquarePlus, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';


type TextCardProps = {
  item: PhraseItem & { type: 'text' };
  onRemoveItem: (id: string) => void;
  onReorder: (draggedId: string, targetId: string) => void;
};

function TextCard({ item, onRemoveItem, onReorder }: TextCardProps) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData('application/pec-ai-item', JSON.stringify(item));
      e.dataTransfer.effectAllowed = 'move';
    };
  
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
        const data = e.dataTransfer.getData('application/pec-ai-item');
        const draggedItem: PhraseItem = JSON.parse(data);
        if (draggedItem && draggedItem.id !== item.id) {
          onReorder(draggedItem.id, item.id);
        }
      } catch (err) {
        console.error('Drop for reorder failed', err);
      }
    };

    return (
        <TooltipProvider delayDuration={300}>
            <div
                draggable
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    'relative group/card-wrapper touch-none cursor-grab focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg h-full',
                    isDragOver ? 'scale-105 shadow-2xl z-10' : ''
                )}
                tabIndex={0}
            >
                <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-white border rounded-lg group/card">
                    <CardContent className="flex-grow flex items-center justify-center p-2 bg-amber-50">
                        <p className="text-center font-serif text-lg md:text-xl text-amber-900 break-words">
                            {item.data.text}
                        </p>
                    </CardContent>
                </Card>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute -top-3 -right-3 h-7 w-7 rounded-full opacity-0 group-hover/card-wrapper:opacity-100 transition-opacity z-20 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveItem(item.id);
                            }}
                            aria-label={`Remover texto da frase`}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Remover da Frase</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}

type PhraseBuilderProps = {
  items: PhraseItem[];
  onAddItem: (item: Omit<PhraseItem, 'id'>) => void;
  onRemoveItem: (id: string) => void;
  onClear: () => void;
  onReorder: (draggedId: string, targetId: string) => void;
};

export default function PhraseBuilder({ items, onAddItem, onRemoveItem, onClear, onReorder }: PhraseBuilderProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [textInput, setTextInput] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copyMove';
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const data = e.dataTransfer.getData('application/pec-ai-item');
      if (data) {
        const draggedItem: PhraseItem = JSON.parse(data);
        if (!items.some(c => c.id === draggedItem.id)) {
           onAddItem({ type: draggedItem.type, data: draggedItem.data as any });
        }
      }
    } catch (err) {
      console.error('Drop in phrase builder failed', err);
    }
  };

  const handleAddText = () => {
    if (textInput.trim()) {
        onAddItem({ type: 'text', data: { text: textInput.trim() } });
        setTextInput('');
    }
  };

  const speakPhrase = async () => {
    if (isSpeaking || items.length === 0) return;

    const phraseText = items.map(item => item.type === 'card' ? item.data.name : item.data.text).join(' ');
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className='flex-grow'>
            <h2 className="text-2xl font-bold mb-2">Montar Frase</h2>
            <div className="flex gap-2">
                <Input 
                    type="text" 
                    placeholder="Ou digite uma palavra..." 
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
                    className="bg-background"
                />
                <Button onClick={handleAddText} variant="secondary" disabled={!textInput.trim()}>
                    <MessageSquarePlus className="mr-2 h-4 w-4"/>
                    Adicionar
                </Button>
            </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-center pt-2 md:pt-0">
          <Button onClick={speakPhrase} disabled={items.length === 0 || isSpeaking} variant="accent">
            {isSpeaking ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Volume2 className="mr-2 h-4 w-4" />
            )}
            {isSpeaking ? 'Falando...' : 'Falar Frase'}
          </Button>
          <Button onClick={onClear} disabled={items.length === 0} variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
            <XCircle className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>
      <div className="flex items-stretch gap-4 min-h-[180px] w-full overflow-x-auto p-4 rounded-lg bg-muted/50 border-2 border-dashed">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-32 md:w-36">
              {item.type === 'card' ? (
                 <PecCardComponent
                    card={item.data}
                    location="phrase"
                    onRemoveFromPhrase={onRemoveItem}
                    onReorderInPhrase={onReorder}
                    idInPhrase={item.id}
                />
              ) : (
                <TextCard
                    item={item}
                    onRemoveItem={onRemoveItem}
                    onReorder={onReorder}
                />
              )}
            </div>
          ))
        ) : (
          <div className="w-full text-center text-muted-foreground flex flex-col items-center justify-center">
            <p className='font-semibold'>Arraste os cartões para cá</p>
            <p className='text-sm'>Ou digite uma palavra para começar a montar sua frase.</p>
          </div>
        )}
      </div>
    </div>
  );
}

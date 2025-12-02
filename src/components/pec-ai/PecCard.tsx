'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { PecCard as PecCardType } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Trash2, X, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface PecCardProps {
  card: PecCardType;
  location: 'library' | 'phrase';
  onDeleteFromLibrary?: (id: string) => void;
  onRemoveFromPhrase?: (id: string) => void;
  onReorderInPhrase?: (draggedId: string, targetId: string) => void;
  onAddToPhrase?: (card: PecCardType) => void;
}

export default function PecCard({
  card,
  location,
  onDeleteFromLibrary,
  onRemoveFromPhrase,
  onReorderInPhrase,
  onAddToPhrase,
}: PecCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/pec-ai-card', JSON.stringify(card));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (location === 'phrase' && onReorderInPhrase) {
      e.preventDefault();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (location === 'phrase' && onReorderInPhrase) {
      e.preventDefault();
      setIsDragOver(false);
      try {
        const data = e.dataTransfer.getData('application/pec-ai-card');
        const draggedCard: PecCardType = JSON.parse(data);
        if (draggedCard && draggedCard.id !== card.id) {
          onReorderInPhrase(draggedCard.id, card.id);
        }
      } catch (err) {
        console.error('Drop for reorder failed', err);
      }
    }
  };

  const cardContent = (
    <Card className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-white border rounded-lg group/card",
        location === 'phrase' && 'h-full flex flex-col',
    )}>
        <CardContent className={cn("aspect-square flex items-center justify-center p-2 bg-slate-50 relative", location === 'phrase' && 'flex-grow')}>
            <Image
                src={card.imageSrc}
                alt={card.name}
                width={150}
                height={150}
                className="object-contain h-full w-full"
                unoptimized // for data URIs
            />
            {location === 'library' && onAddToPhrase && (
                <Button
                    variant="accent"
                    size="icon"
                    className="absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity z-20"
                    onClick={() => onAddToPhrase(card)}
                    aria-label={`Adicionar ${card.name} à frase`}
                >
                    <PlusCircle className="h-5 w-5" />
                </Button>
            )}
        </CardContent>
        <CardFooter className={cn("p-2 bg-white", location === 'phrase' && "flex-shrink-0")}>
            <p className="font-semibold truncate w-full text-center text-sm">{card.name}</p>
        </CardFooter>
    </Card>
  );

  return (
    <TooltipProvider delayDuration={300}>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative group/card-wrapper touch-none cursor-grab focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg',
          isDragOver && location === 'phrase' ? 'scale-105 shadow-2xl z-10' : '',
          location === 'phrase' && 'h-full'
        )}
        tabIndex={0}
      >
        {cardContent}

        {location === 'library' && onDeleteFromLibrary && (
          <Tooltip>
              <TooltipTrigger asChild>
                  <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover/card-wrapper:opacity-100 transition-opacity z-20"
                      onClick={(e) => {
                          e.stopPropagation();
                          onDeleteFromLibrary(card.id);
                      }}
                      aria-label={`Deletar cartão ${card.name}`}
                  >
                      <Trash2 className="h-4 w-4" />
                  </Button>
              </TooltipTrigger>
              <TooltipContent>
                  <p>Deletar Cartão</p>
              </TooltipContent>
          </Tooltip>
        )}

        {location === 'phrase' && onRemoveFromPhrase && (
           <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute -top-3 -right-3 h-7 w-7 rounded-full opacity-0 group-hover/card-wrapper:opacity-100 transition-opacity z-20 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromPhrase(card.id);
                        }}
                        aria-label={`Remover cartão ${card.name} da frase`}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Remover da Frase</p>
                </TooltipContent>
           </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

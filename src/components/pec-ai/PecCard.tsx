'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import type { PecCard as PecCardType } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Trash2, X, PlusCircle, Star, ChevronLeft, ChevronRight } from 'lucide-react';
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
  onToggleFavorite?: (id: string) => void;
  idInPhrase?: string;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
}

export default function PecCard({
  card,
  location,
  onDeleteFromLibrary,
  onRemoveFromPhrase,
  onReorderInPhrase,
  onAddToPhrase,
  onToggleFavorite,
  idInPhrase,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight
}: PecCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Detectar se é mobile
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/pec-ai-item', JSON.stringify({
      type: 'card',
      id: idInPhrase || card.id,
      data: card
    }));
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
    if (location === 'phrase' && onReorderInPhrase && idInPhrase) {
      e.preventDefault();
      setIsDragOver(false);
      try {
        const data = e.dataTransfer.getData('application/pec-ai-item');
        const draggedItem = JSON.parse(data);
        if (draggedItem && draggedItem.id !== idInPhrase) {
          onReorderInPhrase(draggedItem.id, idInPhrase);
        }
      } catch (err) {
        console.error('Drop for reorder failed', err);
      }
    }
  };

  // Touch handlers para mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (location !== 'phrase' || !onReorderInPhrase) return;
    
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    
    // Long press para ativar drag mode
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      if (navigator.vibrate) {
        navigator.vibrate(50); // Feedback tátil
      }
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

    // Se moveu mais de 10px, cancela long press (é scroll)
    if ((deltaX > 10 || deltaY > 10) && longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Se está em modo long press, previne scroll
    if (isLongPress) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsLongPress(false);
    touchStartPos.current = null;
  };

  const cardContent = (
    <Card className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 bg-white border rounded-lg group/card",
        location === 'phrase' && 'h-full flex flex-col',
    )}>
        <CardContent className={cn("aspect-square flex items-center justify-center p-1.5 sm:p-2 bg-slate-50 relative", location === 'phrase' && 'flex-grow')}>
            {!imageError ? (
              <Image
                  src={card.imageSrc}
                  alt={card.name}
                  width={120}
                  height={120}
                  className="object-contain h-full w-full"
                  unoptimized
                  onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground h-full">
                <span className="text-2xl sm:text-3xl">🖼️</span>
                <span className="text-[9px] xs:text-[10px] sm:text-xs mt-0.5 sm:mt-1 text-center leading-tight px-1">Imagem indisponível</span>
              </div>
            )}
            {location === 'library' && onAddToPhrase && (
                <Button
                    variant="accent"
                    size="icon"
                    className="absolute bottom-1.5 right-1.5 h-7 w-7 sm:h-8 sm:w-8 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity z-20"
                    onClick={() => onAddToPhrase(card)}
                    aria-label={`Adicionar ${card.name} à frase`}
                >
                    <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
            )}
            {location === 'library' && onToggleFavorite && (
                <Button
                    variant={card.isFavorite ? "default" : "secondary"}
                    size="icon"
                    className="absolute top-1.5 right-1.5 h-7 w-7 sm:h-8 sm:w-8 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity z-20"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(card.id);
                    }}
                    aria-label={card.isFavorite ? `Remover ${card.name} dos favoritos` : `Adicionar ${card.name} aos favoritos`}
                >
                    <Star className={cn("h-4 w-4 sm:h-5 sm:w-5", card.isFavorite && "fill-current")} />
                </Button>
            )}
        </CardContent>
        <CardFooter className={cn("p-1 xs:p-1.5 sm:p-2 bg-white", location === 'phrase' && "flex-shrink-0")}>
            <p className="font-semibold truncate w-full text-center text-[9px] xs:text-[10px] sm:text-xs leading-tight">{card.name}</p>
        </CardFooter>
    </Card>
  );

  return (
    <TooltipProvider delayDuration={300}>
      <div
        draggable={!isMobile && location === 'phrase'}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn(
          'relative group/card-wrapper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg',
          !isMobile && location === 'phrase' && 'cursor-grab touch-none',
          isMobile && 'touch-pan-y',
          isDragOver && location === 'phrase' ? 'scale-105 shadow-2xl z-10' : '',
          isLongPress && location === 'phrase' ? 'opacity-80 scale-95 shadow-2xl' : '',
          location === 'phrase' && 'h-full'
        )}
        tabIndex={0}
      >
        {cardContent}

        {/* Botões de reordenação para mobile na frase */}
        {isMobile && location === 'phrase' && (
          <>
            {canMoveLeft && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-1/2 -left-3 transform -translate-y-1/2 h-8 w-8 rounded-full z-20 bg-background shadow-lg"
                onClick={onMoveLeft}
                aria-label="Mover para esquerda"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {canMoveRight && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-1/2 -right-3 transform -translate-y-1/2 h-8 w-8 rounded-full z-20 bg-background shadow-lg"
                onClick={onMoveRight}
                aria-label="Mover para direita"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </>
        )}

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

        {location === 'phrase' && onRemoveFromPhrase && idInPhrase && (
           <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="secondary"
                        size="icon"
                        className={cn(
                          "absolute -top-3 -right-3 h-7 w-7 rounded-full transition-opacity z-20 bg-background/80 hover:bg-destructive hover:text-destructive-foreground",
                          isMobile ? "opacity-100" : "opacity-0 group-hover/card-wrapper:opacity-100"
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromPhrase(idInPhrase);
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

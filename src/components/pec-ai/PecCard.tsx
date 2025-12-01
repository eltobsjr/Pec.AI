'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { PecCard as PecCardType } from '@/lib/types';
import { Card, CardFooter } from '@/components/ui/card';
import { Trash2, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface PecCardProps {
  card: PecCardType;
  location: 'library' | 'phrase';
  onDeleteFromLibrary?: (id: string) => void;
  onRemoveFromPhrase?: (id: string) => void;
  onReorderInPhrase?: (draggedId: string, targetId: string) => void;
}

export default function PecCard({
  card,
  location,
  onDeleteFromLibrary,
  onRemoveFromPhrase,
  onReorderInPhrase,
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

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative group touch-none cursor-grab transition-all duration-200',
        isDragOver && location === 'phrase' ? 'scale-105 shadow-2xl z-10' : ''
      )}
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-lg bg-white border rounded-lg">
        <div className="aspect-square flex items-center justify-center p-2 bg-slate-50">
          <Image
            src={card.imageSrc}
            alt={card.name}
            width={150}
            height={150}
            className="object-contain"
            unoptimized // for data URIs
          />
        </div>
        <CardFooter className="p-2 bg-white">
          <p className="font-semibold truncate w-full text-center text-sm">{card.name}</p>
        </CardFooter>
      </Card>

      {location === 'library' && onDeleteFromLibrary && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteFromLibrary(card.id);
          }}
          aria-label={`Deletar cartão ${card.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      {location === 'phrase' && onRemoveFromPhrase && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-background/50 hover:bg-destructive/80"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveFromPhrase(card.id);
          }}
          aria-label={`Remover cartão ${card.name} da frase`}
        >
          <X className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  );
}

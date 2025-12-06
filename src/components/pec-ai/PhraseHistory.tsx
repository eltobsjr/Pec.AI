'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Trash2, Loader2 } from 'lucide-react';
import { getSavedPhrases, deletePhrase, type SavedPhrase } from '@/lib/services/phrases';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PhraseItem } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type PhraseHistoryProps = {
  onLoadPhrase: (phraseItems: PhraseItem[]) => void;
};

export default function PhraseHistory({ onLoadPhrase }: PhraseHistoryProps) {
  const [open, setOpen] = useState(false);
  const [phrases, setPhrases] = useState<SavedPhrase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadPhrases = async () => {
    setIsLoading(true);
    try {
      const data = await getSavedPhrases();
      setPhrases(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o histórico de frases.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadPhrases();
    }
  }, [open]);

  const handleLoadPhrase = (phrase: SavedPhrase) => {
    onLoadPhrase(phrase.phrase_data);
    setOpen(false);
    toast({
      title: 'Frase carregada!',
      description: `"${phrase.phrase_text}" foi adicionada à área de trabalho.`,
    });
  };

  const handleDeletePhrase = async (phraseId: string) => {
    try {
      await deletePhrase(phraseId);
      setPhrases(phrases.filter(p => p.id !== phraseId));
      toast({
        title: 'Frase deletada',
        description: 'A frase foi removida do histórico.',
      });
    } catch (error) {
      console.error('Erro ao deletar frase:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar a frase.',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-xs sm:text-sm h-9 sm:h-10 flex-1 sm:flex-none">
            <Clock className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Histórico</span>
            <span className="xs:hidden">Hist.</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Histórico de Frases</DialogTitle>
            <DialogDescription>
              Suas últimas 20 frases salvas
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : phrases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Nenhuma frase salva ainda.</p>
              <p className="text-xs mt-1">
                As frases que você falar serão salvas automaticamente aqui.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {phrases.map((phrase) => (
                  <div
                    key={phrase.id}
                    className="group flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleLoadPhrase(phrase)}>
                      <p className="font-medium text-sm truncate">
                        {phrase.phrase_text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(phrase.created_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">
                          {phrase.phrase_data.length} {phrase.phrase_data.length === 1 ? 'item' : 'itens'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setDeleteId(phrase.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar frase?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A frase será removida permanentemente do histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDeletePhrase(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

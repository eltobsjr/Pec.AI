'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { identifyObjectAndGenerateCard } from '@/ai/flows/identify-object-and-generate-card';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import type { PecCard } from '@/lib/types';

type ImageUploaderProps = {
  onCardGenerated: (card: Omit<PecCard, 'id'>) => void;
};

export default function ImageUploader({ onCardGenerated }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma imagem.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      try {
        const result = await identifyObjectAndGenerateCard({ photoDataUri });
        onCardGenerated({
          name: result.objectName,
          category: result.category,
          imageSrc: result.cardDataUri,
        });
        toast({
          title: 'Sucesso!',
          description: `Cartão "${result.objectName}" criado e adicionado à biblioteca.`,
        });
        setOpen(false);
        setFile(null);
      } catch (error) {
        console.error('Error generating card:', error);
        toast({
          title: 'Erro de IA',
          description: 'Não foi possível gerar o cartão. Tente outra imagem.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      toast({
        title: 'Erro de Arquivo',
        description: 'Não foi possível ler o arquivo de imagem.',
        variant: 'destructive',
      });
      setIsLoading(false);
    };
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) setFile(null); }}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Cartão
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Cartão PEC</DialogTitle>
          <DialogDescription>
            Envie uma foto de um objeto para a IA identificar e criar um cartão de comunicação.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
            {file && <p className="text-sm text-muted-foreground">Arquivo: {file.name}</p>}
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isLoading || !file}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Gerar Cartão
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

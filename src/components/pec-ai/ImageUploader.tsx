'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { identifyObjectAndGenerateCard } from '@/ai/flows/identify-object-and-generate-card';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Upload, Camera } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CameraCapture from './CameraCapture';
import type { PecCard } from '@/lib/types';

type ImageUploaderProps = {
  onCardGenerated: (card: Omit<PecCard, 'id'>) => void;
};

export default function ImageUploader({ onCardGenerated }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setCapturedImage(null);
    }
  };

  const handleImageCaptured = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!file && !capturedImage) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma imagem ou capture uma foto.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => processImage(reader.result as string);
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast({
          title: 'Erro de Arquivo',
          description: 'Não foi possível ler o arquivo de imagem.',
          variant: 'destructive',
        });
        setIsLoading(false);
      };
    } else if (capturedImage) {
      processImage(capturedImage);
    }
  };

  const processImage = async (photoDataUri: string) => {
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
      setCapturedImage(null);
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

  const resetState = () => {
    if (!open) {
      setFile(null);
      setCapturedImage(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); resetState(); }}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Cartão
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Cartão PEC</DialogTitle>
          <DialogDescription>
            Use IA para criar um cartão de um objeto a partir de uma foto.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4"/> Enviar Foto</TabsTrigger>
            <TabsTrigger value="camera"><Camera className="mr-2 h-4 w-4"/> Tirar Foto</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <div className="grid gap-4 py-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
                {file && <p className="text-sm text-muted-foreground">Arquivo: {file.name}</p>}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="camera">
             <CameraCapture onImageCaptured={handleImageCaptured} capturedImage={capturedImage} />
          </TabsContent>
        </Tabs>
        
        <Button onClick={handleSubmit} disabled={isLoading || (!file && !capturedImage)}>
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

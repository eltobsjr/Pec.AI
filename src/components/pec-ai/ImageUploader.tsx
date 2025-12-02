'use client';

import { useState, type ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { identifyObjectAndGenerateCard } from '@/ai/flows/identify-object-and-generate-card';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Camera, FileUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CameraCapture from './CameraCapture';
import type { PecCard } from '@/lib/types';
import Image from 'next/image';

type ImageUploaderProps = {
  onCardGenerated: (card: Omit<PecCard, 'id'>) => void;
  children: ReactNode;
};

export default function ImageUploader({ onCardGenerated, children }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentFile = event.target.files?.[0];
    if (currentFile) {
      setFile(currentFile);
      setCapturedImage(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(currentFile);
    }
  };

  const handleImageCaptured = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setFile(null);
    setFilePreview(null);
  };

  const handleSubmit = async () => {
    const imageSource = capturedImage || filePreview;

    if (!imageSource) {
      toast({
        title: 'Nenhuma Imagem',
        description: 'Por favor, envie uma imagem ou tire uma foto.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await identifyObjectAndGenerateCard({ photoDataUri: imageSource });
      onCardGenerated({
        name: result.objectName,
        category: result.category,
        imageSrc: result.cardDataUri,
      });
      toast({
        title: 'Sucesso!',
        description: `Cartão "${result.objectName}" criado e adicionado à biblioteca.`,
        className: 'bg-green-100 border-green-300 text-green-800'
      });
      resetAndClose();
    } catch (error) {
      console.error('Error generating card:', error);
      toast({
        title: 'Erro de IA',
        description: 'Não foi possível gerar o cartão. Tente outra imagem ou uma com melhor qualidade.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetAndClose = () => {
    setOpen(false);
    setFile(null);
    setFilePreview(null);
    setCapturedImage(null);
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) resetAndClose(); else setOpen(true); }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Novo Cartão PEC</DialogTitle>
          <DialogDescription>
            Use IA para criar um cartão a partir de uma foto de um objeto. A IA irá identificar, remover o fundo e categorizar o objeto para você.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload"><FileUp className="mr-2 h-4 w-4"/> Enviar Foto</TabsTrigger>
            <TabsTrigger value="camera"><Camera className="mr-2 h-4 w-4"/> Tirar Foto</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <div className="grid gap-4 py-4">
                <label htmlFor="picture-upload" className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors ${filePreview ? '' : 'p-5'}`}>
                    {filePreview ? (
                        <Image src={filePreview} alt="Preview" layout="fill" objectFit="contain" className="rounded-lg" />
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <FileUp className="w-10 h-10 mx-auto mb-3" />
                            <p className="font-semibold">Clique para enviar</p>
                            <p className="text-xs">PNG, JPG ou WEBP</p>
                        </div>
                    )}
                </label>
                <Input id="picture-upload" type="file" accept="image/*" onChange={handleFileChange} disabled={isLoading} className="sr-only" />
            </div>
          </TabsContent>
          <TabsContent value="camera">
             <CameraCapture onImageCaptured={handleImageCaptured} capturedImage={capturedImage} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading || (!filePreview && !capturedImage)}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando Cartão...
              </>
            ) : (
              'Gerar Cartão'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

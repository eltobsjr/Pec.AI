'use client';

import { useState, type ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { identifyObjectAndGenerateCard } from '@/ai/flows/identify-object-and-generate-card';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Camera, FileUp } from 'lucide-react';
import { Label } from '../ui/label';
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
  const [manualName, setManualName] = useState('');
  const [manualCategory, setManualCategory] = useState('');
  const [useManual, setUseManual] = useState(false);
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

    if (useManual && (!manualName.trim() || !manualCategory.trim())) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o nome e categoria do cartão.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (useManual) {
        // Modo manual: criar cartão sem IA
        const { createManualCard } = await import('@/lib/services/manual-cards');
        const result = await createManualCard({
          name: manualName.trim(),
          category: manualCategory.trim(),
          imageDataUri: imageSource,
        });

        toast({
          title: 'Sucesso!',
          description: `Cartão "${manualName}" criado e adicionado à biblioteca.`,
          className: 'bg-green-100 border-green-300 text-green-800'
        });
      } else {
        // Modo IA: identificar objeto e gerar cartão
        // Ler idioma configurado do localStorage (padrão: pt-BR)
        const savedLanguage = localStorage.getItem('pec-ai-language') || 'pt-BR';
        const result = await identifyObjectAndGenerateCard({ 
          photoDataUri: imageSource,
          language: savedLanguage
        });
        
        const { uploadImage } = await import('@/lib/services/storage');
        
        // Upload da imagem original (usada tanto como original quanto como cartão)
        const imageUrl = await uploadImage(
          imageSource,
          'original-images'
        );

        const { createCard } = await import('@/lib/services/cards');
        await createCard({
          name: result.objectName,
          category: result.category,
          image_url: imageUrl,
          original_image_url: imageUrl,
        });

        toast({
          title: 'Sucesso!',
          description: `Cartão "${result.objectName}" criado e adicionado à biblioteca.`,
          className: 'bg-green-100 border-green-300 text-green-800'
        });
      }
      
      resetAndClose();
      window.location.reload();
    } catch (error) {
      console.error('Error generating card:', error);
      toast({
        title: 'Erro',
        description: useManual ? 'Não foi possível criar o cartão.' : 'Não foi possível gerar o cartão. Tente o modo manual.',
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
    setManualName('');
    setManualCategory('');
    setUseManual(false);
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload"><FileUp className="mr-2 h-4 w-4"/> Enviar</TabsTrigger>
            <TabsTrigger value="camera"><Camera className="mr-2 h-4 w-4"/> Câmera</TabsTrigger>
            <TabsTrigger value="manual"><Upload className="mr-2 h-4 w-4"/> Manual</TabsTrigger>
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
          <TabsContent value="manual" className="space-y-4">
            <div className="grid gap-4 py-4">
              <label htmlFor="manual-upload" className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors ${filePreview || capturedImage ? '' : 'p-5'}`}>
                {filePreview || capturedImage ? (
                  <Image src={filePreview || capturedImage || ''} alt="Preview" layout="fill" objectFit="contain" className="rounded-lg" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="w-10 h-10 mx-auto mb-3" />
                    <p className="font-semibold">Clique para enviar imagem</p>
                    <p className="text-xs">PNG, JPG ou WEBP</p>
                  </div>
                )}
              </label>
              <Input id="manual-upload" type="file" accept="image/*" onChange={(e) => { handleFileChange(e); setUseManual(true); }} disabled={isLoading} className="sr-only" />
              
              <div className="space-y-2">
                <Label htmlFor="manual-name">Nome do Objeto</Label>
                <Input 
                  id="manual-name" 
                  type="text" 
                  placeholder="Ex: Maçã, Cachorro, Casa..."
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manual-category">Categoria</Label>
                <Input 
                  id="manual-category" 
                  type="text" 
                  placeholder="Ex: Alimentos, Animais, Lugares..."
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading || (!filePreview && !capturedImage)}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {useManual ? 'Criando Cartão...' : 'Gerando Cartão...'}
              </>
            ) : (
              useManual ? 'Criar Cartão' : 'Gerar com IA'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

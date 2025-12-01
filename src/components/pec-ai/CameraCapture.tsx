'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCcw, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type CameraCaptureProps = {
  onImageCaptured: (imageSrc: string) => void;
  capturedImage: string | null;
};

export default function CameraCapture({ onImageCaptured, capturedImage }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (hasCameraPermission === null) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Acesso à Câmera Negado',
            description: 'Por favor, habilite a permissão da câmera nas configurações do seu navegador.',
          });
        }
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [hasCameraPermission, toast]);

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        onImageCaptured(canvas.toDataURL('image/jpeg'));
      }
    }
  };

  const retakePhoto = () => {
    onImageCaptured('');
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="w-full aspect-video rounded-md overflow-hidden bg-muted border relative">
        {capturedImage ? (
          <Image src={capturedImage} alt="Captured" layout="fill" objectFit="contain" />
        ) : (
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        )}
        {hasCameraPermission === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Alert variant="destructive" className="w-auto">
              <AlertTitle>Câmera Indisponível</AlertTitle>
              <AlertDescription>
                Habilite o acesso à câmera.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {capturedImage ? (
          <>
            <Button onClick={retakePhoto} variant="outline">
              <RefreshCcw className="mr-2" /> Tentar Novamente
            </Button>
            <Button disabled>
              <Check className="mr-2" /> Foto Pronta
            </Button>
          </>
        ) : (
          <Button onClick={captureFrame} disabled={!hasCameraPermission}>
            <Camera className="mr-2" /> Capturar Foto
          </Button>
        )}
      </div>
    </div>
  );
}

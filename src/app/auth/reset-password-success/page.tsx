'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function ResetPasswordSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar automaticamente após 5 segundos
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F8FF] to-[#A0D2EB]/20 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
            Senha Alterada!
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Sua senha foi redefinida com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Você já pode fazer login com sua nova senha.
          </p>
          
          <div className="space-y-2">
            <Button onClick={() => router.push('/')} className="w-full" size="lg">
              Ir para o App
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Você será redirecionado automaticamente em 5 segundos...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

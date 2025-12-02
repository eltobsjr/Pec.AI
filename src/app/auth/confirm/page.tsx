'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const supabase = createClient();
        
        // Obter o token da URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        if (type === 'email' || type === 'signup') {
          if (accessToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get('refresh_token') || '',
            });

            if (error) {
              throw error;
            }

            setStatus('success');
            setMessage('Email confirmado com sucesso!');
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
              router.push('/');
            }, 2000);
          } else {
            throw new Error('Token não encontrado');
          }
        } else {
          throw new Error('Tipo de confirmação inválido');
        }
      } catch (error: any) {
        console.error('Erro ao confirmar email:', error);
        setStatus('error');
        setMessage(error.message || 'Erro ao confirmar email. O link pode ter expirado.');
      }
    };

    handleEmailConfirmation();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F8FF] to-[#A0D2EB]/20 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            {status === 'loading' && <Loader2 className="h-8 w-8 text-primary-foreground animate-spin" />}
            {status === 'success' && <CheckCircle2 className="h-8 w-8 text-primary-foreground" />}
            {status === 'error' && <XCircle className="h-8 w-8 text-primary-foreground" />}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Confirmando Email...'}
            {status === 'success' && 'Email Confirmado!'}
            {status === 'error' && 'Erro na Confirmação'}
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Você será redirecionado automaticamente...
              </p>
              <Button onClick={() => router.push('/')} className="w-full">
                Ir para o App
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center space-y-2">
              <Button onClick={() => router.push('/signup')} className="w-full">
                Criar Nova Conta
              </Button>
              <Button onClick={() => router.push('/login')} variant="outline" className="w-full">
                Fazer Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

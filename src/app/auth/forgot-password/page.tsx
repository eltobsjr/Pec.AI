'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Erro ao solicitar redefinição:', err);
      setError(err.message || 'Erro ao enviar email. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F8FF] to-[#A0D2EB]/20 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">Recuperar Senha</CardTitle>
          <CardDescription>
            {success 
              ? 'Email enviado com sucesso!' 
              : 'Digite seu email para receber o link de recuperação'}
          </CardDescription>
        </CardHeader>

        {!success ? (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </Button>

              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Login
                </Button>
              </Link>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>Email enviado!</strong>
                <br />
                Enviamos um link de recuperação para <strong>{email}</strong>.
                <br />
                Verifique sua caixa de entrada e clique no link para redefinir sua senha.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-2">
              <Link href="/login" className="w-full">
                <Button className="w-full" size="lg">
                  Voltar para Login
                </Button>
              </Link>
              
              <button 
                type="button"
                onClick={() => setSuccess(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Não recebeu o email? <span className="text-primary font-semibold">Tentar novamente</span>
              </button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

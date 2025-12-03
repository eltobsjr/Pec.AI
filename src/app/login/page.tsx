'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        // Login bem-sucedido - apenas push, o middleware cuida do resto
        router.push('/');
      }
    } catch (err: any) {
      console.error('Erro no login:', err);
      
      if (err.message?.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos');
      } else {
        setError(err.message || 'Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F8FF] to-[#A0D2EB]/20">
      <div className="container mx-auto px-4 py-6 sm:py-12 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-[95vw] sm:max-w-md shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-3 sm:mb-4">
            <Image
              src="/logo.svg"
              alt="PEC.AI Logo"
              width={100}
              height={33}
              className="mx-auto sm:w-[120px] sm:h-[40px]"
            />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">Bem-vindo</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Entre com sua conta para acessar o PEC.AI
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-xs text-primary hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
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
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link 
                href="/signup" 
                className="text-primary hover:underline font-semibold"
              >
                Criar Conta
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4">
        Desenvolvido por <strong>Uapps by eltobsjr</strong>
      </p>
      </div>
    </div>
  );
}

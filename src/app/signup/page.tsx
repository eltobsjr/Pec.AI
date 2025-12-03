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
import { Loader2, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (!authLoading && user && !success) {
      router.push('/');
    }
  }, [user, authLoading, success, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        // Verificar se precisa confirmar email
        if (data.user.identities && data.user.identities.length === 0) {
          // Email já registrado
          setError('Este email já está cadastrado. Faça login.');
        } else if (data.session) {
          // Confirmação automática habilitada - redireciona
          router.push('/');
        } else {
          // Precisa confirmar email
          setSuccess(true);
        }
      }
    } catch (err: any) {
      console.error('Erro no cadastro:', err);
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
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
          <CardTitle className="text-2xl sm:text-3xl font-bold">Criar Conta</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Crie sua conta para começar a usar o PEC.AI
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>Conta criada com sucesso!</strong>
                  <br />
                  Enviamos um email de confirmação para <strong>{email}</strong>.
                  <br />
                  Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

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
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
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
                  minLength={6}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                A senha deve ter pelo menos 6 caracteres
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            {!success && (
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            )}

            {success && (
              <Link href="/login" className="w-full">
                <Button className="w-full" size="lg">
                  Ir para Login
                </Button>
              </Link>
            )}

            {!success && (
              <div className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link 
                  href="/login" 
                  className="text-primary hover:underline font-semibold"
                >
                  Fazer Login
                </Link>
              </div>
            )}

            {success && (
              <div className="text-center text-xs text-muted-foreground">
                Não recebeu o email?{' '}
                <button 
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="text-primary hover:underline font-semibold"
                >
                  Tentar novamente
                </button>
              </div>
            )}
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

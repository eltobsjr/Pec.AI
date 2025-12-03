'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import Header from '@/components/pec-ai/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, User, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-10 w-48" />
            <Card>
              <CardHeader>
                <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                <Skeleton className="h-6 w-32 mx-auto mt-4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  const userInitials = user.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || user.email?.[0].toUpperCase();

  const createdAt = new Date(user.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
          </div>

          <Card>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">
                {user.user_metadata?.full_name || 'Usuário'}
              </CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="mt-2">
                  Conta Ativa
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-4 border rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center p-4 border rounded-lg">
                <User className="h-5 w-5 text-muted-foreground mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                  <p className="text-base">{user.user_metadata?.full_name || 'Não informado'}</p>
                </div>
              </div>

              <div className="flex items-center p-4 border rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Membro desde</p>
                  <p className="text-base">{createdAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sobre o PEC.AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                O PEC.AI é uma ferramenta de comunicação alternativa que utiliza Inteligência Artificial 
                para criar cartões personalizados de comunicação PEC (Picture Exchange Communication System). 
                Nosso objetivo é facilitar a comunicação para pessoas com necessidades especiais.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Desenvolvido por <strong>Uapps by eltobsjr</strong>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

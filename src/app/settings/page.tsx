'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Header from '@/components/pec-ai/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LogOut, User, Shield, Bell, Palette, HelpCircle, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-10 w-48" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie suas preferências e configurações da conta
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Conta</CardTitle>
              <CardDescription>Informações e preferências da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/profile">
                <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors text-left">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="font-medium">Perfil</p>
                      <p className="text-sm text-muted-foreground">Visualize e edite suas informações</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              </Link>

              <Separator />

              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors text-left">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="font-medium">Privacidade e Segurança</p>
                    <p className="text-sm text-muted-foreground">Gerencie sua privacidade</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>Personalize sua experiência</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors text-left">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="font-medium">Notificações</p>
                    <p className="text-sm text-muted-foreground">Configure alertas e notificações</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>

              <Separator />

              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors text-left">
                <div className="flex items-center">
                  <Palette className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="font-medium">Aparência</p>
                    <p className="text-sm text-muted-foreground">Tema, cores e personalização</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suporte</CardTitle>
              <CardDescription>Ajuda e informações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors text-left">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="font-medium">Central de Ajuda</p>
                    <p className="text-sm text-muted-foreground">Perguntas frequentes e guias</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>Ações permanentes e irreversíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowLogoutDialog(true)}
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? 'Encerrando...' : 'Encerrar Sessão'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="container mx-auto p-4 md:px-6 text-center text-sm text-muted-foreground">
        <p>Desenvolvido por <strong>Uapps by eltobsjr</strong></p>
      </footer>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Encerrar Sessão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja sair? Você precisará fazer login novamente para acessar sua conta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoggingOut ? 'Saindo...' : 'Sim, Encerrar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Camera, LibraryBig, MessageSquare, Volume2 } from 'lucide-react';

const tutorialSteps = [
  {
    title: 'Bem-vindo ao PEC.AI! 👋',
    description: 'Vamos te ensinar como usar o app em 4 passos simples.',
    icon: '🎯',
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          O PEC.AI te ajuda a criar cartões de comunicação visual usando Inteligência Artificial.
        </p>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm font-medium">O que você vai aprender:</p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>• Como criar cartões com IA</li>
            <li>• Como montar frases</li>
            <li>• Como usar o áudio</li>
            <li>• Como organizar sua biblioteca</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: 'Passo 1: Criar Cartões 📸',
    description: 'Tire uma foto ou escolha uma imagem da galeria',
    icon: <Camera className="w-12 h-12 text-primary" />,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Clique no botão <strong>"Novo Cartão"</strong> para criar um cartão:
        </p>
        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Com IA (Automático)</p>
              <p className="text-xs text-muted-foreground">
                A IA identifica o objeto e cria o cartão automaticamente
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <LibraryBig className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Manual</p>
              <p className="text-xs text-muted-foreground">
                Você escolhe o nome e categoria do cartão
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Passo 2: Montar Frases 💬',
    description: 'Combine cartões para se comunicar',
    icon: <MessageSquare className="w-12 h-12 text-primary" />,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Clique nos cartões da biblioteca para adicioná-los à frase:
        </p>
        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded">Eu</div>
            <span>+</span>
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded">quero</div>
            <span>+</span>
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded">água</div>
          </div>
          <p className="text-xs text-muted-foreground">
            💡 Dica: Você pode arrastar os cartões para reordenar ou adicionar texto livre!
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'Passo 3: Usar Áudio 🔊',
    description: 'Fale sua frase em voz alta',
    icon: <Volume2 className="w-12 h-12 text-primary" />,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Clique no botão <strong>"Falar Frase"</strong> para ouvir sua comunicação:
        </p>
        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Volume2 className="w-8 h-8 text-primary" />
            </div>
            <div className="text-2xl">→</div>
            <div className="bg-green-100 dark:bg-green-900/20 px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">🗣️ "Eu quero água"</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            O áudio ajuda na compreensão e no aprendizado da comunicação
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'Pronto para começar! 🎉',
    description: 'Agora você sabe usar o PEC.AI',
    icon: '✅',
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Você completou o tutorial! Aqui estão algumas dicas extras:
        </p>
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <p className="text-sm"><strong>🏷️ Categorias:</strong> Organize seus cartões por temas</p>
          <p className="text-sm"><strong>🔍 Busca:</strong> Use a busca para encontrar cartões rapidamente</p>
          <p className="text-sm"><strong>⭐ Favoritos:</strong> Marque cartões importantes</p>
          <p className="text-sm"><strong>💾 Histórico:</strong> Suas frases são salvas automaticamente</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg text-center">
          <p className="text-sm font-medium">Comece criando seu primeiro cartão! 🚀</p>
        </div>
      </div>
    ),
  },
];

export default function OnboardingTutorial() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Verificar se o usuário já viu o tutorial
    const hasSeenTutorial = localStorage.getItem('pec-ai-tutorial-completed');
    if (!hasSeenTutorial) {
      // Delay de 500ms para não aparecer muito rápido
      const timer = setTimeout(() => {
        setOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('pec-ai-tutorial-completed', 'true');
    setOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem('pec-ai-tutorial-completed', 'true');
    setOpen(false);
  };

  const step = tutorialSteps[currentStep];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{step.title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>{step.description}</DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="flex justify-center mb-6">
            {typeof step.icon === 'string' ? (
              <div className="text-6xl">{step.icon}</div>
            ) : (
              step.icon
            )}
          </div>
          {step.content}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 flex-1">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-primary'
                    : index < currentStep
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep === tutorialSteps.length - 1 ? (
                'Começar!'
              ) : (
                <>
                  Próximo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

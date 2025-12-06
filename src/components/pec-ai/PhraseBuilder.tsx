'use client';

import type { PecCard, PhraseItem } from '@/lib/types';
import PecCardComponent from './PecCard';
import { Button } from '@/components/ui/button';
import { Volume2, XCircle, Loader2, MessageSquarePlus, X, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import PhraseHistory from './PhraseHistory';
import { savePhrase } from '@/lib/services/phrases';

export { availableVoices };


const availableVoices = [
    { id: 'algenib', name: 'Voz Masculina 1 (Padrão)', gender: 'Masculino' },
    { id: 'achernar', name: 'Voz Masculina 2', gender: 'Masculino' },
    { id: 'gacrux', name: 'Voz Masculina 3', gender: 'Masculino' },
    { id: 'autonoe', name: 'Voz Feminina 1', gender: 'Feminino' },
    { id: 'callirrhoe', name: 'Voz Feminina 2', gender: 'Feminino' },
    { id: 'laomedeia', name: 'Voz Feminina 3', gender: 'Feminino' },
] as const;

const availableLanguages = [
    { id: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'es', name: 'Español', flag: '🇪🇸' },
] as const;

type VoiceId = typeof availableVoices[number]['id'];
type LanguageId = typeof availableLanguages[number]['id'];

type TextCardProps = {
  item: PhraseItem & { type: 'text' };
  onRemoveItem: (id: string) => void;
  onReorder: (draggedId: string, targetId: string) => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
};

function TextCard({ item, onRemoveItem, onReorder, onMoveLeft, onMoveRight, canMoveLeft, canMoveRight }: TextCardProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData('application/pec-ai-item', JSON.stringify(item));
      e.dataTransfer.effectAllowed = 'move';
    };
  
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    };
  
    const handleDragLeave = () => {
      setIsDragOver(false);
    };
  
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      try {
        const data = e.dataTransfer.getData('application/pec-ai-item');
        const draggedItem: PhraseItem = JSON.parse(data);
        if (draggedItem && draggedItem.id !== item.id) {
          onReorder(draggedItem.id, item.id);
        }
      } catch (err) {
        console.error('Drop for reorder failed', err);
      }
    };

    return (
        <TooltipProvider delayDuration={300}>
            <div
                draggable={!isMobile}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    'relative group/card-wrapper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg h-full',
                    !isMobile && 'cursor-grab touch-none',
                    isMobile && 'touch-pan-y',
                    isDragOver ? 'scale-105 shadow-2xl z-10' : ''
                )}
                tabIndex={0}
            >
                <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-white border rounded-lg group/card">
                    <CardContent className="flex-grow flex items-center justify-center p-2 bg-amber-50">
                        <p className="text-center font-serif text-lg md:text-xl text-amber-900 break-words">
                            {item.data.text}
                        </p>
                    </CardContent>
                </Card>
                
                {/* Botões de reordenação para mobile */}
                {isMobile && (
                  <>
                    {canMoveLeft && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-1/2 -left-3 transform -translate-y-1/2 h-8 w-8 rounded-full z-20 bg-background shadow-lg"
                        onClick={onMoveLeft}
                        aria-label="Mover para esquerda"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    )}
                    {canMoveRight && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-1/2 -right-3 transform -translate-y-1/2 h-8 w-8 rounded-full z-20 bg-background shadow-lg"
                        onClick={onMoveRight}
                        aria-label="Mover para direita"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className={cn(
                              "absolute -top-3 -right-3 h-7 w-7 rounded-full transition-opacity z-20 bg-background/80 hover:bg-destructive hover:text-destructive-foreground",
                              isMobile ? "opacity-100" : "opacity-0 group-hover/card-wrapper:opacity-100"
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveItem(item.id);
                            }}
                            aria-label={`Remover texto da frase`}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Remover da Frase</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}

type PhraseBuilderProps = {
  items: PhraseItem[];
  onAddItem: (item: Omit<PhraseItem, 'id'>) => void;
  onRemoveItem: (id: string) => void;
  onClear: () => void;
  onReorder: (draggedId: string, targetId: string) => void;
  onClearPhrase?: () => void;
  onOpenHistory?: () => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
};

export default function PhraseBuilder({ 
  items, 
  onAddItem, 
  onRemoveItem, 
  onClear, 
  onReorder,
  onClearPhrase,
  onOpenHistory,
  searchInputRef
}: PhraseBuilderProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>('algenib');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>('pt-BR');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedVoice = localStorage.getItem('pec-ai-voice');
      if (savedVoice && availableVoices.some(v => v.id === savedVoice)) {
        setSelectedVoice(savedVoice as VoiceId);
      }
      
      const savedLanguage = localStorage.getItem('pec-ai-language');
      if (savedLanguage && availableLanguages.some(l => l.id === savedLanguage)) {
        setSelectedLanguage(savedLanguage as LanguageId);
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage', error);
    }
  }, []);

  const handleVoiceChange = (voiceId: VoiceId) => {
    setSelectedVoice(voiceId);
    try {
      localStorage.setItem('pec-ai-voice', voiceId);
    } catch (error) {
      console.error('Failed to save voice to localStorage', error);
    }
  };

  const handleLanguageChange = (languageId: LanguageId) => {
    setSelectedLanguage(languageId);
    try {
      localStorage.setItem('pec-ai-language', languageId);
      toast({
        title: 'Idioma alterado',
        description: `A IA agora identificará objetos em ${availableLanguages.find(l => l.id === languageId)?.name}.`,
      });
    } catch (error) {
      console.error('Failed to save language to localStorage', error);
    }
  };


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const data = e.dataTransfer.getData('application/pec-ai-item');
      if (data) {
        const draggedItem: PhraseItem = JSON.parse(data);
        if (!items.some(c => c.id === draggedItem.id)) {
           onAddItem({ type: draggedItem.type, data: draggedItem.data as any });
        }
      }
    } catch (err) {
      console.error('Drop in phrase builder failed', err);
    }
  };

  const handleAddText = () => {
    if (textInput.trim()) {
        onAddItem({ type: 'text', data: { text: textInput.trim() } });
        setTextInput('');
    }
  };

  const speakPhrase = async () => {
    if (isSpeaking || items.length === 0) return;

    const phraseText = items.map(item => item.type === 'card' ? item.data.name : item.data.text).join(' ');
    if (!phraseText.trim()) return;

    setIsSpeaking(true);
    try {
      const { audioDataUri } = await textToSpeech({ text: phraseText, voiceName: selectedVoice });
      
      if(audioRef.current) {
        audioRef.current.src = audioDataUri;
        await audioRef.current.play();
      }

      // Salvar frase no histórico automaticamente após falar
      try {
        await savePhrase(items);
      } catch (error) {
        console.error('Erro ao salvar frase:', error);
        // Não mostra erro ao usuário para não interromper o fluxo
      }

    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        title: 'Erro ao Gerar Voz',
        description: 'Não foi possível converter o texto em fala. Por favor, tente novamente.',
        variant: 'destructive',
      });
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    const audioEl = new Audio();
    audioEl.onended = () => setIsSpeaking(false);
    audioEl.onerror = () => {
        setIsSpeaking(false);
        console.error("Error playing audio", audioEl.error);
    };
    audioRef.current = audioEl;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const dropZoneClass = `bg-card p-3 sm:p-4 rounded-xl shadow-lg border-2 transition-all duration-300 ${
    isDragOver ? 'border-accent bg-accent/10 border-dashed' : 'border-transparent'
  }`;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={dropZoneClass}
      aria-label="Área para montar frase"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className='flex-grow w-full md:w-auto'>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Montar Frase</h2>
            <div className="flex gap-2 w-full">
                <Input 
                    type="text" 
                    placeholder="Digite uma palavra..." 
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
                    className="bg-background text-sm sm:text-base flex-1 min-w-0"
                />
                <Button onClick={handleAddText} variant="secondary" disabled={!textInput.trim()} className="text-xs sm:text-sm h-9 sm:h-10 shrink-0">
                    <MessageSquarePlus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4"/>
                    <span className="hidden xs:inline">Adicionar</span>
                    <span className="xs:hidden">+</span>
                </Button>
            </div>
        </div>
        <div className="grid grid-cols-4 gap-2 w-full md:w-auto md:flex md:items-center pt-2 md:pt-0">
          <Button onClick={speakPhrase} disabled={items.length === 0 || isSpeaking} variant="accent" className="col-span-3 md:w-auto text-xs sm:text-sm h-10">
            {isSpeaking ? (
              <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <Volume2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            )}
            <span className="hidden xs:inline">{isSpeaking ? 'Falando...' : 'Falar Frase'}</span>
            <span className="xs:hidden">{isSpeaking ? 'Falar...' : 'Falar'}</span>
          </Button>

          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="col-span-1 md:w-10 h-10 w-full">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Configurações</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Configurações</DialogTitle>
                        <DialogDescription>
                            Personalize a voz e o idioma de identificação de objetos.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {/* Seção de Idioma da IA */}
                      <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          🤖 Idioma da IA
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          Escolha o idioma em que a IA identificará objetos nas imagens.
                        </p>
                        <RadioGroup defaultValue={selectedLanguage} onValueChange={(value) => handleLanguageChange(value as LanguageId)} className="grid gap-3">
                          {availableLanguages.map((language) => (
                            <div key={language.id} className="flex items-center space-x-3 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                              <RadioGroupItem value={language.id} id={`lang-${language.id}`} />
                              <Label htmlFor={`lang-${language.id}`} className="flex-1 cursor-pointer">
                                <span className="font-semibold">{language.flag} {language.name}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      {/* Seção de Voz */}
                      <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          🔊 Voz da Leitura
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          Escolha a voz que será usada para falar as frases.
                        </p>
                        <RadioGroup defaultValue={selectedVoice} onValueChange={(value) => handleVoiceChange(value as VoiceId)} className="grid gap-3">
                          {availableVoices.map((voice) => (
                            <div key={voice.id} className="flex items-center space-x-3 rounded-md border p-3 hover:bg-muted/50 transition-colors">
                              <RadioGroupItem value={voice.id} id={voice.id} />
                              <Label htmlFor={voice.id} className="flex-1 cursor-pointer">
                                <span className="font-semibold">{voice.name}</span>
                                <p className="text-xs text-muted-foreground">{voice.gender}</p>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setIsSettingsOpen(false)}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

          <PhraseHistory 
            className="col-span-2 md:w-auto h-10 w-full"
            onLoadPhrase={(phraseItems) => {
            onClear();
            phraseItems.forEach(item => onAddItem(item));
          }} />
          
          <Button onClick={onClear} disabled={items.length === 0} variant="outline" className="col-span-2 md:w-auto text-destructive hover:bg-destructive/10 hover:text-destructive text-xs sm:text-sm h-10 w-full">
            <XCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Limpar</span>
            <span className="xs:hidden">Limp.</span>
          </Button>
        </div>
      </div>
      <div className="flex items-stretch gap-2 sm:gap-3 md:gap-4 min-h-[130px] sm:min-h-[180px] w-full overflow-x-auto scrollbar-thin p-2 sm:p-3 md:p-4 rounded-lg bg-muted/50 border-2 border-dashed">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={item.id} className="flex-shrink-0 w-24 sm:w-32 md:w-36">
              {item.type === 'card' ? (
                 <PecCardComponent
                    card={item.data}
                    location="phrase"
                    onRemoveFromPhrase={onRemoveItem}
                    onReorderInPhrase={onReorder}
                    idInPhrase={item.id}
                    onMoveLeft={index > 0 ? () => {
                      onReorder(item.id, items[index - 1].id);
                    } : undefined}
                    onMoveRight={index < items.length - 1 ? () => {
                      onReorder(item.id, items[index + 1].id);
                    } : undefined}
                    canMoveLeft={index > 0}
                    canMoveRight={index < items.length - 1}
                />
              ) : (
                <TextCard
                    item={item}
                    onRemoveItem={onRemoveItem}
                    onReorder={onReorder}
                    onMoveLeft={index > 0 ? () => {
                      const newItems = [...items];
                      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
                      onReorder(item.id, items[index - 1].id);
                    } : undefined}
                    onMoveRight={index < items.length - 1 ? () => {
                      const newItems = [...items];
                      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
                      onReorder(item.id, items[index + 1].id);
                    } : undefined}
                    canMoveLeft={index > 0}
                    canMoveRight={index < items.length - 1}
                />
              )}
            </div>
          ))
        ) : (
          <div className="w-full text-center text-muted-foreground flex flex-col items-center justify-center px-4">
            <p className='font-semibold text-sm sm:text-base'>Arraste os cartões para cá</p>
            <p className='text-xs sm:text-sm mt-1'>Ou digite uma palavra para começar a montar sua frase.</p>
          </div>
        )}
      </div>
    </div>
  );
}

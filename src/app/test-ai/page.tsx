'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function TestAIPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const testAI = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-ai', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `✅ API funcionando! Resposta: ${data.response}`,
        });
      } else {
        setResult({
          success: false,
          message: `❌ Erro: ${data.error || 'Erro desconhecido'}`,
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `❌ Erro de conexão: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Testar API do Google Gemini</CardTitle>
          <CardDescription>
            Verifique se sua chave de API está funcionando corretamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testAI} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : (
              'Testar API'
            )}
          </Button>

          {result && (
            <Alert variant={result.success ? 'default' : 'destructive'}>
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription className="ml-2">
                {result.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg space-y-2 text-sm">
            <p className="font-semibold">📝 Instruções para gerar nova chave:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Acesse: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google AI Studio</a></li>
              <li>Clique em "Create API Key"</li>
              <li>Copie a nova chave</li>
              <li>Substitua no arquivo <code>.env</code>: <code>GEMINI_API_KEY=sua_nova_chave</code></li>
              <li>Reinicie o servidor: <code>bun dev</code></li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

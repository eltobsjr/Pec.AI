'use server';

import { createClient } from '@/lib/supabase/server';
import type { PhraseItem } from '@/lib/types';

export type SavedPhrase = {
  id: string;
  phrase_text: string;
  phrase_data: PhraseItem[];
  created_at: string;
};

export async function getSavedPhrases(): Promise<SavedPhrase[]> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const { data, error } = await supabase
    .from('saved_phrases')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20); // Limitar a 20 frases mais recentes

  if (error) {
    console.error('Erro ao buscar frases:', error);
    throw error;
  }

  return data || [];
}

export async function savePhrase(phraseItems: PhraseItem[]): Promise<SavedPhrase> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  // Gerar texto da frase para busca/display
  const phraseText = phraseItems
    .map((item) => {
      if (item.type === 'card') {
        return item.data.name;
      } else {
        return item.data.text;
      }
    })
    .join(' ');

  const { data, error} = await supabase
    .from('saved_phrases')
    .insert({
      user_id: user.id,
      phrase_text: phraseText,
      phrase_data: phraseItems,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar frase:', error);
    throw error;
  }

  return data;
}

export async function deletePhrase(phraseId: string): Promise<void> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const { error } = await supabase
    .from('saved_phrases')
    .delete()
    .eq('id', phraseId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Erro ao deletar frase:', error);
    throw error;
  }
}

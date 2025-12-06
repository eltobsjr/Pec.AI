'use server';

import { createClient } from '@/lib/supabase/server';
import type { PecCard } from '@/lib/types';

export type Card = Omit<PecCard, 'id'> & {
  id?: string;
  user_id?: string;
  original_image_url?: string;
  created_at?: string;
  updated_at?: string;
};

export async function getCards(): Promise<PecCard[]> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar cartões:', error);
    throw error;
  }

  // Converter para o formato PecCard
  return (data || []).map(card => ({
    id: card.id,
    name: card.name,
    category: card.category,
    imageSrc: card.image_url,
    isFavorite: card.is_favorite || false,
  }));
}

export async function toggleFavorite(cardId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  // Buscar o estado atual
  const { data: card } = await supabase
    .from('cards')
    .select('is_favorite')
    .eq('id', cardId)
    .eq('user_id', user.id)
    .single();

  if (!card) {
    throw new Error('Cartão não encontrado');
  }

  const newFavoriteState = !card.is_favorite;

  // Atualizar o estado
  const { error } = await supabase
    .from('cards')
    .update({ is_favorite: newFavoriteState })
    .eq('id', cardId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Erro ao atualizar favorito:', error);
    throw error;
  }

  return newFavoriteState;
}

export async function createCard(card: {
  name: string;
  category: string;
  image_url: string;
  original_image_url?: string;
}): Promise<PecCard> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const { data, error } = await supabase
    .from('cards')
    .insert({
      user_id: user.id,
      name: card.name,
      category: card.category,
      image_url: card.image_url,
      original_image_url: card.original_image_url,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar cartão:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    imageSrc: data.image_url,
  };
}

export async function deleteCard(cardId: string): Promise<void> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  // Buscar URLs das imagens antes de deletar
  const { data: card } = await supabase
    .from('cards')
    .select('image_url, original_image_url')
    .eq('id', cardId)
    .eq('user_id', user.id)
    .single();

  if (card) {
    // Deletar imagem do storage (agora só temos original-images)
    if (card.image_url) {
      const imagePath = card.image_url.split('/').slice(-2).join('/');
      await supabase.storage.from('original-images').remove([imagePath]);
    }
  }

  // Deletar o registro do banco
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Erro ao deletar cartão:', error);
    throw error;
  }
}

export async function updateCard(cardId: string, updates: Partial<Card>): Promise<PecCard> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const { data, error } = await supabase
    .from('cards')
    .update({
      name: updates.name,
      category: updates.category,
      image_url: updates.imageSrc,
    })
    .eq('id', cardId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar cartão:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    imageSrc: data.image_url,
  };
}

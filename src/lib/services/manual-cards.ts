'use server';

import { createCard } from './cards';
import { uploadImage } from './storage';

export interface ManualCardInput {
  name: string;
  category: string;
  imageDataUri: string;
}

/**
 * Cria um cartão manualmente sem usar IA
 */
export async function createManualCard(input: ManualCardInput) {
  try {
    // Upload da imagem para o storage
    const imageUrl = await uploadImage(input.imageDataUri, 'pec-cards');

    // Criar registro no banco de dados
    const card = await createCard({
      name: input.name,
      category: input.category,
      image_url: imageUrl,
    });

    return {
      success: true,
      card,
    };
  } catch (error) {
    console.error('Error creating manual card:', error);
    throw new Error('Não foi possível criar o cartão manualmente');
  }
}

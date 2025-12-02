'use server';

import { createClient } from '@/lib/supabase/server';

export async function uploadImage(
  file: File | string,
  bucket: 'original-images' | 'pec-cards' | 'avatars',
  filename?: string
): Promise<string> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  // Gerar nome único para o arquivo
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const extension = filename?.split('.').pop() || 'png';
  const uniqueFilename = filename || `${timestamp}-${randomStr}.${extension}`;
  
  // Path: {user_id}/{filename}
  const path = `${user.id}/${uniqueFilename}`;

  let fileToUpload: File | Blob;

  // Se for uma string (data URI), converter para Blob
  if (typeof file === 'string') {
    const base64Data = file.split(',')[1];
    const mimeType = file.match(/data:([^;]+);/)?.[1] || 'image/png';
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    fileToUpload = new Blob([byteArray], { type: mimeType });
  } else {
    fileToUpload = file;
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, fileToUpload, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Erro ao fazer upload:', error);
    throw error;
  }

  // Obter URL pública
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteImage(url: string, bucket: 'original-images' | 'pec-cards' | 'avatars'): Promise<void> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  // Extrair path da URL
  const urlParts = url.split('/');
  const path = urlParts.slice(-2).join('/'); // user_id/filename

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error('Erro ao deletar imagem:', error);
    throw error;
  }
}

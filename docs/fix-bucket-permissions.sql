-- Verificar e corrigir permissões do bucket original-images
-- Execute este SQL no Supabase SQL Editor

-- 1. Verificar se o bucket está público
SELECT id, name, public 
FROM storage.buckets 
WHERE id = 'original-images';

-- 2. Tornar o bucket público (se não estiver)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'original-images';

-- 3. Verificar novamente
SELECT id, name, public 
FROM storage.buckets 
WHERE id = 'original-images';

-- 4. Remover política antiga se existir e criar nova
DROP POLICY IF EXISTS "Public Access for original-images" ON storage.objects;

-- 5. Adicionar política de acesso público para leitura
CREATE POLICY "Public Access for original-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'original-images');

-- 6. Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';

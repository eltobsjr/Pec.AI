-- Migration: Remove pec-cards bucket and simplify storage
-- Date: 2025-12-02
-- Description: Remove o bucket pec-cards e atualiza referencias para usar apenas original-images

-- 1. Primeiro, vamos atualizar todos os registros que usam pec-cards para usar original-images
-- (caso existam dados)
UPDATE storage.objects
SET bucket_id = 'original-images'
WHERE bucket_id = 'pec-cards';

-- 2. Deletar o bucket pec-cards
DELETE FROM storage.buckets WHERE id = 'pec-cards';

-- 3. Primeiro, atualizar registros onde original_image_url é NULL
-- Usar image_url como fallback
UPDATE cards
SET original_image_url = image_url
WHERE original_image_url IS NULL;

-- 4. Agora sim, tornar a coluna NOT NULL
ALTER TABLE cards 
ALTER COLUMN original_image_url SET NOT NULL;

-- 5. Verificar se tudo está correto
SELECT 
  id,
  name,
  image_url,
  original_image_url,
  CASE 
    WHEN image_url = original_image_url THEN '✓ URLs iguais'
    ELSE '✗ URLs diferentes'
  END as status
FROM cards
LIMIT 10;

-- 6. Ver estatísticas dos buckets
SELECT 
  bucket_id,
  COUNT(*) as total_files,
  pg_size_pretty(SUM(LENGTH(metadata::text))::bigint) as approx_size
FROM storage.objects
GROUP BY bucket_id;

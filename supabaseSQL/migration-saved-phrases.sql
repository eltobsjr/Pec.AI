-- Migration: Criar tabela de frases salvas
-- Date: 2025-12-05
-- Description: Adiciona suporte para salvar histórico de frases montadas pelos usuários

-- 1. Criar tabela saved_phrases
CREATE TABLE IF NOT EXISTS saved_phrases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  phrase_text TEXT NOT NULL,
  phrase_data JSONB NOT NULL, -- Array de PhraseItem[]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS saved_phrases_user_id_idx ON saved_phrases(user_id);
CREATE INDEX IF NOT EXISTS saved_phrases_created_at_idx ON saved_phrases(created_at DESC);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE saved_phrases ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de acesso (com verificação de existência)
-- Usuários podem ver suas próprias frases
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'saved_phrases' 
    AND policyname = 'Users can view own phrases'
  ) THEN
    CREATE POLICY "Users can view own phrases"
      ON saved_phrases FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Usuários podem criar suas próprias frases
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'saved_phrases' 
    AND policyname = 'Users can insert own phrases'
  ) THEN
    CREATE POLICY "Users can insert own phrases"
      ON saved_phrases FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Usuários podem deletar suas próprias frases
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'saved_phrases' 
    AND policyname = 'Users can delete own phrases'
  ) THEN
    CREATE POLICY "Users can delete own phrases"
      ON saved_phrases FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- 5. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Trigger para atualizar updated_at (com verificação de existência)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_saved_phrases_updated_at'
  ) THEN
    CREATE TRIGGER update_saved_phrases_updated_at 
      BEFORE UPDATE ON saved_phrases
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- 7. Verificar tabela criada
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'saved_phrases'
ORDER BY ordinal_position;

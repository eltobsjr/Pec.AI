-- =====================================================
-- PEC.AI - Supabase Database Schema
-- =====================================================
-- Este arquivo contém todas as tabelas, políticas RLS,
-- buckets de storage e triggers necessários para o app
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELAS
-- =====================================================

-- Tabela de perfis de usuário (estende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca por email
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- Tabela de cartões PEC
CREATE TABLE IF NOT EXISTS public.cards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    original_image_url TEXT, -- URL da imagem original (antes da remoção de fundo)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para otimização de queries
CREATE INDEX IF NOT EXISTS cards_user_id_idx ON public.cards(user_id);
CREATE INDEX IF NOT EXISTS cards_category_idx ON public.cards(category);
CREATE INDEX IF NOT EXISTS cards_created_at_idx ON public.cards(created_at DESC);

-- Tabela de frases salvas (opcional, para histórico)
CREATE TABLE IF NOT EXISTS public.saved_phrases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    phrase_data JSONB NOT NULL, -- Array de items (cards + text)
    phrase_text TEXT NOT NULL, -- Texto completo da frase para busca
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para frases
CREATE INDEX IF NOT EXISTS saved_phrases_user_id_idx ON public.saved_phrases(user_id);
CREATE INDEX IF NOT EXISTS saved_phrases_created_at_idx ON public.saved_phrases(created_at DESC);
CREATE INDEX IF NOT EXISTS saved_phrases_text_idx ON public.saved_phrases USING GIN(to_tsvector('portuguese', phrase_text));

-- Tabela de categorias personalizadas (opcional)
CREATE TABLE IF NOT EXISTS public.custom_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#A0D2EB',
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Índice para categorias
CREATE INDEX IF NOT EXISTS custom_categories_user_id_idx ON public.custom_categories(user_id);

-- =====================================================
-- FUNCTIONS E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para profiles
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para cards
CREATE TRIGGER set_cards_updated_at
    BEFORE UPDATE ON public.cards
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Função para criar perfil automaticamente quando novo usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_categories ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES PARA PROFILES
-- =====================================================

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Usuários podem inserir seu próprio perfil (via trigger)
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- POLICIES PARA CARDS
-- =====================================================

-- Usuários podem ver apenas seus próprios cartões
CREATE POLICY "Users can view own cards"
    ON public.cards
    FOR SELECT
    USING (auth.uid() = user_id);

-- Usuários podem criar seus próprios cartões
CREATE POLICY "Users can create own cards"
    ON public.cards
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar seus próprios cartões
CREATE POLICY "Users can update own cards"
    ON public.cards
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Usuários podem deletar seus próprios cartões
CREATE POLICY "Users can delete own cards"
    ON public.cards
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- POLICIES PARA SAVED_PHRASES
-- =====================================================

-- Usuários podem ver suas próprias frases
CREATE POLICY "Users can view own phrases"
    ON public.saved_phrases
    FOR SELECT
    USING (auth.uid() = user_id);

-- Usuários podem criar suas próprias frases
CREATE POLICY "Users can create own phrases"
    ON public.saved_phrases
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar suas próprias frases
CREATE POLICY "Users can delete own phrases"
    ON public.saved_phrases
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- POLICIES PARA CUSTOM_CATEGORIES
-- =====================================================

-- Usuários podem ver suas próprias categorias
CREATE POLICY "Users can view own categories"
    ON public.custom_categories
    FOR SELECT
    USING (auth.uid() = user_id);

-- Usuários podem criar suas próprias categorias
CREATE POLICY "Users can create own categories"
    ON public.custom_categories
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias categorias
CREATE POLICY "Users can update own categories"
    ON public.custom_categories
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Usuários podem deletar suas próprias categorias
CREATE POLICY "Users can delete own categories"
    ON public.custom_categories
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Criar bucket para imagens originais
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'original-images',
    'original-images',
    false, -- privado
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Criar bucket para cartões PEC processados
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'pec-cards',
    'pec-cards',
    true, -- público para facilitar exibição
    5242880, -- 5MB
    ARRAY['image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Criar bucket para avatares de usuários
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true, -- público
    2097152, -- 2MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- POLICIES PARA ORIGINAL-IMAGES (privado)
-- Usuários podem fazer upload de suas próprias imagens
CREATE POLICY "Users can upload own images"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'original-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Usuários podem ver suas próprias imagens
CREATE POLICY "Users can view own images"
    ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'original-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Usuários podem deletar suas próprias imagens
CREATE POLICY "Users can delete own images"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'original-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- POLICIES PARA PEC-CARDS (público)
-- Usuários podem fazer upload de seus próprios cartões
CREATE POLICY "Users can upload own cards"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'pec-cards' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Qualquer um pode ver cartões (bucket público)
CREATE POLICY "Anyone can view cards"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'pec-cards');

-- Usuários podem deletar seus próprios cartões
CREATE POLICY "Users can delete own cards storage"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'pec-cards' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- POLICIES PARA AVATARS (público)
-- Usuários podem fazer upload de seu próprio avatar
CREATE POLICY "Users can upload own avatar"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Qualquer um pode ver avatares (bucket público)
CREATE POLICY "Anyone can view avatars"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'avatars');

-- Usuários podem atualizar seu próprio avatar
CREATE POLICY "Users can update own avatar"
    ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Usuários podem deletar seu próprio avatar
CREATE POLICY "Users can delete own avatar"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para estatísticas do usuário
CREATE OR REPLACE VIEW public.user_stats AS
SELECT
    u.id AS user_id,
    u.email,
    COUNT(DISTINCT c.id) AS total_cards,
    COUNT(DISTINCT c.category) AS total_categories,
    COUNT(DISTINCT sp.id) AS total_saved_phrases,
    MIN(c.created_at) AS first_card_created,
    MAX(c.created_at) AS last_card_created
FROM auth.users u
LEFT JOIN public.cards c ON u.id = c.user_id
LEFT JOIN public.saved_phrases sp ON u.id = sp.user_id
GROUP BY u.id, u.email;

-- =====================================================
-- INDEXES ADICIONAIS PARA PERFORMANCE
-- =====================================================

-- Índice composto para busca de cartões por usuário e categoria
CREATE INDEX IF NOT EXISTS cards_user_category_idx ON public.cards(user_id, category);

-- Índice para busca full-text em nomes de cartões
CREATE INDEX IF NOT EXISTS cards_name_search_idx ON public.cards USING GIN(to_tsvector('portuguese', name));

-- =====================================================
-- FUNCTIONS ÚTEIS
-- =====================================================

-- Função para buscar cartões por texto
CREATE OR REPLACE FUNCTION public.search_cards(
    search_query TEXT,
    user_uuid UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    name TEXT,
    category TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    relevance REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.user_id,
        c.name,
        c.category,
        c.image_url,
        c.created_at,
        ts_rank(to_tsvector('portuguese', c.name), plainto_tsquery('portuguese', search_query)) AS relevance
    FROM public.cards c
    WHERE
        (user_uuid IS NULL OR c.user_id = user_uuid) AND
        to_tsvector('portuguese', c.name) @@ plainto_tsquery('portuguese', search_query)
    ORDER BY relevance DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Função para obter categorias mais usadas
CREATE OR REPLACE FUNCTION public.get_popular_categories(
    user_uuid UUID,
    limit_count INT DEFAULT 10
)
RETURNS TABLE (
    category TEXT,
    count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.category,
        COUNT(*) AS count
    FROM public.cards c
    WHERE c.user_id = user_uuid
    GROUP BY c.category
    ORDER BY count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- GRANTS (Permissões)
-- =====================================================

-- Garantir que usuários autenticados possam acessar as tabelas
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE public.profiles IS 'Perfis estendidos dos usuários';
COMMENT ON TABLE public.cards IS 'Cartões PEC criados pelos usuários';
COMMENT ON TABLE public.saved_phrases IS 'Histórico de frases montadas pelos usuários';
COMMENT ON TABLE public.custom_categories IS 'Categorias personalizadas criadas pelos usuários';

COMMENT ON COLUMN public.cards.image_url IS 'URL da imagem processada (sem fundo) no storage';
COMMENT ON COLUMN public.cards.original_image_url IS 'URL da imagem original (com fundo) no storage';
COMMENT ON COLUMN public.saved_phrases.phrase_data IS 'Array JSON com os items da frase (cards + text)';

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================

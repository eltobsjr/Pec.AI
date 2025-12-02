# Configuração do Supabase - PEC.AI

## 1️⃣ Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Clique em "New Project"
3. Preencha os dados:
   - **Name**: PEC.AI
   - **Database Password**: (crie uma senha forte)
   - **Region**: escolha a mais próxima (ex: South America - São Paulo)
4. Clique em "Create new project"

## 2️⃣ Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em "New Query"
3. Copie todo o conteúdo do arquivo `supabase/schema.sql`
4. Cole no editor e clique em **Run** (ou pressione Ctrl+Enter)
5. Aguarde a execução completar (pode levar alguns segundos)

## 3️⃣ Configurar Variáveis de Ambiente

1. No painel do Supabase, vá em **Settings** > **API**
2. Copie as credenciais:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Atualize o arquivo `.env` com suas credenciais:

```env
GEMINI_API_KEY=sua_chave_gemini

NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
```

## 4️⃣ Verificar Storage Buckets

1. No painel do Supabase, vá em **Storage**
2. Verifique se os buckets foram criados:
   - ✅ `original-images` (privado)
   - ✅ `pec-cards` (público)
   - ✅ `avatars` (público)

## 5️⃣ Testar a Aplicação

```bash
bun dev
```

1. Acesse http://localhost:9002
2. Você será redirecionado para `/login`
3. Clique em "Criar Conta"
4. Preencha os dados e crie sua conta
5. Faça login e teste o aplicativo!

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação
- ✅ Tela de Login (`/login`)
- ✅ Tela de Cadastro (`/signup`)
- ✅ Menu de usuário com logout
- ✅ Middleware protegendo rotas
- ✅ Redirecionamento automático

### 💾 Banco de Dados
- ✅ Tabela `profiles` (perfis de usuário)
- ✅ Tabela `cards` (cartões PEC)
- ✅ Tabela `saved_phrases` (frases salvas)
- ✅ Tabela `custom_categories` (categorias)
- ✅ Row Level Security (RLS) ativo
- ✅ Triggers automáticos

### 📦 Storage
- ✅ Upload de imagens originais
- ✅ Upload de cartões processados
- ✅ Deleção automática ao remover cartão
- ✅ Políticas de segurança (RLS)

### 🎨 Interface
- ✅ Integração completa com Supabase
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Design responsivo

## 🔧 Estrutura de Arquivos Criados

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Cliente Supabase (browser)
│   │   ├── server.ts         # Cliente Supabase (server)
│   │   └── middleware.ts     # Middleware de autenticação
│   └── services/
│       ├── cards.ts          # CRUD de cartões
│       └── storage.ts        # Upload/delete de imagens
├── components/
│   └── auth/
│       ├── AuthProvider.tsx  # Context de autenticação
│       └── UserMenu.tsx      # Menu do usuário
└── app/
    ├── login/
    │   └── page.tsx          # Tela de login
    └── signup/
        └── page.tsx          # Tela de cadastro

middleware.ts                 # Middleware global do Next.js
supabase/
└── schema.sql               # Schema completo do banco
```

## 🚀 Próximos Passos (Opcional)

- [ ] Adicionar recuperação de senha
- [ ] Implementar OAuth (Google, GitHub)
- [ ] Adicionar perfil de usuário editável
- [ ] Implementar compartilhamento de cartões
- [ ] Adicionar estatísticas de uso
- [ ] Implementar histórico de frases
- [ ] Adicionar busca avançada de cartões

## 📝 Notas Importantes

1. **Segurança**: Todas as políticas RLS estão ativas, garantindo que usuários só vejam seus próprios dados
2. **Performance**: Índices criados para otimizar queries frequentes
3. **Storage**: Imagens organizadas por user_id em pastas separadas
4. **Triggers**: Perfil criado automaticamente ao registrar novo usuário
5. **Validações**: Emails únicos, senhas com mínimo 6 caracteres

## 🆘 Troubleshooting

### Erro ao executar schema.sql
- Certifique-se de copiar TODO o conteúdo do arquivo
- Execute em um único comando (não linha por linha)

### Erro de autenticação
- Verifique se as variáveis de ambiente estão corretas
- Reinicie o servidor de desenvolvimento

### Storage não funciona
- Verifique se os buckets foram criados
- Confirme as políticas de storage no SQL Editor

### Cartões não aparecem
- Verifique se o usuário está autenticado
- Abra o console e veja se há erros de API
- Confirme que as tabelas foram criadas corretamente

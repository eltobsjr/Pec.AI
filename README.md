<div align="center">
  <img src="public/logo.svg" alt="PEC.AI Logo" width="200">
  
  # PEC.AI
  
  ### Comunicação Alternativa Inteligente
  
  Crie cartões de comunicação PEC personalizados com Inteligência Artificial
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Storage-green)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
  
</div>

---

## 📖 Sobre o Projeto

**PEC.AI** é uma plataforma de comunicação alternativa e aumentativa que combina Inteligência Artificial com o sistema **PECS (Picture Exchange Communication System)** para criar uma ferramenta moderna de inclusão e acessibilidade.

O aplicativo foi desenvolvido para auxiliar crianças e adultos com dificuldades de comunicação verbal — incluindo pessoas com autismo, paralisia cerebral, síndrome de Down, afasia ou outras condições neurológicas — a se expressarem de forma visual e intuitiva através de cartões ilustrados.

### Como Funciona?

1. **Crie Cartões com IA**: Tire uma foto de qualquer objeto e a IA automaticamente identifica, categoriza e gera um cartão visual pronto para uso
2. **Monte Frases**: Combine múltiplos cartões para formar frases completas, facilitando a comunicação de necessidades e desejos
3. **Biblioteca Organizada**: Todos os cartões ficam salvos por categoria para fácil acesso
4. **Áudio Integrado**: Cada cartão e frase pode ser falado em voz alta, auxiliando na compreensão e aprendizado

### ✨ Características Principais

- 🤖 **IA Integrada**: Geração automática de cartões com Google Gemini
- 📸 **Upload de Imagens**: Crie cartões a partir de fotos
- 🗂️ **Biblioteca Organizada**: Gerencie seus cartões por categorias
- 💬 **Construtor de Frases**: Monte frases combinando múltiplos cartões
- 🔊 **Text-to-Speech**: Áudio para cada cartão e frase
- 🔐 **Autenticação Segura**: Sistema completo de login, cadastro e recuperação de senha
- 📱 **Design Responsivo**: Interface adaptada para desktop e mobile
- 🌙 **Dark/Light Mode**: Suporte a temas claro e escuro
- ☁️ **Cloud Storage**: Armazenamento de imagens no Supabase

---

## 🚀 Tecnologias

### Frontend
- **[Next.js 15.3.3](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript 5.9.2](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização utilitária
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI modernos
- **[Lucide Icons](https://lucide.dev/)** - Ícones SVG

### Backend & Infraestrutura
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - Autenticação (Email/Password)
  - Banco de dados PostgreSQL
  - Storage de imagens
- **[Google Gemini API](https://ai.google.dev/)** - IA para processamento de imagens
- **[Genkit](https://firebase.google.com/docs/genkit)** - Framework para IA

### Ferramentas
- **[Bun](https://bun.sh/)** - Runtime e package manager
- **[Vercel](https://vercel.com/)** - Plataforma de deploy

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ ou Bun 1.0+
- Conta no [Supabase](https://supabase.com/)
- API Key do [Google Gemini](https://ai.google.dev/)

### 1. Clone o Repositório

```bash
git clone https://github.com/eltobsjr/Pec.AI.git
cd Pec.AI
```

### 2. Instale as Dependências

```bash
bun install
# ou
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima

# Google Gemini
GEMINI_API_KEY=sua_chave_api_gemini
```

### 4. Configure o Banco de Dados

Execute as migrações no Supabase (SQL Editor):

```sql
-- Tabela de cartões PEC
create table pec_cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  image_url text not null,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security)
alter table pec_cards enable row level security;

create policy "Users can view own cards"
  on pec_cards for select
  using (auth.uid() = user_id);

create policy "Users can insert own cards"
  on pec_cards for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own cards"
  on pec_cards for delete
  using (auth.uid() = user_id);

-- Storage bucket para imagens
insert into storage.buckets (id, name, public)
values ('pec-cards', 'pec-cards', true);

-- Política de storage
create policy "Users can upload cards"
  on storage.objects for insert
  with check (bucket_id = 'pec-cards' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Cards are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'pec-cards');
```

### 5. Configure Templates de Email (Opcional)

No Dashboard do Supabase:
1. Vá em **Authentication → Email Templates**
2. Configure os templates usando o arquivo `EMAIL_TEMPLATES.md`

### 6. Inicie o Servidor de Desenvolvimento

```bash
bun dev
# ou
npm run dev
```

Acesse [http://localhost:9002](http://localhost:9002)

---

## 🏗️ Estrutura do Projeto

```
Pec.AI/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── api/                # API Routes (não mais utilizado)
│   │   ├── auth/               # Páginas de autenticação
│   │   │   ├── confirm/        # Confirmação de email
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   └── reset-password-success/
│   │   ├── library/            # Página da biblioteca de cartões
│   │   ├── profile/            # Página de perfil do usuário
│   │   ├── settings/           # Página de configurações
│   │   ├── login/              # Página de login
│   │   ├── signup/             # Página de cadastro
│   │   ├── layout.tsx          # Layout principal
│   │   └── page.tsx            # Página inicial (Home)
│   │
│   ├── components/
│   │   ├── auth/               # Componentes de autenticação
│   │   │   ├── AuthProvider.tsx
│   │   │   └── UserMenu.tsx
│   │   ├── pec-ai/             # Componentes principais do app
│   │   │   ├── BottomNav.tsx   # Navegação inferior
│   │   │   ├── CardLibrary.tsx # Biblioteca de cartões
│   │   │   ├── Header.tsx      # Cabeçalho
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── PecCard.tsx     # Componente de cartão
│   │   │   └── PhraseBuilder.tsx
│   │   └── ui/                 # Componentes shadcn/ui
│   │
│   ├── lib/
│   │   ├── services/           # Serviços da aplicação
│   │   │   └── cards.ts        # CRUD de cartões
│   │   ├── supabase/           # Configuração Supabase
│   │   │   ├── client.ts       # Cliente browser
│   │   │   ├── server.ts       # Cliente server
│   │   │   └── middleware.ts   # Middleware de auth
│   │   ├── types.ts            # Tipos TypeScript
│   │   └── utils.ts            # Utilitários
│   │
│   └── ai/                     # Flows de IA (Genkit)
│       └── flows/
│           ├── identify-object-and-generate-card.ts
│           └── text-to-speech.ts
│
├── public/                     # Arquivos estáticos
│   ├── logo.svg                # Logo do projeto
│   ├── logo.png
│   └── favicon.ico
│
├── middleware.ts               # Middleware do Next.js
├── next.config.ts              # Configuração do Next.js
├── tailwind.config.ts          # Configuração do Tailwind
├── tsconfig.json               # Configuração do TypeScript
└── package.json
```

---

## 🎯 Funcionalidades

### Autenticação
- ✅ Cadastro com confirmação por email
- ✅ Login com email/senha
- ✅ Recuperação de senha
- ✅ Logout seguro
- ✅ Sessão persistente

### Gestão de Cartões
- ✅ Upload de imagens
- ✅ Criação de cartões personalizados
- ✅ Categorização automática
- ✅ Busca e filtros
- ✅ Exclusão de cartões

### Construtor de Frases
- ✅ Seleção de múltiplos cartões
- ✅ Reordenação por drag-and-drop
- ✅ Visualização em tempo real
- ✅ Text-to-Speech integrado
- ✅ Limpeza de frase

### Interface
- ✅ Design responsivo (mobile-first)
- ✅ Navegação inferior em mobile
- ✅ Dark mode / Light mode
- ✅ Loading states e skeletons
- ✅ Toasts para feedback

---

## 🌐 Deploy

### Deploy Automático na Vercel

1. Faça fork deste repositório
2. Conecte sua conta Vercel ao GitHub
3. Importe o projeto na Vercel
4. Configure as variáveis de ambiente
5. Deploy automático a cada push na main

### Variáveis de Ambiente na Vercel

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GEMINI_API_KEY
```

### Configuração do Supabase

Após o deploy, configure no Supabase:

**Authentication → URL Configuration**
- Site URL: `https://sua-url.vercel.app`
- Redirect URLs:
  - `https://sua-url.vercel.app/auth/confirm`
  - `https://sua-url.vercel.app/auth/reset-password`
  - `https://sua-url.vercel.app/auth/callback`
  - `https://sua-url.vercel.app/**`

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
bun dev          # Inicia servidor de desenvolvimento

# Build
bun run build    # Gera build de produção

# Produção
bun start        # Inicia servidor de produção

# Linting
bun run lint     # Executa ESLint
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 👨‍💻 Autor

**Uapps by eltobsjr**
- GitHub: [@eltobsjr](https://github.com/eltobsjr)

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend as a Service
- [Google Gemini](https://ai.google.dev/) - IA Generativa
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Vercel](https://vercel.com/) - Plataforma de Deploy

---

<div align="center">
  Desenvolvido por <strong>Uapps by eltobsjr</strong> ❤️
</div>

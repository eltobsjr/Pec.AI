# 🚀 Deploy PEC.AI na Vercel

## Por que fazer deploy?

O **app mobile precisa do backend Next.js** rodando para:
- ✅ Processar imagens com IA (Gemini)
- ✅ Gerar Text-to-Speech

Sem o backend deployado, o mobile **só consegue**:
- Ver cartões já criados
- Fazer login/logout
- Mas **NÃO consegue criar novos cartões** ou usar TTS

---

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com) (gratuita)
2. Projeto no GitHub
3. Variáveis de ambiente prontas

---

## 🔧 Passo a Passo

### 1️⃣ Push para GitHub (se ainda não fez)

```bash
# Na pasta raiz do projeto
git add .
git commit -m "feat: mobile app completo"
git push origin main
```

### 2️⃣ Importar Projeto na Vercel

1. Acesse https://vercel.com
2. Clique em **"Add New Project"**
3. Selecione o repositório **Pec.AI**
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (raiz)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### 3️⃣ Configurar Variáveis de Ambiente

Na tela de configuração da Vercel, adicione:

```env
GEMINI_API_KEY=AIzaSyAR8j7hVouEeYcrr5fxN9rpkqMIoBO-AOw
NEXT_PUBLIC_SUPABASE_URL=https://khgqquenmtqdqmofovgn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZ3FxdWVubXRxZHFtb2ZvdmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MTAzNTEsImV4cCI6MjA4MDI4NjM1MX0.ot3_W2szRisrt9-iDwlm1e67MkU3Pj6_pSVuzKK4zOI
```

⚠️ **Importante:** Adicione essas variáveis em **Environment Variables** antes do deploy!

### 4️⃣ Deploy

1. Clique em **"Deploy"**
2. Aguarde ~2-3 minutos
3. Vercel vai gerar uma URL, tipo: `https://pec-ai.vercel.app`

### 5️⃣ Atualizar Mobile

Edite `mobile/.env`:

```env
# Antes (desenvolvimento local)
API_URL=http://192.168.1.100:9002

# Depois (produção)
API_URL=https://pec-ai.vercel.app
```

**⚠️ Não esqueça de remover a porta `:9002`!**

### 6️⃣ Testar

1. Reinicie o Expo: `npm start`
2. Teste criar um cartão no celular
3. Deve funcionar via internet! 🎉

---

## 🔄 Atualizações Futuras

Sempre que você fizer mudanças no código:

```bash
git add .
git commit -m "descrição da mudança"
git push origin main
```

A Vercel vai fazer **deploy automático** em ~2 minutos!

---

## 💰 Custo

**Vercel Free Tier:**
- ✅ 100GB bandwidth/mês (suficiente para uso pessoal)
- ✅ Deploy ilimitados
- ✅ HTTPS automático
- ✅ Preview deploys

**Gemini API:**
- ✅ 1500 requisições/dia **GRÁTIS**
- ✅ Suficiente para testes e uso médio

**Supabase Free Tier:**
- ✅ 500MB storage
- ✅ 50,000 autenticações/mês
- ✅ Ilimitado para desenvolvimento

**Total: R$ 0/mês** 🎊

---

## 🐛 Troubleshooting

### "API_URL is not defined"

**Problema:** Variável não configurada no mobile.

**Solução:**
```bash
# mobile/.env
API_URL=https://sua-url.vercel.app
```

### "Network request failed"

**Problema:** URL errada ou backend offline.

**Solução:**
1. Verifique se o deploy foi bem sucedido na Vercel
2. Teste a URL no navegador: `https://sua-url.vercel.app/api/ai/identify`
3. Deve retornar erro 401 (esperado, pois precisa autenticação)

### "Gemini API error"

**Problema:** Variável de ambiente não configurada na Vercel.

**Solução:**
1. Vá em Settings > Environment Variables na Vercel
2. Adicione `GEMINI_API_KEY`
3. Redeploy: Settings > Deployments > ... > Redeploy

### Build Error na Vercel

**Problema:** Dependências ou TypeScript errors.

**Solução:**
```bash
# Testar build localmente antes de fazer push
npm run build

# Se der erro, corrija e teste novamente
# Só faça push quando build passar
```

---

## 🎯 URLs Importantes

Após o deploy, você terá:

- **🌐 Web App:** `https://pec-ai.vercel.app`
- **📱 API para Mobile:** `https://pec-ai.vercel.app/api/*`
- **🔐 Login Web:** `https://pec-ai.vercel.app/login`

---

## 🔒 Segurança

### ✅ O que está seguro:
- Variáveis de ambiente (não aparecem no código)
- Supabase RLS protege dados de usuários
- HTTPS automático na Vercel
- Token de autenticação em cada request

### ⚠️ O que verificar:
- Não commitar `.env` (já está no `.gitignore`)
- API Key do Gemini tem limite de uso (1500/dia)
- Supabase tem limites no free tier

---

## 🚀 Próximos Passos

1. **Deploy na Vercel** (seguir passos acima)
2. **Configurar domínio customizado** (opcional)
   - Ex: `pec-ai.com.br`
   - Configurar em Vercel > Settings > Domains
3. **Monitoramento**
   - Vercel Analytics (grátis)
   - Vercel Logs para debug
4. **Backup**
   - Supabase faz backup automático
   - Código no GitHub

---

## ✅ Checklist

- [ ] Push código para GitHub
- [ ] Criar projeto na Vercel
- [ ] Configurar variáveis de ambiente
- [ ] Deploy
- [ ] Testar URL no navegador
- [ ] Atualizar `mobile/.env` com URL da Vercel
- [ ] Reiniciar Expo
- [ ] Testar criar cartão no celular
- [ ] Testar TTS no celular
- [ ] Verificar se funciona fora da rede local

---

**🎉 Depois do deploy, o mobile funciona de qualquer lugar com internet!**

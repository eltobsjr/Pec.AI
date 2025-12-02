# 🔄 Alternativa: Usar sem Deploy (Desenvolvimento)

## ⚠️ Limitações

Se você **NÃO** fizer deploy, o mobile só funcionará quando:
- ✅ Você estiver na **mesma rede WiFi** que o computador
- ✅ O **backend estiver rodando** no computador (`bun dev`)
- ✅ Você usar o **IP local** da máquina (não `localhost`)

## 📱 Funcionalidades Disponíveis

### ✅ Funciona SEM deploy:
- Login/Signup (Supabase direto)
- Ver cartões (Supabase direto)
- Pull-to-refresh
- Logout
- Sincronização com web

### ❌ NÃO funciona SEM deploy:
- **Criar cartão** (precisa da IA no backend)
- **Text-to-Speech** (precisa da IA no backend)

## 🛠️ Como usar em Desenvolvimento

### 1. Descobrir IP da sua máquina

**Windows:**
```bash
ipconfig
# Procure por "IPv4 Address" na sua rede WiFi
# Ex: 192.168.1.100
```

**Mac/Linux:**
```bash
ifconfig
# ou
ip addr show
```

### 2. Configurar Mobile

Edite `mobile/.env`:

```env
# Substituir localhost pelo seu IP
API_URL=http://192.168.1.100:9002
```

### 3. Iniciar Backend

```bash
# Na pasta raiz
cd C:\Users\eltob\dev\Pec.AI
bun dev
```

Backend deve mostrar:
```
✓ Ready on http://localhost:9002
```

### 4. Iniciar Mobile

```bash
cd mobile
npm start
```

### 5. Conectar no mesmo WiFi

**IMPORTANTE:** Celular e computador precisam estar na **mesma rede WiFi**!

### 6. Testar

1. Escanear QR code com Expo Go
2. Fazer login
3. Ver cartões funciona ✅
4. Tentar criar cartão:
   - Se estiver no WiFi: funciona ✅
   - Se estiver em 4G/5G: **não funciona** ❌

## 🎯 Comparação

| Situação | Desenvolvimento (sem deploy) | Produção (com deploy Vercel) |
|----------|------------------------------|------------------------------|
| Precisa do PC ligado | ✅ Sim | ❌ Não |
| Precisa do mesmo WiFi | ✅ Sim | ❌ Não |
| Funciona em 4G/5G | ❌ Não | ✅ Sim |
| Funciona em qualquer lugar | ❌ Não | ✅ Sim |
| Custo | 💰 Grátis | 💰 Grátis |
| Setup | 🟢 Fácil | 🟡 Médio |

## 💡 Recomendação

### Para Desenvolvimento/Testes:
✅ Use **sem deploy** (IP local)
- Mais rápido para testar mudanças
- Não precisa fazer push/deploy a cada alteração

### Para Uso Real/Demonstração:
✅ Faça **deploy na Vercel**
- Funciona em qualquer lugar
- Não precisa do PC ligado
- Mais profissional
- Grátis!

## 🔄 Transição

Você pode começar **sem deploy** e depois fazer deploy quando quiser:

```bash
# Desenvolvimento
mobile/.env: API_URL=http://192.168.1.100:9002

# Deploy na Vercel
# Mude para:
mobile/.env: API_URL=https://pec-ai.vercel.app
```

Só precisa mudar 1 linha e reiniciar o Expo! 🎉

## 🚀 Resumo

**Seu app está pronto para usar de 2 formas:**

1. **Desenvolvimento Local** 🏠
   - Mesma rede WiFi
   - PC ligado com `bun dev`
   - Bom para testes rápidos

2. **Deploy Vercel** ☁️
   - Funciona em qualquer lugar
   - Não precisa PC ligado
   - Grátis e rápido (5 minutos de setup)

**Qual escolher?**
- Se for só testar agora: **Local** ✅
- Se for usar de verdade: **Deploy** ✅✅✅

---

**Criado DEPLOY_VERCEL.md com instruções completas de deploy!**

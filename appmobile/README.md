# PEC.AI Mobile

Aplicativo mobile oficial do **PEC.AI** - Sistema de comunicação alternativa e aumentativa com inteligência artificial.

## 📱 Sobre o App

Aplicativo React Native (Expo) que funciona como **WebView** do site PEC.AI, permitindo acesso completo às funcionalidades da plataforma diretamente pelo celular com experiência nativa, incluindo permissões para câmera, galeria de fotos e navegação otimizada.

## 🚀 Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **react-native-webview** - Componente WebView

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo Go (para testar no celular)

### 1. Instalar Dependências

```bash
cd appmobile
npm install
```

### 2. Executar em Desenvolvimento

```bash
# Iniciar o Expo
npm start

# Ou diretamente para Android
npm run android

# Ou diretamente para iOS (requer macOS)
npm run ios

# Ou para web (versão web do Expo)
npm run web
```

### 3. Testar no Celular

1. Instale o app **Expo Go** no seu celular (Android/iOS)
2. Execute `npm start` no projeto
3. Escaneie o QR Code que aparece no terminal/navegador
4. O app será carregado no Expo Go

## 🏗️ Build para Produção

### Android (APK)

```bash
# Build local (requer Android Studio configurado)
npx expo run:android --variant release

# Ou build na nuvem (requer conta Expo)
eas build --platform android
```

### iOS (IPA)

```bash
# Build local (requer macOS e Xcode)
npx expo run:ios --configuration Release

# Ou build na nuvem (requer conta Expo)
eas build --platform ios
```

## 📂 Estrutura do Projeto

```
appmobile/
├── App.js              # Código principal com WebView
├── app.json            # Configuração do Expo
├── package.json        # Dependências
├── assets/             # Ícones e splash screen
└── README.md           # Este arquivo
```

## 🔧 Configuração

O app está configurado para:

- ✅ Exibir o site https://pec-ai.vercel.app
- ✅ Permitir rolagem e interação normal
- ✅ Mostrar loading durante carregamento
- ✅ Exibir mensagem de erro se falhar conexão
- ✅ JavaScript e storage habilitados
- ✅ Sem headers, menus ou navegação extra
- ✅ Fullscreen (edge-to-edge)

## 📝 Personalizações

Para alterar a URL do site, edite `App.js`:

```javascript
const WEBSITE_URL = 'https://pec-ai.vercel.app';
```

## 🎨 Ícones e Splash Screen

Para substituir ícones e splash screen:

1. Coloque suas imagens em `assets/`
2. Atualize os caminhos em `app.json`
3. Execute `npx expo prebuild` para regenerar assets nativos

Tamanhos recomendados:
- **icon.png**: 1024x1024px
- **adaptive-icon.png**: 1024x1024px
- **splash-icon.png**: 1284x2778px
- **favicon.png**: 48x48px

## 📱 Compatibilidade

- ✅ Android 5.0+ (API 21+)
- ✅ iOS 13.0+
- ✅ Tablet (iPad e Android tablets)

## 🤝 Desenvolvedor

**Uapps by eltobsjr**

## 📄 Licença

Este projeto está sob a mesma licença do projeto principal PEC.AI.

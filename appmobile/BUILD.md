# Build Instructions - PEC.AI Mobile

## 🔨 Preparação para Build

### 1. Instalar Expo CLI Globalmente (Opcional)

```bash
npm install -g expo-cli
```

### 2. Configurar EAS Build (Recomendado para Builds em Nuvem)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login na conta Expo
eas login

# Configurar projeto EAS
eas build:configure
```

## 📱 Build Android

### Opção 1: Build Local (Requer Android Studio)

#### Pré-requisitos
- Android Studio instalado
- Android SDK configurado
- Java JDK 17+
- Variáveis de ambiente configuradas (ANDROID_HOME, JAVA_HOME)

#### Passos

```bash
# Gerar pasta android nativa
npx expo prebuild --platform android

# Build APK debug
npx expo run:android

# Build APK release
cd android
./gradlew assembleRelease

# APK estará em: android/app/build/outputs/apk/release/app-release.apk
```

### Opção 2: Build em Nuvem com EAS (Recomendado)

```bash
# Build APK (para instalação direta)
eas build --platform android --profile preview

# Build AAB (para Google Play Store)
eas build --platform android --profile production

# Download do build quando concluído
eas build:list
```

## 🍎 Build iOS

### Opção 1: Build Local (Requer macOS + Xcode)

#### Pré-requisitos
- macOS
- Xcode 14+ instalado
- Apple Developer Account (para certificados)
- CocoaPods instalado: `sudo gem install cocoapods`

#### Passos

```bash
# Gerar pasta ios nativa
npx expo prebuild --platform ios

# Instalar pods
cd ios
pod install
cd ..

# Build e rodar no simulador
npx expo run:ios

# Build release (abrir no Xcode)
open ios/appmobile.xcworkspace

# No Xcode:
# 1. Selecione seu time de desenvolvimento
# 2. Archive: Product > Archive
# 3. Distribute App
```

### Opção 2: Build em Nuvem com EAS

```bash
# Build para TestFlight/App Store
eas build --platform ios --profile production

# Build para instalação direta (requer device registration)
eas build --platform ios --profile preview
```

## 🚀 Build Multiplataforma

```bash
# Build Android + iOS simultaneamente
eas build --platform all
```

## 📋 Configuração de Perfis de Build (eas.json)

Crie `eas.json` na raiz do projeto `appmobile/`:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "simulator": false
      }
    }
  }
}
```

## 🔐 Assinatura de Apps

### Android - Keystore

```bash
# Gerar keystore
keytool -genkeypair -v -keystore pecai-release-key.keystore -alias pecai-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Configurar em android/gradle.properties
MYAPP_RELEASE_STORE_FILE=pecai-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=pecai-key-alias
MYAPP_RELEASE_STORE_PASSWORD=sua_senha
MYAPP_RELEASE_KEY_PASSWORD=sua_senha
```

### iOS - Certificados

Use EAS ou configure manualmente no Xcode:
1. Developer Account → Certificates, IDs & Profiles
2. Criar App ID: com.uapps.pecai
3. Criar Provisioning Profile
4. Download e instalar certificados

## 📦 Publicação

### Google Play Store

1. Build AAB: `eas build --platform android --profile production`
2. Acesse [Google Play Console](https://play.google.com/console)
3. Crie novo app
4. Upload AAB em "Teste interno" ou "Produção"
5. Preencha informações da listagem
6. Enviar para revisão

### Apple App Store

1. Build IPA: `eas build --platform ios --profile production`
2. Acesse [App Store Connect](https://appstoreconnect.apple.com)
3. Crie novo app
4. Upload via Xcode ou Transporter
5. Preencha informações da listagem
6. Enviar para revisão

## 🧪 Testes

```bash
# Testar no Expo Go (desenvolvimento)
npm start

# Testar build local
npm run android  # ou npm run ios

# Testar build EAS
eas build:run --platform android  # ou ios
```

## ⚠️ Troubleshooting

### Erro: "Unable to resolve module"
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### Erro: Android build falha
```bash
cd android
./gradlew clean
cd ..
npx expo prebuild --clean
```

### Erro: iOS pods
```bash
cd ios
pod deintegrate
pod install
cd ..
```

## 📚 Recursos

- [Expo Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Build Guide](https://docs.expo.dev/build/setup/)
- [Publishing to Stores](https://docs.expo.dev/submit/introduction/)
- [React Native WebView Docs](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md)

## 💡 Dicas

1. **Use EAS Build** para builds mais simples e confiáveis
2. **Teste no Expo Go** antes de fazer builds nativos
3. **Guarde keystores/certificados** em local seguro (não commitar!)
4. **Use perfis diferentes** para desenvolvimento, teste e produção
5. **Incremente versão** em app.json antes de cada build de produção

---

**Desenvolvido por Uapps by eltobsjr**

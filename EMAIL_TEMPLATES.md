# Templates de Email - Supabase

Configure estes templates no Dashboard do Supabase em:
**Authentication → Email Templates**

---

## 1. Confirm Signup (Confirmação de Email)

### Subject:
```
Confirme seu email - PEC.AI
```

### Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: bold;
      color: white;
      margin-bottom: 16px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a1a;
      margin: 0 0 8px 0;
    }
    .subtitle {
      color: #666;
      font-size: 16px;
      margin: 0;
    }
    .content {
      margin: 30px 0;
      font-size: 16px;
      color: #333;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .button:hover {
      opacity: 0.9;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 12px;
      margin: 20px 0;
      font-size: 14px;
      color: #856404;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">P</div>
      <h1 class="title">Bem-vindo ao PEC.AI!</h1>
      <p class="subtitle">Confirme seu email para começar</p>
    </div>
    
    <div class="content">
      <p>Olá! 👋</p>
      <p>Obrigado por se cadastrar no <strong>PEC.AI</strong>, sua ferramenta de comunicação alternativa com Inteligência Artificial.</p>
      <p>Para ativar sua conta e começar a criar cartões PEC personalizados, clique no botão abaixo:</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Confirmar Email</a>
      </div>
      
      <div class="warning">
        <strong>⚠️ Atenção:</strong> Este link expira em 24 horas e só pode ser usado uma vez.
      </div>
      
      <p>Se você não criou uma conta no PEC.AI, por favor ignore este email.</p>
    </div>
    
    <div class="footer">
      <p>© 2025 PEC.AI - Comunicação para Todos</p>
      <p style="margin-top: 8px; color: #999; font-size: 12px;">
        Se o botão não funcionar, copie e cole este link no navegador:<br>
        <span style="word-break: break-all;">{{ .ConfirmationURL }}</span>
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 2. Magic Link (Link Mágico)

### Subject:
```
Seu link de acesso - PEC.AI
```

### Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: bold;
      color: white;
      margin-bottom: 16px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a1a;
      margin: 0;
    }
    .content {
      margin: 30px 0;
      font-size: 16px;
      color: #333;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 12px;
      margin: 20px 0;
      font-size: 14px;
      color: #856404;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">P</div>
      <h1 class="title">Acesse sua conta</h1>
    </div>
    
    <div class="content">
      <p>Olá! 👋</p>
      <p>Clique no botão abaixo para acessar sua conta no PEC.AI:</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Acessar PEC.AI</a>
      </div>
      
      <div class="warning">
        <strong>⚠️ Atenção:</strong> Este link expira em 1 hora e só pode ser usado uma vez.
      </div>
      
      <p>Se você não solicitou este acesso, por favor ignore este email.</p>
    </div>
    
    <div class="footer">
      <p>© 2025 PEC.AI - Comunicação para Todos</p>
      <p style="margin-top: 8px; color: #999; font-size: 12px;">
        Link alternativo: <span style="word-break: break-all;">{{ .ConfirmationURL }}</span>
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 3. Reset Password (Recuperação de Senha)

### Subject:
```
Recuperação de senha - PEC.AI
```

### Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: bold;
      color: white;
      margin-bottom: 16px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a1a;
      margin: 0 0 8px 0;
    }
    .subtitle {
      color: #666;
      font-size: 16px;
      margin: 0;
    }
    .content {
      margin: 30px 0;
      font-size: 16px;
      color: #333;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 12px;
      margin: 20px 0;
      font-size: 14px;
      color: #856404;
    }
    .security-tip {
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
      padding: 12px;
      margin: 20px 0;
      font-size: 14px;
      color: #0d47a1;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">P</div>
      <h1 class="title">Recuperação de Senha</h1>
      <p class="subtitle">Redefina sua senha do PEC.AI</p>
    </div>
    
    <div class="content">
      <p>Olá! 👋</p>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta no <strong>PEC.AI</strong>.</p>
      <p>Clique no botão abaixo para criar uma nova senha:</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Redefinir Senha</a>
      </div>
      
      <div class="warning">
        <strong>⚠️ Atenção:</strong> Este link expira em 1 hora e só pode ser usado uma vez.
      </div>
      
      <div class="security-tip">
        <strong>🔒 Dica de Segurança:</strong> Escolha uma senha forte com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.
      </div>
      
      <p><strong>Não solicitou esta alteração?</strong></p>
      <p>Se você não pediu para redefinir sua senha, ignore este email. Sua senha atual continuará funcionando normalmente e sua conta está segura.</p>
    </div>
    
    <div class="footer">
      <p>© 2025 PEC.AI - Comunicação para Todos</p>
      <p style="margin-top: 8px; color: #999; font-size: 12px;">
        Link alternativo:<br>
        <span style="word-break: break-all;">{{ .ConfirmationURL }}</span>
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 4. Change Email (Mudança de Email)

### Subject:
```
Confirme seu novo email - PEC.AI
```

### Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: bold;
      color: white;
      margin-bottom: 16px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a1a;
      margin: 0;
    }
    .content {
      margin: 30px 0;
      font-size: 16px;
      color: #333;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 12px;
      margin: 20px 0;
      font-size: 14px;
      color: #856404;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">P</div>
      <h1 class="title">Confirme seu novo email</h1>
    </div>
    
    <div class="content">
      <p>Olá! 👋</p>
      <p>Você solicitou a alteração do email da sua conta no <strong>PEC.AI</strong>.</p>
      <p>Para confirmar este novo endereço de email, clique no botão abaixo:</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Confirmar Novo Email</a>
      </div>
      
      <div class="warning">
        <strong>⚠️ Atenção:</strong> Este link expira em 24 horas e só pode ser usado uma vez.
      </div>
      
      <p>Se você não solicitou esta alteração, por favor ignore este email e entre em contato com nosso suporte.</p>
    </div>
    
    <div class="footer">
      <p>© 2025 PEC.AI - Comunicação para Todos</p>
      <p style="margin-top: 8px; color: #999; font-size: 12px;">
        Link alternativo: <span style="word-break: break-all;">{{ .ConfirmationURL }}</span>
      </p>
    </div>
  </div>
</body>
</html>
```

---

## Configuração no Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Authentication → Email Templates**
4. Para cada template (Confirm signup, Magic Link, Reset Password, Change Email):
   - Cole o **Subject** no campo de assunto
   - Cole o **Body (HTML)** no editor de conteúdo
   - Clique em **Save**

### Configurações Adicionais Recomendadas

Em **Authentication → Settings → Email**:
- **Enable email confirmations**: ✅ Ativado
- **Secure email change**: ✅ Ativado
- **Double confirm email changes**: ✅ Ativado (recomendado)

Em **Authentication → URL Configuration**:
- **Site URL**: `http://localhost:9002` (desenvolvimento) ou sua URL de produção
- **Redirect URLs**: 
  - `http://localhost:9002/auth/confirm`
  - `http://localhost:9002/auth/reset-password`
  - Adicione suas URLs de produção quando deployar

---

## Variáveis Disponíveis nos Templates

- `{{ .ConfirmationURL }}` - URL de confirmação/redefinição
- `{{ .Token }}` - Token de autenticação
- `{{ .TokenHash }}` - Hash do token
- `{{ .SiteURL }}` - URL do site configurada
- `{{ .Email }}` - Email do usuário
- `{{ .RedirectTo }}` - URL de redirecionamento

---

## Testando os Templates

Para testar os emails em desenvolvimento:
1. Use um serviço como [Mailtrap](https://mailtrap.io/) ou [MailHog](https://github.com/mailhog/MailHog)
2. Configure o SMTP no Supabase Dashboard em **Project Settings → Auth → SMTP Settings**
3. Ou use o email real do Supabase (já configurado por padrão)

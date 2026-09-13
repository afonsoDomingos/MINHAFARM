# Variáveis de Ambiente para Vercel

## 🔑 Variáveis Obrigatórias

### 1. MONGODB_URI
**Descrição**: Connection string para o banco de dados MongoDB
**Formato**: 
- MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/minhafarm?retryWrites=true&w=majority`
- MongoDB Local (não recomendado para Vercel): `mongodb://localhost:27017/minhafarm`

**Recomendação**: Use MongoDB Atlas para produção na Vercel

### 2. NEXTAUTH_SECRET
**Descrição**: Chave secreta para criptografia de sessões NextAuth
**Formato**: String aleatória longa (mínimo 32 caracteres)
**Como gerar**: 
```bash
openssl rand -base64 32
# ou
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Importante**: Use uma chave forte e única. Não revele esta chave.

### 3. NEXTAUTH_URL
**Descrição**: URL de produção da aplicação
**Formato**: `https://seu-dominio.vercel.app` ou seu domínio personalizado
**Exemplo**: `https://minhafarmmz.vercel.app`

**Nota**: NextAuth usa esta URL para gerar URLs de callback e cookies seguros.

## 📋 Como Configurar na Vercel

### Passo 1: Aceder ao Projeto na Vercel
1. Aceda a https://vercel.com/dashboard
2. Selecione o projeto MINHAFARM

### Passo 2: Adicionar Variáveis de Ambiente
1. Clique em **Settings** → **Environment Variables**
2. Adicione cada variável:

```
Name: MONGODB_URI
Value: mongodb+srv://seu-usuario:sua-password@cluster.mongodb.net/minhafarm?retryWrites=true&w=majority
Environment: Production, Preview, Development

Name: NEXTAUTH_SECRET
Value: sua-chave-secreta-gerada
Environment: Production, Preview, Development

Name: NEXTAUTH_URL
Value: https://minhafarmmz.vercel.app
Environment: Production
```

### Passo 3: Redeploy
1. Após adicionar as variáveis, clique em **Redeploy**
2. Ou faça um novo push para o GitHub para trigger deploy automático

## 🎯 Exemplo de Valores

### MongoDB Atlas (Recomendado)
```
MONGODB_URI=mongodb+srv://karinganastudio23:VIbemongodb@cluster0.oe0akin.mongodb.net/minhafarmdb?retryWrites=true&w=majority
```

### NEXTAUTH_SECRET (Gerado para produção)
```
NEXTAUTH_SECRET=1NV7h+6U+spk5ZIRx8wMF9XI8NiX9p4MFBLLXTa9JhA=
```

### NEXTAUTH_URL
```
NEXTAUTH_URL=https://minhafarmmz.vercel.app
```

## ⚠️ Importante

### MongoDB Atlas Setup
Antes de configurar na Vercel:

1. **Aceda ao MongoDB Atlas**: https://cloud.mongodb.com
2. **Network Access**: 
   - Vá em Database → Network Access
   - Adicione IP: `0.0.0.0/0` (permite acesso de qualquer lugar)
   - Ou adicione IPs específicos da Vercel se preferir
3. **Database Access**: 
   - Verifique que o usuário tem permissões de leitura/escrita
4. **Cluster Status**: 
   - Certifique-se que o cluster está "Active"

### Segurança
- ✅ Nunca faça commit de variáveis de ambiente no Git
- ✅ Use valores diferentes para produção e desenvolvimento
- ✅ Use chaves fortes para NEXTAUTH_SECRET
- ✅ Rode o MongoDB Atlas com autenticação habilitada
- ⚠️ Não use a connection string do .env.local exemplo em produção

### Domínio Personalizado
Se usar domínio personalizado:
```
NEXTAUTH_URL=https://www.minhafarm.co.mz
```

## 🔄 Diferença de Ambientes

### Production
- URL final do site
- Database de produção
- Secret de produção

### Preview
- URL temporária (ex: branch-name.vercel.app)
- Pode usar database de desenvolvimento
- Secret diferente de produção

### Development
- Local: http://localhost:3000
- Database local ou de desenvolvimento
- Secret de desenvolvimento

## 🧪 Testar Deploy na Vercel

### 1. Fazer Deploy Inicial
```bash
git push origin main
```

### 2. Verificar Variáveis
Na Vercel Dashboard → Settings → Environment Variables:
- Confirme que as 3 variáveis estão presentes
- Verifique que estão marcadas para "Production"

### 3. Verificar Logs
Vercel Dashboard → Deployments → Último deploy → View Function Logs:
- Verifique se há erros de conexão MongoDB
- Verifique se NextAuth está funcionando

### 4. Testar o Site
- Aceda à URL da Vercel
- Teste login/registo
- Teste conexão com MongoDB

## 📞 Troubleshooting

### Erro: "MongoDB connection failed"
- Verifique MONGODB_URI está correta
- Verifique Network Access no MongoDB Atlas
- Verifique cluster está ativo

### Erro: "NextAuth configuration error"
- Verifique NEXTAUTH_SECRET está definida
- Verifique NEXTAUTH_URL está correta
- Limpe cookies do navegador

### Erro: "Build failed"
- Verifique que todas as dependências estão instaladas
- Execute `npm run build` localmente primeiro
- Verifique erros de TypeScript

## 🚀 Checklist Antes do Deploy

- [ ] MongoDB Atlas configurado e acessível
- [ ] MONGODB_URI configurada na Vercel
- [ ] NEXTAUTH_SECRET gerado e configurado
- [ ] NEXTAUTH_URL configurado com domínio correto
- [ ] Testado localmente com `npm run build`
- [ ] Build local sem erros
- [ ] Dados de teste não sensíveis
- [ ] Passwords de teste alteradas
- [ ] Cluster MongoDB Atlas ativo
- [ ] Network Access no MongoDB Atlas configurado
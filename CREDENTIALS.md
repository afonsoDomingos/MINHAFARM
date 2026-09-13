# CREDENCIAIS DE TESTE - MINHAFARM

## 🔐 Credenciais de Acesso

### 👤 Administrador
- **Email**: `admin@minhafarm.co.mz`
- **Password**: `admin123`
- **Painel**: `/dashboard/admin`
- **Funções**: Aprovar farmácias, ver estatísticas, gerir plataforma

### 🏥 Farmácia Central
- **Email**: `farmacia1@minhafarm.co.mz`
- **Password**: `pharmacy123`
- **Painel**: `/dashboard/pharmacy`
- **Localização**: Sommerschield, Maputo
- **Telefone**: +258 84 123 4567

### 🏥 Farmácia São João
- **Email**: `farmacia2@minhafarm.co.mz`
- **Password**: `pharmacy123`
- **Painel**: `/dashboard/pharmacy`
- **Localização**: Polana, Maputo
- **Telefone**: +258 84 987 6543

## 💊 Medicamentos Disponíveis nas Farmácias

### Farmácia Central
1. **Paracetamol 500 mg** - 150 MT (Disponível)
2. **Ibuprofeno 400 mg** - 200 MT (Disponível)
3. **Amoxicilina 500 mg** - 350 MT (Disponível) - Receita necessária
4. **Dipirona 500 mg** - 120 MT (Disponível)
5. **Omeprazol 20 mg** - 280 MT (Disponível)

### Farmácia São João
1. **Paracetamol 500 mg** - 145 MT (Disponível)
2. **Ibuprofeno 400 mg** - 190 MT (Disponível)
3. **Amoxicilina 500 mg** - 380 MT (Disponível) - Receita necessária
4. **Dipirona 500 mg** - 115 MT (Indisponível)
5. **Omeprazol 20 mg** - 270 MT (Disponível)

## ⚠️ STATUS DO BANCO DE DADOS

**MongoDB Atlas**: Cluster não está acessível no momento. O script de dados de teste não pode ser executado até que a conexão seja estabelecida.

### � Para Carregar os Dados de Teste:

**Opção 1: MongoDB Atlas (Quando Disponível)**
1. Verifique se o cluster está ativo no MongoDB Atlas
2. Verifique Network Access (whitelist de IP)
3. Execute: `npm run seed-data`

**Opção 2: MongoDB Local (Recomendado para Testes)**
1. Instale MongoDB localmente:
   - Windows: https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: `sudo apt-get install mongodb`
2. Inicie o MongoDB: `mongod`
3. Altere o `.env.local` para usar local:
   ```
   MONGODB_URI=mongodb://localhost:27017/minhafarm
   ```
4. Execute: `npm run seed-data`

**Opção 3: Testar Sem Dados**
1. O sistema funciona mesmo sem dados de teste
2. Pode criar manualmente:
   - Registar farmácias em `/pharmacy-register`
   - Adicionar medicamentos no painel da farmácia
   - Criar utilizadores em `/register`

## �🚀 Fluxo de Teste Rápido

### 1. Login como Admin
1. Aceda a http://localhost:3000
2. Clique em "Entrar"
3. Use: `admin@minhafarm.co.mz` / `admin123`
4. Aceda ao painel administrativo
5. Pode aprovar farmácias manualmente

### 2. Registar Farmácia Manualmente
1. Aceda a http://localhost:3000/pharmacy-register
2. Preencha os dados da farmácia
3. Após registo, use credenciais para login
4. Aprovada pelo admin, pode adicionar medicamentos

### 3. Login como Farmácia
1. Aceda a http://localhost:3000/pharmacy-login
2. Use: `farmacia1@minhafarm.co.mz` / `pharmacy123` (após seed-data)
3. Ou use credenciais da farmácia que registrou
4. Adicione medicamentos manualmente no painel

### 4. Criar Utilizador de Teste
1. Aceda a http://localhost:3000
2. Clique em "Criar Conta"
3. Preencha os dados (qualquer dados funcionam)
4. Use a conta criada para testar fluxo de utilizador

### 5. Pesquisar Medicamentos
1. Aceda a http://localhost:3000
2. Pesquise qualquer medicamento
3. Verá farmácias disponíveis (após seed-data ou manual)
4. Compare preços entre farmácias

## 🔄 Como Regerar Dados de Teste

Quando o MongoDB estiver disponível:

```bash
# Regerar dados de teste
npm run seed-data
```

## 📞 Resolução de Problemas MongoDB

### Se `npm run seed-data` falhar:

1. **Testar conexão:**
   ```bash
   npm run test-connection
   ```

2. **Verificar MongoDB Atlas:**
   - Aceda a https://cloud.mongodb.com
   - Verifique se o cluster está "Active"
   - Verifique Network Access (whitelist)

3. **Usar MongoDB Local:**
   - Instale MongoDB localmente
   - Inicie com `mongod`
   - Atualize `.env.local` para `mongodb://localhost:27017/minhafarm`

## 🎯 Diferença: Com vs Sem Dados de Teste

### Com Dados de Teste (Seed):
- ✅ 2 farmácias pré-configuradas
- ✅ 5 medicamentos prontos
- ✅ Preços e disponibilidade definidos
- ✅ Login imediato com credenciais conhecidas

### Sem Dados de Teste:
- ✅ Sistema funciona normalmente
- ⚠️ Precisa registar farmácia manualmente
- ⚠️ Precisa adicionar medicamentos manualmente
- ✅ Mais flexível para testes personalizados

## 📞 Suporte

Se tiver problemas com conexão MongoDB:
1. Execute `npm run test-connection` para diagnosticar
2. Considere usar MongoDB local para testes
3. O sistema funciona perfeitamente sem dados pré-carregados
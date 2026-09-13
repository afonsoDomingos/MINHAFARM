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

## 🚀 Fluxo de Teste Rápido

### 1. Login como Admin
1. Aceda a http://localhost:3000
2. Clique em "Entrar"
3. Use: `admin@minhafarm.co.mz` / `admin123`
4. Aceda ao painel administrativo
5. Verifique as farmácias já aprovadas

### 2. Login como Farmácia
1. Aceda a http://localhost:3000
2. Clique em "Entrar" ou "Área da Farmácia"
3. Use: `farmacia1@minhafarm.co.mz` / `pharmacy123`
4. Veja os medicamentos cadastrados
5. Gerencie pedidos recebidos

### 3. Criar Utilizador de Teste
1. Aceda a http://localhost:3000
2. Clique em "Criar Conta"
3. Preencha os dados (qualquer dados funcionam)
4. Use a conta criada para testar fluxo de utilizador

### 4. Pesquisar Medicamentos
1. Aceda a http://localhost:3000
2. Pesquise "Paracetamol" ou "Ibuprofeno"
3. Veja as farmácias onde estão disponíveis
4. Compare preços entre farmácias

### 5. Fazer Pedido
1. Após login como utilizador
2. Pesquise um medicamento
3. Clique numa farmácia
4. Adicione ao pedido
5. Verifique o pedido no painel da farmácia

## ⚠️ Notas Importantes

- Estas credenciais são apenas para **testes e desenvolvimento**
- Em produção, todos os utilizadores devem criar as suas próprias contas
- As passwords devem ser alteradas antes do lançamento em produção
- Os dados de teste podem ser regerados executando `npm run seed-data`

## 🔄 Como Regerar Dados de Teste

Se precisar de limpar e regerar os dados de teste:

```bash
# Limpar dados do MongoDB (opcional)
# Conecte ao MongoDB e execute:
use minhafarm
db.users.deleteMany({ role: 'pharmacy' })
db.pharmacies.deleteMany()
db.medicines.deleteMany()
db.pharmacyMedicines.deleteMany()

# Regerar dados de teste
npm run seed-data
```

## 📞 Suporte

Se tiver problemas com login:
1. Verifique que o MongoDB está a correr
2. Confirme que executou `npm run seed-data`
3. Verifique as credenciais neste arquivo
4. Limpe os cookies do navegador se necessário
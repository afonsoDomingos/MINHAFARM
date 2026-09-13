# ConectLife - Plataforma Digital de Medicamentos em Moçambique

Plataforma digital que conecta pessoas que procuram medicamentos com farmácias cadastradas em Moçambique.

## 🚀 Tecnologias

- **Frontend**: Next.js 16 (React 19), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB com Mongoose
- **Autenticação**: NextAuth.js
- **Password Hashing**: bcryptjs

## 📋 Pré-requisitos

- Node.js 18+ 
- MongoDB (local ou na nuvem)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <repositorio>
cd ConectLife
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
MONGODB_URI=mongodb://localhost:27017/conectlife
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-aqui
```

4. Inicie o MongoDB:
```bash
# Se estiver usando MongoDB local
mongod
```

Se não tiver MongoDB instalado localmente, pode usar MongoDB Atlas (gratuito):
- Crie uma conta em https://www.mongodb.com/cloud/atlas
- Crie um cluster gratuito
- Copie a connection string
- Atualize o MONGODB_URI no .env.local com a connection string do Atlas

5. Crie o utilizador administrador:
```bash
npm run create-admin
```

Isto criará:
- Utilizador admin: `admin@conectlife.co.mz`
- Password: `admin123`
- Medicamentos de exemplo

⚠️ **Importante**: Altere a password do administrador após o primeiro login!

6. Configure o MongoDB (escolha uma opção):

**Opção A: MongoDB Atlas (Nuvem - Recomendado)**
- Crie conta gratuita em https://www.mongodb.com/cloud/atlas
- Crie um cluster gratuito
- Copie a connection string
- Atualize o MONGODB_URI no .env.local com a connection string
- Execute: `npm run seed-data`

**Opção B: MongoDB Local**
- Instale MongoDB localmente
- Inicie o MongoDB: `mongod`
- Use a connection string local em .env.local

**Opção C: Testar Sem MongoDB**
- O sistema funciona sem dados pré-carregados
- Pode registar farmácias manualmente em `/pharmacy-register`
- Pode adicionar medicamentos manualmente no painel da farmácia

7. Crie o utilizador administrador:
```bash
npm run create-admin
```

Isto criará:
- Utilizador admin: `admin@conectlife.co.mz`
- Password: `admin123`
- Medicamentos de exemplo

⚠️ **Importante**: Altere a password do administrador após o primeiro login!

8. Adicione dados de teste (opcional - requer MongoDB):
```bash
npm run seed-data
```

Isto criará:
- 2 farmácias de teste (Farmácia Central e Farmácia São João)
- 5 medicamentos diferentes
- Preços e disponibilidade em ambas as farmácias

📋 **Credenciais**: Veja o arquivo [CREDENTIALS.md](./CREDENTIALS.md) para todas as credenciais de teste e instruções detalhadas.

9. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
ConectLife/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Autenticação
│   │   │   ├── admin/         # Rotas administrativas
│   │   │   ├── pharmacies/    # Rotas de farmácias
│   │   │   ├── medicines/     # Rotas de medicamentos
│   │   │   ├── orders/        # Rotas de pedidos
│   │   │   └── users/         # Rotas de utilizadores
│   │   ├── dashboard/         # Painéis de controlo
│   │   │   ├── admin/         # Painel administrativo
│   │   │   ├── pharmacy/      # Painel da farmácia
│   │   │   └── user/          # Painel do utilizador
│   │   ├── login/             # Página de login
│   │   ├── register/          # Página de registo
│   │   ├── pharmacy-login/    # Login da farmácia
│   │   ├── pharmacy-register/ # Registo da farmácia
│   │   ├── search/            # Busca de medicamentos
│   │   ├── pharmacies/        # Lista de farmácias
│   │   ├── pharmacy/[id]/     # Perfil da farmácia
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página inicial
│   │   └── globals.css        # Estilos globais
│   ├── components/            # Componentes React
│   │   ├── Header.tsx         # Cabeçalho
│   │   ├── Footer.tsx         # Rodapé
│   │   ├── Providers.tsx      # Session provider
│   │   └── PharmacyDashboardNav.tsx
│   └── lib/                   # Bibliotecas e utilitários
│       ├── auth.ts            # Configuração NextAuth
│       ├── db/                # Conexão MongoDB
│       │   └── mongoose.ts
│       └── models/            # Modelos Mongoose
│           ├── User.ts
│           ├── Pharmacy.ts
│           ├── Medicine.ts
│           ├── PharmacyMedicine.ts
│           └── Order.ts
├── scripts/                   # Scripts de utilidade
│   └── create-admin.ts       # Script para criar admin
├── public/                    # Arquivos estáticos
├── .env.local                # Variáveis de ambiente
├── package.json              # Dependências
├── tsconfig.json             # Configuração TypeScript
├── tailwind.config.ts        # Configuração Tailwind
└── next.config.ts            # Configuração Next.js
```

## 👥 Tipos de Utilizadores

### 1. Utilizador Comum
- Pesquisar medicamentos
- Ver farmácias disponíveis
- Fazer pedidos
- Acompanhar status dos pedidos
- Guardar farmácias favoritas

### 2. Farmácia
- Cadastrar medicamentos
- Gerir preços e disponibilidade
- Receber e processar pedidos
- Atualizar informações da farmácia

### 3. Administrador
- Aprovar farmácias
- Gerir utilizadores
- Monitorizar estatísticas
- Aceder a todos os pedidos

## 🎨 Design

A plataforma utiliza um design moderno e limpo com:
- **Cores principais**: Branco e Verde
- **Fonte**: Inter (Google Fonts)
- **Framework CSS**: Tailwind CSS
- **Design responsivo**: Mobile-first

## 📝 Funcionalidades Implementadas

### ✅ Funcionalidades Core
- [x] Sistema de autenticação (NextAuth.js)
- [x] Registo de utilizadores e farmácias
- [x] Pesquisa de medicamentos
- [x] Listagem de farmácias
- [x] Perfil da farmácia com medicamentos
- [x] Painel da farmácia
  - [x] Gestão de medicamentos
  - [x] Gestão de pedidos
  - [x] Definições da farmácia
- [x] Painel do utilizador
  - [x] Histórico de pedidos
- [x] Painel administrativo
  - [x] Estatísticas
  - [x] Gestão de farmácias (aprovar/suspender)
- [x] Sistema de pedidos
  - [x] Criação de pedidos
  - [x] Estados do pedido
  - [x] Atualização de status

### 🚧 Funcionalidades Futuras
- [ ] Mapa interativo com localização das farmácias
- [ ] Sistema de avaliações de farmácias
- [ ] Entrega ao domicílio
- [ ] Integração com pagamentos digitais
- [ ] Notificações push
- [ ] App móvel (Android/iOS)
- [ ] Chat entre utilizador e farmácia

## 🔐 Segurança

- Passwords hashed com bcryptjs
- Sessões geridas pelo NextAuth.js
- Proteção de rotas por roles
- Validação de dados no backend
- Sanitização de inputs

## 📊 Modelos de Dados

### User
- name, email, password, phone
- role (user, pharmacy, admin)
- favorites (array de pharmacy IDs)

### Pharmacy
- name, email, password, logo
- address, neighborhood, city, phone
- openingHours, location (GeoJSON)
- status (pending, approved, suspended)
- rating

### Medicine
- name, description, category
- dosage, manufacturer
- requiresPrescription, active

### PharmacyMedicine
- pharmacyId, medicineId
- price, available, quantity

### Order
- userId, pharmacyId
- items (array)
- totalAmount, status
- deliveryMethod, deliveryAddress, notes

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras plataformas
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📞 Suporte

Para questões ou suporte, contacte: [seu-email]

## 📄 Licença

Copyright © 2026 ConectLife. Todos os direitos reservados.

---

Desenvolvido com ❤️ para Moçambique
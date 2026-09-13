# ConectLife - Arquitetura Expansível para Serviços Essenciais

## Visão Geral

A ConectLife é uma plataforma digital baseada em geolocalização que conecta as pessoas a serviços essenciais que estão próximos delas. A plataforma foi desenhada para ser escalável e permitir a adição de múltiplos tipos de serviços.

## Serviços Atuais e Futuros

### ✅ Implementado
- **Farmácias** - Sistema completo de busca, cadastro, pedidos e gestão

### 🚧 Próximos Serviços
- **Agentes de Carteira Móvel** (M-Pesa, Vodacom, Movitel)
- **Outros serviços essenciais** (a definir)

## Arquitetura de Serviços

### Modelo Genérico de Serviços

A plataforma usa uma arquitetura baseada em tipos de serviços (ServiceType) que define:

1. **Nome e Descrição** do serviço
2. **Categoria** (pharmacy, mobile-money, other)
3. **Campos Personalizados** (custom fields) específicos para cada tipo de serviço
4. **Ícone** para identificação visual

### Exemplo de Estrutura

#### ServiceType (Tipo de Serviço)
```typescript
{
  name: "Farmácia",
  slug: "pharmacy",
  description: "Estabelecimentos farmacêuticos",
  icon: "pharmacy-icon",
  category: "pharmacy",
  fields: [
    { name: "cnpj", type: "text", required: true },
    { name: "crf", type: "text", required: true }
  ]
}
```

#### ServiceProvider (Prestador de Serviço)
```typescript
{
  serviceTypeId: ObjectId,
  name: "Farmácia Central",
  email: "farmacia@email.com",
  address: "Av. Julius Nyerere, 123",
  city: "Maputo",
  location: { type: "Point", coordinates: [lat, lng] },
  customFields: {
    cnpj: "123456789",
    crf: "CRF-12345"
  }
}
```

## Migração do Sistema Atual

### Fase 1: Compatibilidade (Atual)
- Manter os modelos existentes (Pharmacy, Medicine, etc.)
- Criar novos modelos genéricos (ServiceType, ServiceProvider)
- Implementar pontes entre os sistemas

### Fase 2: Transição
- Migrar farmácias para o modelo genérico
- Manter API endpoints existentes para backward compatibility
- Criar novos endpoints genéricos

### Fase 3: Expansão
- Adicionar novos tipos de serviços (carteira móvel)
- Implementar campos personalizados específicos
- Criar interfaces específicas para cada tipo

## Funcionalidades Genéricas

### 1. Busca por Geolocalização
- Busca de prestadores por proximidade
- Filtro por tipo de serviço
- Ordenação por distância

### 2. Cadastro de Prestadores
- Formulário dinâmico baseado no tipo de serviço
- Validação de campos personalizados
- Aprovação por admin

### 3. Avaliação e Reviews
- Sistema de rating (1-5 estrelas)
- Comentários textuais
- Moderação de reviews

### 4. Gestão de Serviços/Produtos
- Para farmácias: medicamentos
- Para agentes de carteira: tipos de transações
- Extensível para outros serviços

## Modelo de Dados

### ServiceType
- Define a estrutura de cada tipo de serviço
- Campos configuráveis (text, number, boolean, select)
- Categorização (pharmacy, mobile-money, other)

### ServiceProvider
- Representa um prestador de serviço específico
- Referência ao ServiceType
- Campos customizáveis via customFields
- Localização geográfica

### ServiceItem (Genérico)
- Para farmácias: Medicamentos
- Para agentes: Tipos de transação
- Extensível conforme necessário

## API Endpoints

### Genéricos (Futuros)
- `GET /api/services` - Lista tipos de serviços
- `GET /api/providers?serviceType=X&lat=Y&lng=Z` - Busca prestadores por proximidade
- `POST /api/providers/register` - Cadastro genérico
- `GET /api/providers/:id` - Detalhes do prestador

### Específicos (Atuais - Farmácias)
- Mantidos para backward compatibility
- Serão migrados gradualmente para endpoints genéricos

## Frontend

### Homepage
- Seleção de tipo de serviço (farmácia, carteira móvel, etc.)
- Busca inteligente baseada no tipo selecionado
- Resultados por proximidade

### Páginas Específicas
- `/pharmacies` - Busca de farmácias (existente)
- `/mobile-money` - Busca de agentes de carteira (futuro)
- `/services` - Busca geral de serviços (futuro)

### Dashboard do Prestador
- Genérico com campos dinâmicos
- Específico para cada tipo de serviço
- Gestão de serviços/produtos

## Integração com Agentes de Carteira Móvel

### Campos Específicos
- Operadora (M-Pesa, Vodacom, Movitel)
- Tipos de transação (levantamento, depósito, pagamento)
- Limites de transação
- Horários de funcionamento

### Funcionalidades
- Busca por operadora
- Filtro por tipo de transação
- Verificação de disponibilidade
- Avaliação do serviço

## Roadmap de Expansão

### Fase 1: Fundação (Concluída)
- ✅ Sistema de farmácias completo
- ✅ Arquitetura escalável
- ✅ Geolocalização básica

### Fase 2: Agentes de Carteira (Próximo)
- 📋 Modelo de dados para agentes
- 📋 Formulário de cadastro específico
- 📋 Sistema de busca por operadora
- 📋 Integração com API das operadoras (opcional)

### Fase 3: Outros Serviços
- 📋 Identificação de serviços prioritários
- 📋 Implementação gradual
- 📋 Parcerias com instituições

### Fase 4: Avançado
- 📋 Mapa interativo
- 📋 Notificações push
- 📋 Sistema de pagamentos
- 📋 App móvel nativo

## Considerações Técnicas

### Geolocalização
- Usar MongoDB 2dsphere index
- Cálculo de distância no backend
- Filtro por raio de busca

### Performance
- Caching de resultados de busca
- Indexação otimizada
- Paginação de resultados

### Segurança
- Validação de campos personalizados
- Sanitização de inputs
- Rate limiting por IP

### Escalabilidade
- Arquitetura de microserviços (futuro)
- Separação de bancos de dados por serviço (opcional)
- CDN para assets estáticos

## Validação do Modelo

### Métricas de Sucesso
- Número de prestadores cadastrados
- Volume de buscas realizadas
- Taxa de conversão (busca → contato)
- Avaliação dos utilizadores
- Feedback dos prestadores

### Parcerias
- Farmácias (já iniciado)
- Operadoras de carteira móvel
- Instituições financeiras
- Governo local

## Conclusão

A arquitetura da ConectLife foi desenhada para ser modular e expansível, permitindo a adição de novos tipos de serviços sem necessidade de reescrever o código base. O sistema de farmácias serve como prova de conceito e base para a expansão para outros serviços essenciais.

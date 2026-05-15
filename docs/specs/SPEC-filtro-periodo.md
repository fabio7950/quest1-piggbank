# Spec Doc: Filtro de Período no Dashboard

## Overview

**Feature:** Permitir seleção de um intervalo de datas personalizado no dashboard financeiro do piggbank.
**Status:** Draft
**Owner:** [dev responsável]
**Created:** 2026-05-10
**Updated:** 2026-05-10

**Link PRD:** docs/PRD-filtro-periodo.md
**Link Figma:** [ainda não disponível]

## Goals

- [ ] Goal 1: Permitir que o usuário defina `data início` e `data fim` e ver métricas e transações apenas nesse intervalo.
- [ ] Goal 2: Manter compatibilidade com o dashboard atual e não alterar o comportamento padrão de últimos 30 dias.
- [ ] Goal 3: Usar os utilitários existentes em `src/lib/date.ts` e o padrão de Server Components do projeto.
- [ ] Goal 4: Garantir validação clara de intervalo inválido e apresentar estado vazio quando não há dados.

## Scope & Non-Scope

**In Scope:**

- Implementar componente `DateRangeFilter` no dashboard.
- Substituir o placeholder `Últimos 30 dias` por um controle de seleção de período.
- Filtrar as chamadas de dados em `src/lib/api.ts` com `DashboardFilters.dateRange`.
- Reutilizar tipos existentes `DateRange`, `DashboardFilters`, `MetricSummary` e `Transaction`.
- Validar e limitar intervalos usando `src/lib/date.ts`.
- Exibir estado vazio quando não houver transações no intervalo selecionado.
- Manter o comportamento padrão de `Últimos 30 dias` ao carregar a página sem filtro explícito.

**Out of Scope:**

- Alinhamento com relatórios fora do dashboard.
- Mudanças no schema de banco de dados ou backend real (o projeto usa `mockTransactions`).
- Comparação automática entre períodos ou visualizações de tendência.
- Presets de período (hoje, este mês, ano a ano) além do controle manual.
- Salvamento de filtro no perfil do usuário ou em local storage.

## Architecture Decisions

### 1. Componente `DateRangeFilter` no dashboard

**Decision:** Implementar `DateRangeFilter` como um componente cliente em `src/components/dashboard/DateRangeFilter.tsx`, usando componentes UI existentes (`src/components/ui/button.tsx`, `src/components/ui/calendar.tsx`) para seleção de datas.

**Alternatives considered:**

1. Componente cliente separado + state local — mantém Server Component na página e permite validação no cliente.
2. Input de texto simples com máscara — menos acessível e propenso a erro.
3. Filtro server-side apenas via query params em rota — excede escopo para implementação inicial.

**Rationale:**

- O dashboard atual é uma Server Component e o filtro deve ser interativo, então `DateRangeFilter` precisa ser cliente.
- Existe já suporte de UI para calendário e botões, reduzindo trabalho de implementação.
- Usar um componente cliente evita mixar lógica de estado com renderização de dados do server.

### 2. Reuso dos utilitários de data do projeto

**Decision:** Usar `getDefaultDateRange()`, `isValidDateRange()`, `exceedsMaxRange()` e `isDateInFuture()` de `src/lib/date.ts` para normalizar e validar datas.

**Alternatives considered:**

1. Criar novas funções customizadas — duplicaria lógica e violaria padrões do projeto.
2. Usar `new Date()` diretamente — não recomendado pelo CLAUDE.md.
3. Delegar toda validação ao backend — inviável para a UI do dashboard.

**Rationale:**

- Há utilitários existentes e padrões definidos em `CLAUDE.md` para manipulação de datas.
- `DATE_DISPLAY_FORMAT` e `DATE_URL_FORMAT` garantem consistência de apresentação e eventual deep-linking.
- A validação de intervalo máximo limita queries pesadas.

### 3. API contract interno com `DashboardFilters`

**Decision:** Estender `DashboardFilters` em `src/types/index.ts` e filtrar `getTransactions(filters)` e `getMetrics(filters)` internamente.

**Alternatives considered:**

1. Adicionar novo serviço de backend para filtros — fora do escopo, pois dados já são mockados.
2. Passar apenas strings de data — menos seguro em TypeScript.
3. Filtrar apenas transações na UI sem atualizar `getMetrics` — pode gerar métricas inconsistentes.

**Rationale:**

- O repo já usa `DashboardFilters` e `DateRange` como tipos centrais.
- Isso garante que métricas e tabela usem exatamente o mesmo intervalo.
- Facilita testes e futura migração para backend real.

### API Contract

```ts
// Internal contract
const filters: DashboardFilters = {
  dateRange: {
    from: Date,
    to: Date,
  },
};

// Existing functions to consume
getTransactions(filters): Promise<Transaction[]>;
getMetrics(filters): Promise<MetricSummary[]>;
```

Request:

```json
{
  "dateRange": {
    "from": "Date",
    "to": "Date"
  }
}
```

Response (200):

```json
{
  "metrics": [
    { "label": "Faturamento", "value": 0, "currency": true },
    { "label": "Despesas", "value": 0, "currency": true },
    { "label": "Lucro Líquido", "value": 0, "currency": true },
    { "label": "Transações", "value": 0, "currency": false }
  ],
  "transactions": [
    { "id": "string", "description": "string", "amount": 0, "type": "income" | "expense", "date": "Date", "category": "string" }
  ]
}
```

Errors:

- 400: intervalo inválido (`from > to`, data no futuro, intervalo maior que 12 meses)
- 422: filtro incompleto ou formato incorreto
- 500: erro interno de processamento

### Database Schema

```sql
-- Não aplicável para esta implementação inicial;
-- o projeto usa `mockTransactions` em `src/lib/api.ts`.
```

## UI/UX

**Telas afetadas:**

- Dashboard principal (`src/app/dashboard/page.tsx`)

**Componentes novos:**

- `src/components/dashboard/DateRangeFilter.tsx` — seleção de intervalo de datas

**Componentes reutilizados:**

- `src/components/ui/button.tsx`
- `src/components/ui/calendar.tsx`
- `src/components/dashboard/MetricsCard.tsx`
- `src/components/dashboard/TransactionsTable.tsx`

**Estados:**

- Loading: mantém o indicador padrão do dashboard enquanto dados são carregados.
- Empty: exibe mensagem clara quando não há transações no período selecionado.
- Error: mostra validação inline quando o intervalo é inválido ou incompleto.
- Success: atualiza métricas e tabela para o intervalo selecionado.

## Test Strategy

**Unitários:**

- [ ] `src/lib/date.ts` deve validar `DateRange` corretamente.
- [ ] `DateRangeFilter` deve bloquear `from > to` e desabilitar botão de aplicar.
- [ ] `src/lib/api.ts` deve passar filtros para `getTransactions` e `getMetrics` corretamente.
- [ ] `computeMetrics` deve continuar retornando valores corretos para dados filtrados.

**Integração:**

- [ ] Dashboard aplica filtro em `getMetrics()` e `getTransactions()` com o mesmo `dateRange`.
- [ ] A seleção de data atualiza o dashboard sem quebrar o fluxo de Server Component.
- [ ] `TransactionsTable` exibe estado vazio quando `transactions` é `[]`.

**E2E:**

- [ ] Usuário abre o dashboard, vê “Últimos 30 dias”, escolhe intervalo personalizado e observa métricas/tabela atualizados.

**Edge cases:**

- [ ] `from` posterior a `to` — validação visível e resposta de erro.
- [ ] Intervalo maior que 12 meses — mensagem de limite apresentada.
- [ ] Data futura — proibida pelo filtro.
- [ ] Intervalo sem transações — estado vazio exibido.
- [ ] `from` igual a `to` — intervalo de um dia válido.

## Delivery Checklist

**Código:**

- [ ] `src/components/dashboard/DateRangeFilter.tsx` — input de período e validação.
- [ ] `src/app/dashboard/page.tsx` — renderiza o filtro e passa `DashboardFilters` para os dados.
- [ ] `src/lib/api.ts` — aceita filtros e aplica `dateRange` a transações.
- [ ] `src/lib/date.ts` — usa utilitários existentes para defaults e validações.

**Validações (sensors):**

- [ ] Linter passa sem erros
- [ ] Build/compilação sem erros
- [ ] Scan de segurança/LGPD sem achados críticos
- [ ] Testes existentes continuam passando

**Testes novos (escritos pelo QA):**

- [ ] Validação de intervalo inválido no filtro
- [ ] Estado vazio para período sem transações
- [ ] Dashboard atualizado ao aplicar intervalo personalizado

## Rollout Plan

- [ ] Feature flag criada e desabilitada
- [ ] Deploy em staging + teste manual
- [ ] Rollout gradual: 5% → 25% → 50% → 100%
- [ ] Monitoramento ativo durante rollout
- [ ] Critério de rollback definido

## Risks & Mitigations

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Intervalos inválidos ou futuros | Média | Alto | Validar no cliente com mensagens claras e no backend interno | 
| Métricas descoordenadas entre cards e transações | Média | Alto | Usar o mesmo `DashboardFilters.dateRange` para `getMetrics` e `getTransactions` | 
| Intervalo extremo (>12 meses) | Baixa | Médio | Limitar pelo utilitário `exceedsMaxRange()` e exibir aviso | 
| Mudança de design sem validação | Média | Médio | Definir UX antes da implementação e usar componentes existentes de UI | 

## Dependencies

- [ ] Confirmação do produto sobre limites máximos/minimos de período
- [ ] Decisão de design para controle de filtro de datas
- [ ] Revisão de acessibilidade para o componente de período

## Checklist de aprovação

- [ ] Goals claros e mensuráveis
- [ ] Scope definido (in/out)
- [ ] Architecture decisions documentadas com trade-offs
- [ ] API contract definido
- [ ] Test strategy cobre caminho feliz + edge cases
- [ ] Rollout plan com feature flag
- [ ] Riscos identificados com mitigação

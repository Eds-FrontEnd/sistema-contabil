# Documentação da API Mock - Sistema Contábil

## Base URL
```
http://localhost:3000
```

## Quick Start com Postman

1. **Importe a Collection:**
   - Arquivo: `postman-collection.json`

2. **Importe o Environment:**
   - Arquivo: `postman-environment.json`
   - Selecione "Sistema Contábil - Local" no dropdown de environments

3. **Execute o Login:**
   - Request: `Autenticação > Login`
   - O token será salvo automaticamente

4. **Teste qualquer endpoint:**
   - Todos os requests usarão o token automaticamente
   - Não precisa configurar headers manualmente

---

## Autenticação

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@contabil.com",
  "password": "123456"
}
```

**Resposta de Sucesso:**
```json
{
  "token": "mock-token-12345",
  "user": {
    "id": "1",
    "nome": "Administrador",
    "email": "admin@contabil.com",
    "perfil": "CONTADOR"
  },
  "expiresIn": 3600
}
```

### Header de Autenticação
Todas as requisições (exceto login) devem incluir:
```
Authorization: Bearer mock-token-12345
```

> **Nota:** Esta é uma autenticação mock apenas para fins de desenvolvimento. O token é fixo e não expira. Em produção, implemente autenticação JWT adequada.

---

## Endpoints

### 1. Listar Lançamentos (Paginado)

```http
GET /api/lancamentos
```

**Query Parameters:**

| Parâmetro | Tipo | Obrigatório | Descrição | Exemplo |
|-----------|------|-------------|-----------|---------|
| page | number | Não | Página atual (padrão: 1) | `page=2` |
| limit | number | Não | Itens por página (padrão: 50) | `limit=100` |
| sort | string | Não | Campo de ordenação (padrão: data) | `sort=valor` |
| order | string | Não | Ordem (asc/desc, padrão: desc) | `order=asc` |
| search | string | Não | Busca no histórico e documento | `search=fornecedor` |
| tipo | string | Não | DEBITO, CREDITO ou TODOS | `tipo=DEBITO` |
| status | string | Não | PROVISORIO, CONFIRMADO, CANCELADO ou TODOS | `status=CONFIRMADO` |
| contaCodigo | string | Não | Código da conta contábil | `contaCodigo=1.1.01.001` |
| dataInicio | string | Não | Data inicial (YYYY-MM-DD) | `dataInicio=2025-01-01` |
| dataFim | string | Não | Data final (YYYY-MM-DD) | `dataFim=2025-12-31` |

**Exemplo:**
```http
GET /api/lancamentos?page=1&limit=50&tipo=DEBITO&status=CONFIRMADO&sort=data&order=desc
```

**Resposta:**
```json
{
  "data": [
    {
      "id": "000001",
      "data": "2026-01-15",
      "tipo": "DEBITO",
      "contaContabil": {
        "codigo": "1.1.01.001",
        "descricao": "Caixa Geral"
      },
      "valor": 1500.00,
      "historico": "Pagamento de fornecedor via transferência bancária",
      "documento": "NF-123456",
      "status": "CONFIRMADO",
      "criadoEm": "2026-01-15T14:30:00.000Z",
      "atualizadoEm": "2026-01-15T14:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 5000,
    "page": 1,
    "limit": 50,
    "totalPages": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 2. Obter Lançamento por ID

```http
GET /api/lancamentos/:id
```

**Exemplo:**
```http
GET /api/lancamentos/000001
```

**Resposta:**
```json
{
  "id": "000001",
  "data": "2026-01-15",
  "tipo": "DEBITO",
  "contaContabil": {
    "codigo": "1.1.01.001",
    "descricao": "Caixa Geral"
  },
  "valor": 1500.00,
  "historico": "Pagamento de fornecedor via transferência bancária",
  "documento": "NF-123456",
  "status": "CONFIRMADO",
  "criadoEm": "2026-01-15T14:30:00.000Z",
  "atualizadoEm": "2026-01-15T14:30:00.000Z"
}
```

---

### 3. Criar Lançamento

```http
POST /api/lancamentos
Content-Type: application/json
```

**Body:**
```json
{
  "data": "2026-01-28",
  "tipo": "DEBITO",
  "contaContabil": {
    "codigo": "5.1.03.001",
    "descricao": "Despesas com Aluguel"
  },
  "valor": 3500.00,
  "historico": "Pagamento de aluguel do mês 01/2026",
  "documento": "REC-789012",
  "status": "PROVISORIO"
}
```

**Validações:**
- `data`: obrigatório, não pode ser futura
- `tipo`: obrigatório, DEBITO ou CREDITO
- `contaContabil.codigo`: obrigatório, deve existir
- `valor`: obrigatório, maior que 0
- `historico`: obrigatório, mínimo 5 caracteres
- `status`: obrigatório

**Resposta:**
```json
{
  "id": "005001",
  "data": "2026-01-28",
  "tipo": "DEBITO",
  "contaContabil": {
    "codigo": "5.1.03.001",
    "descricao": "Despesas com Aluguel"
  },
  "valor": 3500.00,
  "historico": "Pagamento de aluguel do mês 01/2026",
  "documento": "REC-789012",
  "status": "PROVISORIO",
  "criadoEm": "2026-01-28T10:00:00.000Z",
  "atualizadoEm": "2026-01-28T10:00:00.000Z"
}
```

---

### 4. Atualizar Lançamento

```http
PUT /api/lancamentos/:id
Content-Type: application/json
```

**Body:**
```json
{
  "data": "2026-01-28",
  "tipo": "DEBITO",
  "contaContabil": {
    "codigo": "5.1.03.001",
    "descricao": "Despesas com Aluguel"
  },
  "valor": 3500.00,
  "historico": "Pagamento de aluguel do mês 01/2026 - Atualizado",
  "documento": "REC-789012",
  "status": "CONFIRMADO"
}
```

**Resposta:**
```json
{
  "id": "005001",
  "data": "2026-01-28",
  "tipo": "DEBITO",
  "contaContabil": {
    "codigo": "5.1.03.001",
    "descricao": "Despesas com Aluguel"
  },
  "valor": 3500.00,
  "historico": "Pagamento de aluguel do mês 01/2026 - Atualizado",
  "documento": "REC-789012",
  "status": "CONFIRMADO",
  "criadoEm": "2026-01-28T10:00:00.000Z",
  "atualizadoEm": "2026-01-28T11:30:00.000Z"
}
```

---

### 5. Excluir Lançamento

```http
DELETE /api/lancamentos/:id
```

**Exemplo:**
```http
DELETE /api/lancamentos/005001
```

**Resposta:**
```json
{}
```

Status: `200 OK`

---

### 6. Obter Balancete

```http
GET /api/lancamentos/balancete
```

**Query Parameters:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| dataInicio | string | Não | Data inicial (YYYY-MM-DD) |
| dataFim | string | Não | Data final (YYYY-MM-DD) |
| status | string | Não | Filtrar por status |

**Exemplo:**
```http
GET /api/lancamentos/balancete?dataInicio=2026-01-01&dataFim=2026-01-31
```

**Resposta:**
```json
{
  "totalDebitos": 125430.50,
  "totalCreditos": 187250.00,
  "saldo": 61819.50,
  "quantidade": 342,
  "periodo": {
    "inicio": "2026-01-01",
    "fim": "2026-01-31"
  }
}
```

---

### 7. Listar Contas Contábeis

```http
GET /api/contas
```

**Resposta:**
```json
[
  {
    "id": "1",
    "codigo": "1.1.01.001",
    "descricao": "Caixa Geral",
    "tipo": "ATIVO"
  },
  {
    "id": "2",
    "codigo": "1.1.01.002",
    "descricao": "Banco Bradesco CC 12345-6",
    "tipo": "ATIVO"
  }
]
```

---

## Modelos de Dados

### Lancamento
```typescript
interface Lancamento {
  id: string;
  data: string; // ISO date (YYYY-MM-DD)
  tipo: 'DEBITO' | 'CREDITO';
  contaContabil: {
    codigo: string;
    descricao: string;
  };
  valor: number;
  historico: string;
  documento?: string;
  status: 'PROVISORIO' | 'CONFIRMADO' | 'CANCELADO';
  criadoEm: string; // ISO datetime
  atualizadoEm: string; // ISO datetime
}
```

### Conta Contábil
```typescript
interface ContaContabil {
  id: string;
  codigo: string;
  descricao: string;
  tipo: 'ATIVO' | 'PASSIVO' | 'PATRIMONIO_LIQUIDO' | 'RECEITA' | 'DESPESA';
}
```

### Balancete
```typescript
interface Balancete {
  totalDebitos: number;
  totalCreditos: number;
  saldo: number;
  quantidade: number;
  periodo: {
    inicio: string;
    fim: string;
  };
}
```

---

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 404 | Não encontrado |
| 500 | Erro interno do servidor |

---

## Tratamento de Erros

**Formato padrão de erro:**
```json
{
  "error": "Tipo do erro",
  "message": "Descrição detalhada do erro",
  "details": {
    "field": "campo específico com erro"
  }
}
```

**Exemplos:**

**401 Unauthorized:**
```json
{
  "error": "Token de autenticação não fornecido",
  "message": "Use o header: Authorization: Bearer mock-token-12345"
}
```

**404 Not Found:**
```json
{
  "error": "Not Found",
  "message": "Lançamento não encontrado"
}
```

---

## Notas de Implementação

1. **Latência Simulada:** A API adiciona um delay de 100-600ms para simular condições reais de rede.

2. **Autenticação Mock:** O token `mock-token-12345` é válido indefinidamente. Em produção, implementar validação JWT adequada.

3. **Paginação:** O servidor retorna no máximo 50 itens por página por padrão. Ajuste via parâmetro `limit`.

4. **Filtros:** Todos os filtros são opcionais e podem ser combinados.

5. **Ordenação:** Campos ordenáveis: `data`, `valor`, `status`, `tipo`.

6. **Busca:** A busca é case-insensitive e procura nos campos `historico` e `documento`.

7. **Dataset:** A base contém 5.000 lançamentos distribuídos nos últimos 2 anos.

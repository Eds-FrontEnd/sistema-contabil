# ⚡ Projeto – Sistema Contábil
## 🚀 Visão Geral

 **Aplicação Angular moderna, intuitiva, responsiva e escalável**, 
 focada na experiência do contador e na qualidade do código.

---

## ✅ Solução Implementada

Aplicação **SPA (Single Page Application)** desenvolvida em **Angular 20**, utilizando **Angular Material**, com foco em:

- Usabilidade  
- Performance  
- Acessibilidade  
- Manutenibilidade  
- Boas práticas de Clean Code  

---

## 🧩 Funcionalidades Principais

### 📊 Dashboard de Lançamentos

#### Cards de Resumo (Balancete)

- Total de Débitos  
- Total de Créditos  
- Saldo (Créditos - Débitos)  
- Quantidade total de lançamentos  

#### Lista de Lançamentos

- Tabela responsiva com colunas:
  - Data  
  - Tipo (Débito / Crédito)  
  - Conta  
  - Valor  
  - Status  
- Paginação eficiente (50 itens por página)  
- Indicadores visuais:
  - Cores para débito/crédito  
  - Badges de status (provisório, confirmado, cancelado)  
- Ordenação por colunas  

#### Filtros Avançados

- Busca por texto (histórico ou documento)  
- Filtro por tipo (todos/débito/crédito)  
- Filtro por status  
- Filtro por período (data inicial/final)  

#### Campos

- Com Validators

#### Validações Visuais

- Indicadores de campos obrigatórios  
- Mensagens de erro por campo  
- Toast de sucesso ou erro após operações  

---

## 🧠 Arquitetura e Boas Práticas

- Separação clara de responsabilidades:
  - Lógica de negócio em **Services**  
  - Renderização em **Components**  
- Componentes pequenos e reutilizáveis  
- Tipagem forte com TypeScript (evitando `any`)  
- Uso de **constantes**  
- Código limpo e nomenclatura descritiva  
- HTML semântico com foco em acessibilidade  
- Navegação SPA com **Lazy Loading**  

---

## 🧪 Testes Unitários

O projeto conta com testes unitários utilizando **Jasmine**, focados em componentes reutilizáveis e de UI.

### Execução de Testes Específicos

```bash
ng test --include=**/button.component.spec.ts
ng test --include=**/date-picker.component.spec.ts 
ng test --include=**/summary-card.component.spec.ts
ng test --include=**/status-badge.component.spec.ts
```

## Rodar API ##

- Instale o pacote de dependências com o comando:

```bash
npm install
````
- E rode com o comando:

```bash
npm start
````
## Rodar FRONT ##

- Instale o pacote de dependências com o comando:

```bash
npm install
````
- E rode com o comando:

```bash
ng serve
````

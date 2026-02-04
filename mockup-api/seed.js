const fs = require('fs');

// Contas Contábeis (Plano de Contas Simplificado)
const contas = [
  // ATIVO
  { codigo: '1.1.01.001', descricao: 'Caixa Geral', tipo: 'ATIVO' },
  { codigo: '1.1.02.001', descricao: 'Clientes a Receber', tipo: 'ATIVO' },
  { codigo: '1.1.02.002', descricao: 'Duplicatas a Receber', tipo: 'ATIVO' },
  { codigo: '1.1.03.001', descricao: 'Estoque de Mercadorias', tipo: 'ATIVO' },
  { codigo: '1.1.04.001', descricao: 'Aplicações Financeiras', tipo: 'ATIVO' },
  { codigo: '1.2.01.001', descricao: 'Veículos', tipo: 'ATIVO' },
  { codigo: '1.2.01.002', descricao: 'Móveis e Utensílios', tipo: 'ATIVO' },
  { codigo: '1.2.01.003', descricao: 'Equipamentos de Informática', tipo: 'ATIVO' },
  
  // PASSIVO
  { codigo: '2.1.01.001', descricao: 'Fornecedores a Pagar', tipo: 'PASSIVO' },
  { codigo: '2.1.01.002', descricao: 'Salários a Pagar', tipo: 'PASSIVO' },
  { codigo: '2.1.01.003', descricao: 'Encargos Sociais a Recolher', tipo: 'PASSIVO' },
  { codigo: '2.1.02.001', descricao: 'Impostos a Recolher', tipo: 'PASSIVO' },
  { codigo: '2.1.02.002', descricao: 'ICMS a Recolher', tipo: 'PASSIVO' },
  { codigo: '2.1.02.003', descricao: 'COFINS a Recolher', tipo: 'PASSIVO' },
  { codigo: '2.1.03.001', descricao: 'Empréstimos Bancários', tipo: 'PASSIVO' },
  { codigo: '2.1.04.001', descricao: 'Financiamentos', tipo: 'PASSIVO' },
  
  // PATRIMÔNIO LÍQUIDO
  { codigo: '3.1.01.001', descricao: 'Capital Social', tipo: 'PATRIMONIO_LIQUIDO' },
  { codigo: '3.2.01.001', descricao: 'Lucros Acumulados', tipo: 'PATRIMONIO_LIQUIDO' },
  { codigo: '3.2.02.001', descricao: 'Prejuízos Acumulados', tipo: 'PATRIMONIO_LIQUIDO' },
  
  // RECEITAS
  { codigo: '4.1.01.001', descricao: 'Receita de Vendas', tipo: 'RECEITA' },
  { codigo: '4.1.01.002', descricao: 'Receita de Serviços', tipo: 'RECEITA' },
  { codigo: '4.1.02.001', descricao: 'Receitas Financeiras', tipo: 'RECEITA' },
  { codigo: '4.1.03.001', descricao: 'Outras Receitas', tipo: 'RECEITA' },
  
  // DESPESAS
  { codigo: '5.1.01.001', descricao: 'Custo das Mercadorias Vendidas', tipo: 'DESPESA' },
  { codigo: '5.1.02.001', descricao: 'Despesas com Salários', tipo: 'DESPESA' },
  { codigo: '5.1.02.002', descricao: 'Despesas com Encargos Sociais', tipo: 'DESPESA' },
  { codigo: '5.1.03.001', descricao: 'Despesas com Aluguel', tipo: 'DESPESA' },
  { codigo: '5.1.03.002', descricao: 'Despesas com Energia Elétrica', tipo: 'DESPESA' },
  { codigo: '5.1.03.003', descricao: 'Despesas com Telefonia', tipo: 'DESPESA' },
  { codigo: '5.1.03.004', descricao: 'Despesas com Internet', tipo: 'DESPESA' },
  { codigo: '5.1.04.001', descricao: 'Despesas Financeiras', tipo: 'DESPESA' },
  { codigo: '5.1.05.001', descricao: 'Despesas com Material de Escritório', tipo: 'DESPESA' },
  { codigo: '5.1.06.001', descricao: 'Impostos e Taxas', tipo: 'DESPESA' },
];

// Históricos comuns
const historicos = [
  'Pagamento de fornecedor via transferência bancária',
  'Recebimento de cliente - Nota Fiscal',
  'Pagamento de salário mensal',
  'Recolhimento de impostos federais',
  'Compra de mercadorias para estoque',
  'Venda de mercadorias à vista',
  'Venda de mercadorias a prazo',
  'Pagamento de aluguel mensal',
  'Pagamento de conta de energia elétrica',
  'Recebimento de aplicação financeira',
  'Pagamento de encargos sociais',
  'Transferência entre contas bancárias',
  'Compra de equipamento de informática',
  'Pagamento de serviços de terceiros',
  'Recebimento de duplicata',
  'Pagamento de empréstimo bancário',
  'Depósito inicial de capital social',
  'Despesas com material de escritório',
  'Receita de prestação de serviços',
  'Pagamento de despesas financeiras',
];

// Função para gerar data aleatória nos últimos 2 anos
function randomDate() {
  const end = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - 2);
  
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

// Função para gerar valor aleatório
function randomValue(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// Função para gerar documento
function randomDocument() {
  const types = ['NF', 'REC', 'DOC', 'FAT', 'BOL'];
  const type = types[Math.floor(Math.random() * types.length)];
  const number = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
  return `${type}-${number}`;
}

// Gerar lançamentos
function generateLancamentos() {
  const lancamentos = [];
  const totalLancamentos = 5000;
  
  for (let i = 0; i < totalLancamentos; i++) {
    const tipo = Math.random() > 0.5 ? 'DEBITO' : 'CREDITO';
    const statusOptions = ['PROVISORIO', 'CONFIRMADO', 'CANCELADO'];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    // Pesos: 10% provisório, 85% confirmado, 5% cancelado
    let selectedStatus;
    const rand = Math.random();
    if (rand < 0.85) {
      selectedStatus = 'CONFIRMADO';
    } else if (rand < 0.95) {
      selectedStatus = 'PROVISORIO';
    } else {
      selectedStatus = 'CANCELADO';
    }
    
    const conta = contas[Math.floor(Math.random() * contas.length)];
    const historico = historicos[Math.floor(Math.random() * historicos.length)];
    const data = randomDate();
    const documento = Math.random() > 0.3 ? randomDocument() : null;
    
    const lancamento = {
      id: String(i + 1).padStart(6, '0'),
      data,
      tipo,
      contaContabil: {
        codigo: conta.codigo,
        descricao: conta.descricao
      },
      valor: randomValue(50, 50000),
      historico,
      documento,
      status: selectedStatus,
      criadoEm: new Date(data).toISOString(),
      atualizadoEm: new Date(data).toISOString()
    };
    
    lancamentos.push(lancamento);
  }
  
  // Ordenar por data (mais recente primeiro)
  lancamentos.sort((a, b) => new Date(b.data) - new Date(a.data));
  
  return lancamentos;
}

// Gerar base de dados
const db = {
  lancamentos: generateLancamentos(),
  contas: contas.map((c, i) => ({ ...c, id: String(i + 1) }))
};

// Salvar em arquivo
fs.writeFileSync('db.json', JSON.stringify(db, null, 2));

console.log('Base de dados gerada com sucesso!');
console.log(`${db.lancamentos.length} lançamentos criados`);
console.log(`${db.contas.length} contas contábeis disponíveis`);
console.log('Arquivo: db.json');

export interface Transaction {
  id: number;
  data: Date;
  tipo: string;
  conta: string;
  valor: number;
  contaContabil?: ContaContabil;
  status: 'confirmado' | 'cancelado' | 'provisorio';
}

interface ContaContabil {
  numero: string;
  descricao: string;
}

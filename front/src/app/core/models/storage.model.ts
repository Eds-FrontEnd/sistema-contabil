interface StoredTransaction {
  id: number;
  data: string;
  tipo: string;
  conta: string;
  valor: number;
  status: 'confirmado' | 'cancelado' | 'provisorio';
}

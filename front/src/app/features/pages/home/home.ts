import { AfterViewInit, Component } from '@angular/core';

import { ApiService } from '../../../core/services/api.service';

import { Transaction } from '../../../core/models/transaction.model';

import { HeaderComponent } from "../../../shared/components/header/header.component";
import { TableTransactionsComponent } from "../../../shared/components/table/table-transactions.component";
import { BalanceComponent } from '../../../shared/components/balance/balance.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [HeaderComponent, TableTransactionsComponent, BalanceComponent]
})
export class Home implements AfterViewInit {
  transactions: Transaction[] = [];

  constructor(private apiService: ApiService) {}

  ngAfterViewInit(): void {
    this.carregarLancamentos();
  }

  private carregarLancamentos(): void {
    this.apiService.getTransactions().subscribe({
      next: (response) => {
        this.transactions = response.data.map((item) => ({
          id: Number(item.id),
          data: new Date(item.data),
          tipo: item.tipo,
          conta: item.contaContabil?.descricao || '',
          valor: item.valor,
          status: this.mapStatus(item.status),
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar lançamentos', err);
      },
    });
  }

  private mapStatus(status: string): 'confirmado' | 'cancelado' | 'provisorio' {
    switch (status) {
      case 'CONFIRMADO':
        return 'confirmado';
      case 'CANCELADO':
        return 'cancelado';
      default:
        return 'provisorio';
    }
  }
}

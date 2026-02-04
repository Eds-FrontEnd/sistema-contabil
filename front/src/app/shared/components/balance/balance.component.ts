import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

import { API_ENDPOINTS } from '../../../core/services/api-endpoints';
import { Transaction } from '../../../core/models/transaction.model';

import { SummaryCardComponent } from '../card/summary-card.component';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [SummaryCardComponent],
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent implements OnInit {

  totalDebitos = signal(0);
  totalCreditos = signal(0);
  saldo = signal(0);
  quantidade = signal(0);

  userForm: FormGroup;

  minhasTransacoes: Transaction[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      birthDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.carregarLancamentos();
    this.carregarBalancete();
  }

  private carregarLancamentos(): void {
    const url = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TRANSACTIONS}`;

    this.apiService.getTransactions().subscribe({
      next: (response) => {
        this.minhasTransacoes = response.data.map((item) => ({
          id: Number(item.id),
          data: new Date(item.data),
          tipo: item.tipo,
          conta: item.contaContabil?.descricao ?? 'Descrição não disponível',
          valor: item.valor,
          status: this.formatStatus(item.status),
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar lançamentos', err);
      },
    });
  }

  private carregarBalancete(): void {
    this.apiService.getBalancete().subscribe({
      next: (response) => {
        this.totalDebitos.set(response.totalDebitos);
        this.totalCreditos.set(response.totalCreditos);
        this.saldo.set(this.totalCreditos() - this.totalDebitos());
        this.quantidade.set(response.quantidade);
      },
      error: (err) => {
        console.error('Erro ao carregar balancete', err);
      },
    });
  }

  private formatStatus(status: string): 'provisorio' | 'confirmado' | 'cancelado' {
    switch (status.toUpperCase()) {
      case 'CONFIRMADO':
        return 'confirmado';
      case 'CANCELADO':
        return 'cancelado';
      case 'PROVISORIO':
        return 'provisorio';
      default:
        return 'provisorio';
    }
  }

  submit(): void {
    if (this.userForm.valid) {
      console.log('Formulário enviado:', this.userForm.value);
    } else {
      console.log('Formulário inválido');
      this.userForm.markAllAsTouched();
    }
  }
}

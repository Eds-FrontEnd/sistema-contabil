import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';

const STORAGE_KEY = 'transactions';
const AUTH_TOKEN_KEY = 'auth_token';

// Interface para os dados salvos no localStorage
interface StoredTransaction {
  id: number;
  data: string;  // A data será salva como string (formato ISO)
  tipo: string;
  conta: string;
  valor: number;
  status: 'confirmado' | 'cancelado' | 'provisorio';  // Mesma tipagem de status que a interface Transaction
}

@Injectable({ providedIn: 'root' })
export class TransactionStorageService {
  private transactions: Transaction[] = [];

  constructor() {
    this.loadFromStorage();
  }

  init(mockData: Transaction[] = []): Transaction[] {
    if (this.transactions.length === 0 && mockData.length) {
      this.transactions = mockData.map(tx => ({ ...tx }));
      this.saveToStorage();
    }
    return [...this.transactions];
  }

  getAll(): Transaction[] {
    return [...this.transactions];
  }

  private saveToStorage(): void {
    const toStore: StoredTransaction[] = this.transactions.map(tx => ({
      id: tx.id,
      data: tx.data.toISOString(),  // Converter a data para string (ISO 8601)
      tipo: tx.tipo,
      conta: tx.conta,
      valor: tx.valor,
      status: tx.status,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }

  private loadFromStorage(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.transactions = [];
      return;
    }

    try {
      const parsed: StoredTransaction[] = JSON.parse(raw);
      this.transactions = parsed.map(
        tx =>
          ({
            id: tx.id,
            data: new Date(tx.data),  // Converter a string de volta para um objeto Date
            tipo: tx.tipo,
            conta: tx.conta,
            valor: tx.valor,
            status: tx.status,
          } as Transaction)
      );
    } catch {
      console.error('Erro ao carregar transactions do localStorage');
      this.transactions = [];
    }
  }

  add(transaction: Transaction): void {
    this.transactions.push({ ...transaction });
    this.saveToStorage();
  }

  remove(id: number): void {
    const index = this.transactions.findIndex(tx => tx.id === id);
    if (index > -1) {
      this.transactions.splice(index, 1);
      this.saveToStorage();
    }
  }

  update(transaction: Transaction): void {
    const index = this.transactions.findIndex(tx => tx.id === transaction.id);
    if (index > -1) {
      this.transactions[index] = { ...transaction };
      this.saveToStorage();
    }
  }

  setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

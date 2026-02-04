import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response.model';
import { API_ENDPOINTS } from './api-endpoints';
import { ApiResponse } from '../models/api-response.model';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getTransactions(
    page = 100,
    limit = 5000,
    search?: string,
    tipo?: string,
    status?: string
  ): Observable<PaginatedResponse<Transaction>> {

    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };

    if (search) params['search'] = search;
    if (tipo) params['tipo'] = tipo;
    if (status) params['status'] = status;

    return this.http.get<PaginatedResponse<Transaction>>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.TRANSACTIONS}`,
      { params }
    );
  }

  getBalancete(
    dataInicio?: string,
    dataFim?: string,
    status?: string
  ): Observable<{
    totalDebitos: number;
    totalCreditos: number;
    saldo: number;
    quantidade: number;
  }> {

    const params: Record<string, string> = {};

    if (dataInicio) params['dataInicio'] = dataInicio;
    if (dataFim) params['dataFim'] = dataFim;
    if (status) params['status'] = status;

    return this.http.get<{
      totalDebitos: number;
      totalCreditos: number;
      saldo: number;
      quantidade: number;
    }>(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.BALANCETE}`, { params });
  }

  getAccounts(): Observable<ApiResponse<{ id: number; descricao: string }[]>> {

    return this.http.get<ApiResponse<{ id: number; descricao: string }[]>>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS}`
    );
  }
}

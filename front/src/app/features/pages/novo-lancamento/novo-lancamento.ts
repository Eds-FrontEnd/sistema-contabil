import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PaginatedResponse } from '../../../core/models/paginated-response.model'; // Importando o modelo PaginatedResponse
import { ApiService } from '../../../core/services/api.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { DatePickerComponent } from '../../../shared/components/datepicker/date-picker.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { Transaction } from './../../../core/models/transaction.model';

@Component({
  selector: 'app-novo-lancamento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    DatePickerComponent,
    ButtonComponent,
  ],
  templateUrl: './novo-lancamento.html',
  styleUrls: ['./novo-lancamento.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NovoLancamento implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);

  readonly submitting = signal(false);

  readonly contasContabeis = signal<string[]>([]);

  readonly contaFiltro = new FormControl('');  // Filtro de conta contábil

  readonly form = this.fb.nonNullable.group({
    dataLancamento: ['', Validators.required],
    tipo: ['debito', Validators.required],
    dataCompetencia: ['', Validators.required],
    contaDebito: ['', Validators.required],
    contaCredito: ['', Validators.required],
    valor: [0, [Validators.required, Validators.min(0.01)]],
    historico: ['', Validators.required],
    documento: ['', Validators.required],
    status: ['', Validators.required],
  });

  constructor() {
    this.configurarBuscaApi();
  }

  ngOnInit(): void {
    // Aqui vamos disparar a busca inicial logo no ngOnInit
    this.contaFiltro.setValue(''); // Disparar a requisição com o valor inicial vazio
  }

  private configurarBuscaApi(): void {
    this.contaFiltro.valueChanges
      .pipe(
        startWith(''),  // Isso garante que ao inicializar o componente a busca seja feita
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((termo: string | null) => {
          console.log('Buscando com termo: ', termo); // Log para checar o termo

          // Se o termo for muito curto ou vazio, retorna uma lista vazia
          if (!termo || termo.length < 2) {
            console.log('Termo muito curto ou vazio, retornando lista vazia');
            return of([]);
          }

          return this.apiService.getTransactions(1, 50, termo).pipe(
            map((response: PaginatedResponse<Transaction>) => {
              console.log('Resposta da API:', response);

              return response.data
                .map((item) => item.contaContabil?.descricao) // Mapeando as contas contábeis
                .filter((descricao): descricao is string => descricao !== null); // Filtrando os valores nulos
            })
          );
        })
      )
      .subscribe({
        next: (contas) => {
          console.log('Contas encontradas: ', contas);
          this.contasContabeis.set(contas); // Atualizando a lista de contas contábeis
        },
        error: (err) => {
          console.error('Erro ao buscar contas contábeis', err); // Tratamento de erro
        }
      });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formData = this.form.getRawValue();

    if (typeof formData.valor === 'string') {
      formData.valor = parseFloat(formData.valor);
    }

    if (isNaN(formData.valor)) {
      console.error('Valor inválido');
      this.submitting.set(false);
      return;
    }

    console.log(formData);
    setTimeout(() => this.submitting.set(false), 800);
  }

  cancelar(): void {
    this.form.reset();
    this.contaFiltro.reset();
  }
}

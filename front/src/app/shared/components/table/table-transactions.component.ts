import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';

import { ModalData } from '../../../core/models/modal-data.model';
import { Transaction } from '../../../core/models/transaction.model';
import { TransactionStorageService } from '../../../core/services/transaction-storage.service';
import { StatusBadgeComponent } from '../badge/status-badge.component';
import { FilterComponent } from '../filter/filter.component';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';

registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-table-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    StatusBadgeComponent,
    FilterComponent,
    ButtonComponent
  ],
  templateUrl: './table-transactions.component.html',
  styleUrls: ['./table-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTransactionsComponent implements AfterViewInit {
  displayedColumns = ['data', 'tipo', 'conta', 'valor', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Transaction>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _transactions: Transaction[] = [];
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private storage = inject(TransactionStorageService);

  private currentFilter: {
    searchText: string;
    typeFilter: 'todos' | 'credito' | 'debito';
    startDate: Date | null;
    endDate: Date | null;
  } = { searchText: '', typeFilter: 'todos', startDate: null, endDate: null };

  @Input()
  set transactions(value: Transaction[]) {
    this._transactions = this.storage.init(value ?? []);
    this.dataSource.data = [...this._transactions];
    if (this.paginator) this.dataSource.paginator = this.paginator;
    this.setFilterPredicate();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private setFilterPredicate(): void {
    this.dataSource.filterPredicate = (tx: Transaction, filter: string) => {
      const f = JSON.parse(filter);

      if (f.typeFilter !== 'todos' && tx.tipo.toLowerCase() !== f.typeFilter.toLowerCase()) {
        return false;
      }

      if (f.searchText && !tx.conta.toLowerCase().includes(f.searchText.toLowerCase())) {
        return false;
      }

      const txDate = new Date(tx.data);
      if (f.startDate && txDate < new Date(f.startDate)) {
        return false;
      }

      if (f.endDate && txDate > new Date(f.endDate)) {
        return false;
      }

      return true;
    };
  }

  applyFilter(event: {
    searchText: string;
    typeFilter: 'todos' | 'credito' | 'debito';
    startDate: Date | null;
    endDate: Date | null;
  }): void {
    this.currentFilter = event;
    this.dataSource.filter = JSON.stringify(event);

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  onEdit(transaction: Transaction): void {
    this.dialog.open(ModalComponent, {
      width: '400px',
      data: { title: 'Editar Transação', transaction } as ModalData,
      panelClass: ['custom-dialog'],
    });
  }

  async onDelete(transaction: Transaction): Promise<void> {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza de que deseja excluir a transação de ${transaction.conta}?`,
        confirmButtonText: 'Ok, Excluir',
        cancelButtonText: 'Cancelar',
        isConfirm: true,
      } as ModalData,
    });

    const confirmed = await firstValueFrom(dialogRef.afterClosed());
    if (!confirmed) return;

    this.storage.remove(transaction.id);

    const index = this.dataSource.data.findIndex((tx) => tx.id === transaction.id);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
    }

    this._transactions = [...this.dataSource.data];

    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      if (startIndex >= this._transactions.length && this.paginator.pageIndex > 0) {
        this.paginator.previousPage();
      }
    }

    this.snackBar.open('Transação excluída com sucesso!', 'X', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['custom-snack-bar'],
    });
  }

  trackById(_: number, item: Transaction): number {
    return item.id;
  }

  addTransaction(transaction: Transaction): void {
    this.storage.add(transaction);
    this._transactions.push({ ...transaction });
    this.dataSource.data = [...this._transactions];
  }

  updateTransaction(transaction: Transaction): void {
    this.storage.update(transaction);
    const index = this._transactions.findIndex((tx) => tx.id === transaction.id);
    if (index > -1) {
      this._transactions[index] = { ...transaction };
      this.dataSource.data = [...this._transactions];
    }
  }
}

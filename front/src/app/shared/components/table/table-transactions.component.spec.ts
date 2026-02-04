import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableTransactionsComponent } from './table-transactions.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Transaction } from '../../../core/models/transaction.model';

describe('TableTransactionsComponent', () => {
  let component: TableTransactionsComponent;
  let fixture: ComponentFixture<TableTransactionsComponent>;

  const mockTransactions: Transaction[] = [
    { id: 1, data: new Date('2026-01-01'), tipo: 'Débito', conta: 'Conta A', valor: 100, status: 'confirmado' },
    { id: 2, data: new Date('2026-01-02'), tipo: 'Crédito', conta: 'Conta B', valor: 200, status: 'cancelado' },
    { id: 3, data: new Date('2026-01-03'), tipo: 'Débito', conta: 'Conta C', valor: 300, status: 'provisorio' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableTransactionsComponent,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatButtonModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableTransactionsComponent);
    component = fixture.componentInstance;

    component.transactions = mockTransactions;

    fixture.detectChanges();
    await fixture.isStable();

    if (component.paginator) {
      component.dataSource.paginator = component.paginator;
      component.dataSource._updateChangeSubscription();
    }
    fixture.detectChanges();
    await fixture.isStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});

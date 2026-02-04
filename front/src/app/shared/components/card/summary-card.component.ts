import { Component, Input, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  providers: [CurrencyPipe, DecimalPipe],
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryCardComponent {
  private _value = signal<number>(0);
  private _isCurrency = signal<boolean>(true);

  @Input({ required: true }) title!: string;
  @Input({ required: true }) icon!: string;
  @Input() iconColor: string = '#000';
  @Input() iconAriaLabel: string = 'Ícone do cartão';

  @Input()
  set value(v: number) {
    this._value.set(v);
  }
  get value(): number {
    return this._value();
  }

  @Input()
  set isCurrency(v: boolean) {
    this._isCurrency.set(v);
  }
  get isCurrency(): boolean {
    return this._isCurrency();
  }

  constructor(
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe
  ) {}

  get formattedValue(): string {
    if (this.isCurrency) {
      return this.currencyPipe.transform(this.value, 'BRL', 'symbol', '1.2-2', 'pt-BR') || '';
    } else {
      return this.decimalPipe.transform(this.value, '1.0-0', 'pt-BR') || '';
    }
  }
}

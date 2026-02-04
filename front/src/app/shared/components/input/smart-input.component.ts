import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-smart-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './smart-input.component.html',
  styleUrls: ['./smart-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartInputComponent {
  @Input() control!: FormControl;
  @Input() placeholder!: string;
  @Input() clearIcon: string = 'close';
  @Input() errorMessage: string = 'Campo inválido';
  @Input() type: string = 'text';
  @Input() currencyMask: boolean = false;

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  clear(): void {
    this.control.reset();
    this.valueChange.emit(this.control.value);
  }

  private formatCurrency(value: string): string {
    if (!value) return '';
    const onlyNumbers = value.replace(/\D/g, '');
    const numberValue = (Number(onlyNumbers) / 100).toFixed(2);
    const parts = numberValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${parts[0]},${parts[1]}`;
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    if (!this.currencyMask) return;
    const input = event.target as HTMLInputElement;
    const formatted = this.formatCurrency(input.value);
    input.value = formatted;
    this.control.setValue(formatted, { emitEvent: false });
    this.valueChange.emit(this.control.value);
  }
}

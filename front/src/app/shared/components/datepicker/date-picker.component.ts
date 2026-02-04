import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {
  @Input() title: string = '';
  @Input() placeholder: string = 'dd/mm/aaaa';
  @Output() dateChange = new EventEmitter<Date | null>();

  dateControl!: FormControl<string>;
  minDate!: string;
  maxDate!: string;

  inputId!: string;

  ngOnInit(): void {
    this.minDate = '1970-01-01';
    this.maxDate = new Date().toISOString().split('T')[0];

    this.inputId = this.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    this.dateControl = new FormControl<string>('', {
      validators: [
        Validators.required,
        this.dateValidator.bind(this)
      ],
      nonNullable: true
    });

    this.dateControl.valueChanges.subscribe(value => {
      if (this.dateControl.valid) {
        this.dateChange.emit(new Date(value));
      } else {
        this.dateChange.emit(null);
      }
    });
  }

  private dateValidator(control: AbstractControl<string>): ValidationErrors | null {
    if (!control.value) return null;

    const valueDate = new Date(control.value);
    const min = new Date(this.minDate);
    const max = new Date(this.maxDate);

    if (valueDate < min || valueDate > max) {
      return { outOfRange: true };
    }

    return null;
  }
}

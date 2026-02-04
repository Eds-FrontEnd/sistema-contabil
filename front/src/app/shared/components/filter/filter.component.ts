import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";

import { DatePickerComponent } from '../datepicker/date-picker.component';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerComponent, MatButtonModule, MatIcon, ButtonComponent],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {

  searchText: string = '';
  typeFilter: 'todos' | 'credito' | 'debito' = 'todos';
  startDate: Date | null = null;
  endDate: Date | null = null;
  isFilterVisible: boolean = false;

  @Output() filterChanged = new EventEmitter<{
    searchText: string;
    typeFilter: 'todos' | 'credito' | 'debito';
    startDate: Date | null;
    endDate: Date | null;
  }>();

  private emitFilter(): void {

    if (this.startDate && this.endDate && this.endDate < this.startDate) {
      alert('A data final não pode ser menor que a data inicial.');
      return;
    }

    this.filterChanged.emit({
      searchText: this.searchText.trim().toLowerCase(),
      typeFilter: this.typeFilter,
      startDate: this.startDate,
      endDate: this.endDate,
    });
  }

  onSearchChange(): void {
    this.emitFilter();
  }

  onTypeChange(type: 'todos' | 'credito' | 'debito'): void {
    this.typeFilter = type;
    this.emitFilter();
  }

  onStartDateChange(date: Date | null): void {
    this.startDate = date;
    this.emitFilter();
  }

  onEndDateChange(date: Date | null): void {
    this.endDate = date;
    this.emitFilter();
  }

  toggleButtons(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  getButtonTextColor(type: 'todos' | 'credito' | 'debito') {
    return this.typeFilter === type ? 'var(--white)' : 'var(--gray)';
  }

  getButtonBackgroundColor(type: 'todos' | 'credito' | 'debito') {
    return this.typeFilter === type ? 'var(--primary)' : 'var(--white)';
  }
}

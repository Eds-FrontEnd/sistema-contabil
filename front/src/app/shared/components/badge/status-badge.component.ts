import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type StatusType = 'provisorio' | 'confirmado' | 'cancelado';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss'],
})
export class StatusBadgeComponent {
  @Input() title: string = 'Status';
  @Input() status: StatusType = 'provisorio';

  readonly statusConfig = {
    provisorio: {
      text: 'Provisório',
      icon: 'info',
      color: '#b27b03',
      ariaLabel: 'Status provisório'
    },
    confirmado: {
      text: 'Confirmado',
      icon: 'check',
      color: '#00897b',
      ariaLabel: 'Status confirmado'
    },
    cancelado: {
      text: 'Cancelado',
      icon: 'close',
      color: '#ec003f',
      ariaLabel: 'Status cancelado'
    }
  } as const;

  get current() {
    return this.statusConfig[this.status];
  }
}

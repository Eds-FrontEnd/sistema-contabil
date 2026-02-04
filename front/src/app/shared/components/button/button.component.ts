import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, NgIf],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() label = '';
  @Input() icon?: string;
  @Input() routerLink?: string;
  @Input() disabled = false;
  @Input() ariaLabel?: string;
  @Input() backgroundColor = 'var(--primary)';
  @Input() textColor = 'var(--white)';
  @Input() iconColor = 'var(--white)';
  @Input() className?: string;

  @Output() action = new EventEmitter<void>();

  onClick(): void {
    if (!this.routerLink && !this.disabled) {
      this.action.emit();
    }
  }
}

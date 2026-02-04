import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-page-404',
  imports: [ButtonComponent, CommonModule],
  standalone: true,
  templateUrl: './page-404.html',
  styleUrl: './page-404.scss',
})
export class Page404 {
}

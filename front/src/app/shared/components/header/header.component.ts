import { Component, Input } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { LogoComponent } from "../logo/logo.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonComponent, LogoComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title: string = 'Facilitte - Sistema Contábil';
  @Input() buttonLabel: string = 'Novo Lançamento';
  @Input() buttonIcon: string = 'add';
  @Input() buttonLink: string = '/novo-lancamento';
}

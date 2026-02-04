import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from './button.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent, MatIconModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    component.label = 'Salvar';
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve aplicar a cor do texto corretamente', () => {
    component.textColor = 'red';
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('button')).nativeElement as HTMLElement;

    expect(buttonEl.style.color).toBe('red');
  });

  it('deve exibir o ícone quando definido', () => {
    component.icon = 'check';
    component.iconColor = 'green';
    fixture.detectChanges();

    const iconEl = fixture.debugElement.query(By.css('mat-icon'))?.nativeElement as HTMLElement;
    expect(iconEl).toBeTruthy();
    expect(iconEl.style.color).toBe('green');
    expect(iconEl.textContent?.trim()).toBe('check');
  });

  it('não deve exibir ícone quando não definido', () => {
    component.icon = undefined;
    fixture.detectChanges();

    const iconEl = fixture.debugElement.query(By.css('mat-icon'));
    expect(iconEl).toBeNull();
  });

  it('deve emitir action ao clicar quando não houver routerLink', () => {
    spyOn(component.action, 'emit');

    const buttonEl = fixture.debugElement.query(By.css('button'));
    (buttonEl.nativeElement as HTMLButtonElement).click();

    expect(component.action.emit).toHaveBeenCalled();
  });

  it('não deve emitir action ao clicar quando houver routerLink', () => {
    component.routerLink = '/home';
    fixture.detectChanges();

    spyOn(component.action, 'emit');

    const buttonEl = fixture.debugElement.query(By.css('button'));
    (buttonEl.nativeElement as HTMLButtonElement).click();

    expect(component.action.emit).not.toHaveBeenCalled();
  });

  it('não deve emitir action quando estiver disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    spyOn(component.action, 'emit');

    const buttonEl = fixture.debugElement.query(By.css('button'));
    (buttonEl.nativeElement as HTMLButtonElement).click();

    expect(component.action.emit).not.toHaveBeenCalled();
  });
});

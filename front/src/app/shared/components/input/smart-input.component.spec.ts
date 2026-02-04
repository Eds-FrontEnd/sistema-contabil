import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SmartInputComponent } from './smart-input.component';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

describe('SmartInputComponent', () => {
  let component: SmartInputComponent;
  let fixture: ComponentFixture<SmartInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        SmartInputComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SmartInputComponent);
    component = fixture.componentInstance;

    component.control = new FormControl('', Validators.required);
    component.placeholder = 'Teste Placeholder';
    component.clearIcon = 'close';
    component.errorMessage = 'Campo obrigatório';

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o placeholder correto', () => {
    const labelEl = fixture.debugElement.query(By.css('mat-label'))?.nativeElement as HTMLElement;
    expect(labelEl.textContent).toContain('Teste Placeholder');
  });

  it('deve atualizar o valor do input via FormControl', () => {
    component.control.setValue('Hello');
    fixture.detectChanges();
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(inputEl.value).toBe('Hello');
  });

  it('deve mostrar o ícone de limpar quando há valor', async () => {
    component.control.setValue('Teste');
    fixture.detectChanges();

    const iconButton = fixture.debugElement.query(
      By.css('button[aria-label="Limpar campo"]')
    );
    expect(iconButton).toBeTruthy();

    const matIcon = iconButton.query(By.css('mat-icon'))?.nativeElement as HTMLElement;
    expect(matIcon.textContent?.trim()).toBe('close');
  });

  it('deve limpar o input ao clicar no ícone', async () => {
    component.control.setValue('Teste');
    fixture.detectChanges();

    const iconButton = fixture.debugElement.query(
      By.css('button[aria-label="Limpar campo"]')
    );
    iconButton.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(inputEl.value).toBe('');
  });

  it('deve exibir mensagem de erro quando inválido e tocado', async () => {
    component.control.setValue('');
    component.control.markAsTouched();
    fixture.detectChanges();

    await fixture.whenStable();

    const errorEl = fixture.debugElement.query(By.css('mat-error'))?.nativeElement as HTMLElement;
    expect(errorEl).toBeTruthy();
    expect(errorEl.textContent).toContain('Campo obrigatório');
  });

  it('deve aplicar máscara monetária brasileira corretamente', async () => {
    component.currencyMask = true;
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    inputEl.value = '123456';

    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: inputEl, writable: false });

    component.onInput(event);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(inputEl.value).toBe('1.234,56');
    expect(component.control.value).toBe('1.234,56');
  });
});

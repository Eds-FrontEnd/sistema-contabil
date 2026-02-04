import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData, CurrencyPipe, DecimalPipe } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { By } from '@angular/platform-browser';
import { SummaryCardComponent } from './summary-card.component';

describe('SummaryCardComponent', () => {
  let component: SummaryCardComponent;
  let fixture: ComponentFixture<SummaryCardComponent>;

  beforeAll(() => {
    registerLocaleData(localePt);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryCardComponent],
      providers: [
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        CurrencyPipe,
        DecimalPipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryCardComponent);
    component = fixture.componentInstance;

    component.title = 'Total de Crédito';
    component.icon = 'trending_up';
    component.iconColor = '#43A047';

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o título corretamente', () => {
    const titleEl = fixture.debugElement.query(By.css('.summary-card__title')).nativeElement as HTMLElement;
    expect(titleEl.textContent).toContain('Total de Crédito');
  });

  it('deve renderizar número inteiro quando isCurrency = false', () => {
    component.isCurrency = false;
    component.value = 5000;
    fixture.detectChanges();

    const valueEl = fixture.debugElement.query(By.css('.summary-card__value')).nativeElement as HTMLElement;
    expect(valueEl.textContent?.trim()).toBe('5.000');
    expect(valueEl.textContent).not.toContain('R$');
  });

  it('deve renderizar valor monetário quando isCurrency = true', () => {
    component.isCurrency = true;
    component.value = 50300;
    fixture.detectChanges();

    const valueEl = fixture.debugElement.query(By.css('.summary-card__value')).nativeElement as HTMLElement;
    expect(valueEl.textContent).toContain('R$');
    expect(valueEl.textContent).toContain('50.300,00');
  });

  it('deve renderizar o ícone correto', () => {
    const iconEl = fixture.debugElement.query(By.css('.summary-card__icon')).nativeElement as HTMLElement;
    expect(iconEl.textContent?.trim()).toBe('trending_up');
  });

  it('deve aplicar a cor dinâmica no ícone', () => {
    const iconEl = fixture.debugElement.query(By.css('.summary-card__icon')).nativeElement as HTMLElement;
    expect(iconEl.style.color).toBe('rgb(67, 160, 71)');
  });

  it('deve conter atributo aria-label no ícone', () => {
    const iconEl = fixture.debugElement.query(By.css('.summary-card__icon')).nativeElement as HTMLElement;
    expect(iconEl.getAttribute('aria-label')).toBeTruthy();
  });
});

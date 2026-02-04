import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadgeComponent, StatusType } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let component: StatusBadgeComponent;
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('exibe texto e ícone corretos para "provisorio"', () => {
    component.status = 'provisorio';
    fixture.detectChanges();

    const textEl = fixture.nativeElement.querySelector('.status-badge__text');
    const iconEl = fixture.nativeElement.querySelector('mat-icon');

    expect(textEl.textContent).toBe('Provisório');
    expect(iconEl.textContent.trim()).toBe('info');
  });

  it('exibe texto e ícone corretos para "confirmado"', () => {
    component.status = 'confirmado';
    fixture.detectChanges();

    const textEl = fixture.nativeElement.querySelector('.status-badge__text');
    const iconEl = fixture.nativeElement.querySelector('mat-icon');

    expect(textEl.textContent).toBe('Confirmado');
    expect(iconEl.textContent.trim()).toBe('check');
  });

  it('exibe texto e ícone corretos para "cancelado"', () => {
    component.status = 'cancelado';
    fixture.detectChanges();

    const textEl = fixture.nativeElement.querySelector('.status-badge__text');
    const iconEl = fixture.nativeElement.querySelector('mat-icon');

    expect(textEl.textContent).toBe('Cancelado');
    expect(iconEl.textContent.trim()).toBe('close');
  });

  it('usa cores corretas para cada status', () => {
    const colorsMap: Record<StatusType, string> = {
      provisorio: 'rgb(178, 123, 3)',   // #b27b03
      confirmado: 'rgb(0, 137, 123)',   // #00897b
      cancelado: 'rgb(236, 0, 63)'      // #ec003f
    };

    (Object.keys(colorsMap) as StatusType[]).forEach(status => {
      component.status = status;
      fixture.detectChanges();

      const badgeEl: HTMLElement =
        fixture.nativeElement.querySelector('.status-badge');

      expect(badgeEl.style.borderColor).toBe(colorsMap[status]);
      expect(badgeEl.style.color).toBe(colorsMap[status]);
    });
  });
});

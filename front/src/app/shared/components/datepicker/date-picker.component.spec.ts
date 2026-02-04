import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePickerComponent } from './date-picker.component';
import { By } from '@angular/platform-browser';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve mostrar título dinâmico', () => {
    component.title = 'Data de nascimento';
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('label')).nativeElement;
    expect(label.textContent).toContain('Data de nascimento');
  });

  it('deve validar data obrigatória', () => {
    component.dateControl.setValue('');
    expect(component.dateControl.invalid).toBeTrue();
    expect(component.dateControl.errors?.['required']).toBeTrue();
  });

  it('deve validar data fora do intervalo', () => {
    component.dateControl.setValue('1960-01-01');
    expect(component.dateControl.invalid).toBeTrue();
    expect(component.dateControl.errors?.['outOfRange']).toBeTrue();
  });

  it('deve aceitar data dentro do intervalo', () => {
    const today = new Date();
    const validDate = today.toISOString().split('T')[0];

    component.dateControl.setValue(validDate);
    expect(component.dateControl.valid).toBeTrue();
  });

  it('deve emitir data válida no output', () => {
    spyOn(component.dateChange, 'emit');

    const today = new Date();
    const validDate = today.toISOString().split('T')[0];

    component.dateControl.setValue(validDate);
    expect(component.dateChange.emit).toHaveBeenCalledWith(new Date(validDate));
  });

  it('deve emitir null quando a data for inválida', () => {
    spyOn(component.dateChange, 'emit');

    component.dateControl.setValue('1960-01-01');
    expect(component.dateChange.emit).toHaveBeenCalledWith(null);

    component.dateControl.setValue('');
    expect(component.dateChange.emit).toHaveBeenCalledWith(null);
  });
});

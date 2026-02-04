
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ModalData } from '../../../core/models/modal-data.model';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

  const data: ModalData = {
    title: 'Test Modal',
    message: 'Mensagem de teste',
    isConfirm: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent, CommonModule, MatButtonModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o modal', () => {
    expect(component).toBeTruthy();
  });

  it('deve fechar o modal com true ao confirmar', () => {
    component.onConfirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('deve fechar o modal com false ao cancelar', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});

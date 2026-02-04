import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoLancamento } from './novo-lancamento';

describe('NovoLancamento', () => {
  let component: NovoLancamento;
  let fixture: ComponentFixture<NovoLancamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovoLancamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovoLancamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

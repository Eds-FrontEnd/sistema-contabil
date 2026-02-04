import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Importa o módulo de teste do HttpClient
import { BalanceComponent } from './balance.component';
import { ApiService } from '../../../core/services/api.service';  // Importa o ApiService

describe('BalanceComponent', () => {
  let component: BalanceComponent;
  let fixture: ComponentFixture<BalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceComponent, HttpClientTestingModule],  // Adiciona o HttpClientTestingModule aqui
      providers: [ApiService]  // Fornece o ApiService
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

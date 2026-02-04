import { Routes } from '@angular/router';

import { Home } from './features/pages/home/home';
import { NovoLancamento } from './features/pages/novo-lancamento/novo-lancamento';
import { Page404 } from './features/pages/page-404/page-404';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/pages/home/home').then(m => m.Home),
  },
  {
    path: 'novo-lancamento',
    loadComponent: () => import('./features/pages/novo-lancamento/novo-lancamento').then(m => m.NovoLancamento),
  },
  {
    path: '**',
    loadComponent: () => import('./features/pages/page-404/page-404').then(m => m.Page404),
  }
];

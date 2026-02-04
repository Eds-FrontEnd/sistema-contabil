// core/services/api-endpoints.ts
export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:3000/api',

  TRANSACTIONS: '/lancamentos',
  ACCOUNTS: '/contas',
  BALANCETE: '/lancamentos/balancete',
  AUTH: '/auth/login'
} as const;

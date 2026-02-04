export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

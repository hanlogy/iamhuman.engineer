export interface AuthCredential {
  email: string;
  password: string;
  from: 'signup' | 'login';
}

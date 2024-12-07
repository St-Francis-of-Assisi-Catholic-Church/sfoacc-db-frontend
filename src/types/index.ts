export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  role: 'user' | 'collector' | 'admin';
  name: string;
  trustLevel: string;
  points: number;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export interface AuthProvider {
  login(role: string, name?: string): Promise<LoginResult>;
  verifyToken(token: string): Promise<AuthUser | null>;
  getUser(id: string): Promise<AuthUser | null>;
}

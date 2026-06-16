import type { LoadingState } from '~/shared/types/types';

export const UserRole = {
  ADMIN: 'admin',
  DEVELOPER: 'developer',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  accessToken: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  accessToken: string;
  isLoggedIn: boolean;
  error: string;
  loading: LoadingState;
}

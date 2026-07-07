import { ApiSuccessResponse } from '@/types/api-response';
import {
  AuthSession,
  LoginUserInput,
  RegisterUserInput,
  RegisteredUser,
} from '@/features/auth/types/auth';
import { apiClient } from '../http/api-client';

export async function registerUser(input: RegisterUserInput): Promise<RegisteredUser> {
  const response = await apiClient.post<ApiSuccessResponse<RegisteredUser>>('/auth/register', input);

  return response.data.data;
}

export async function loginUser(input: LoginUserInput): Promise<AuthSession> {
  const response = await apiClient.post<ApiSuccessResponse<AuthSession>>('/auth/login', input);

  return response.data.data;
}

export async function refreshSession(refreshToken: string): Promise<AuthSession> {
  const response = await apiClient.post<ApiSuccessResponse<AuthSession>>('/auth/refresh', {
    refreshToken,
  });

  return response.data.data;
}

export async function logoutUser(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', {
    refreshToken,
  });
}

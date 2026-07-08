import { ApiSuccessResponse } from '@/types/api-response';
import {
  AuthSession,
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginUserInput,
  MessageResponse,
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

export async function confirmEmail(token: string): Promise<MessageResponse> {
  const response = await apiClient.post<ApiSuccessResponse<MessageResponse>>('/auth/confirm-email', {
    token,
  });

  return response.data.data;
}

export async function requestPasswordRecovery(
  input: ForgotPasswordInput,
): Promise<MessageResponse> {
  const response = await apiClient.post<ApiSuccessResponse<MessageResponse>>(
    '/auth/forgot-password',
    input,
  );

  return response.data.data;
}

export async function changePassword(input: ChangePasswordInput): Promise<AuthSession> {
  const response = await apiClient.post<ApiSuccessResponse<AuthSession>>(
    '/auth/change-password',
    input,
  );

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

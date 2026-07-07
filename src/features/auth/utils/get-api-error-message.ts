import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api-response';

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse | undefined;
    const message = response?.error.message;

    if (Array.isArray(message)) {
      return message[0] ?? 'Não foi possível concluir o cadastro.';
    }

    return message ?? 'Não foi possível concluir o cadastro.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Não foi possível concluir o cadastro.';
}

'use client';

import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@/services/auth/auth-service';
import { AuthSession, LoginUserInput } from '../types/auth';

export function useLoginUser() {
  return useMutation<AuthSession, Error, LoginUserInput>({
    mutationFn: loginUser,
  });
}

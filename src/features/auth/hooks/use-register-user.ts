'use client';

import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/services/auth/auth-service';
import { RegisterUserInput, RegisteredUser } from '../types/auth';

export function useRegisterUser() {
  return useMutation<RegisteredUser, Error, RegisterUserInput>({
    mutationFn: registerUser,
  });
}

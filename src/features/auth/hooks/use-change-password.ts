import { useMutation } from '@tanstack/react-query';
import { changePassword } from '@/services/auth/auth-service';

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

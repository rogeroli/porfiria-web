import { useMutation } from '@tanstack/react-query';
import { requestPasswordRecovery } from '@/services/auth/auth-service';

export function useForgotPassword() {
  return useMutation({
    mutationFn: requestPasswordRecovery,
  });
}

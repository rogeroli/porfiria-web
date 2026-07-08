import { useMutation } from '@tanstack/react-query';
import { confirmEmail } from '@/services/auth/auth-service';

export function useConfirmEmail() {
  return useMutation({
    mutationFn: confirmEmail,
  });
}

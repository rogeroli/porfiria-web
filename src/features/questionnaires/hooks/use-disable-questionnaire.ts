import { useMutation } from '@tanstack/react-query';
import { disableQuestionnaire } from '@/services/questionnaires/questionnaires-service';

export function useDisableQuestionnaire() {
  return useMutation({
    mutationFn: disableQuestionnaire,
  });
}

import { useMutation } from '@tanstack/react-query';
import { createQuestionnaire } from '@/services/questionnaires/questionnaires-service';

export function useCreateQuestionnaire() {
  return useMutation({
    mutationFn: createQuestionnaire,
  });
}

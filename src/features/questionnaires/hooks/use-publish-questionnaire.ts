import { useMutation } from '@tanstack/react-query';
import { publishQuestionnaire } from '@/services/questionnaires/questionnaires-service';

export function usePublishQuestionnaire() {
  return useMutation({
    mutationFn: publishQuestionnaire,
  });
}

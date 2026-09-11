import { useQuery } from '@tanstack/react-query';
import { listPublishedQuestionnaires } from '@/services/questionnaires/questionnaires-service';

export function usePublishedQuestionnaires(enabled = true) {
  return useQuery({
    queryKey: ['published-questionnaires'],
    queryFn: listPublishedQuestionnaires,
    enabled,
  });
}

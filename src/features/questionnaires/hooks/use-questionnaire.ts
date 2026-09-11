import { useQuery } from '@tanstack/react-query';
import { getQuestionnaire } from '@/services/questionnaires/questionnaires-service';

export function useQuestionnaire(questionnaireId?: string) {
  return useQuery({
    queryKey: ['questionnaire', questionnaireId],
    queryFn: () => getQuestionnaire(questionnaireId ?? ''),
    enabled: Boolean(questionnaireId),
  });
}

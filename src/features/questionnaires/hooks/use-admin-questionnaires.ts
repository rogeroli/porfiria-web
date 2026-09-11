import { useQuery } from '@tanstack/react-query';
import { listAdminQuestionnaires } from '@/services/questionnaires/questionnaires-service';

export function useAdminQuestionnaires(enabled = true) {
  return useQuery({
    queryKey: ['admin-questionnaires'],
    queryFn: listAdminQuestionnaires,
    enabled,
  });
}

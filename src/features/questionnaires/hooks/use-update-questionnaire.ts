import { useMutation } from '@tanstack/react-query';
import { updateQuestionnaire } from '@/services/questionnaires/questionnaires-service';
import { UpdateQuestionnaireInput } from '../types/questionnaire';

export function useUpdateQuestionnaire() {
  return useMutation({
    mutationFn: ({ questionnaireId, input }: { questionnaireId: string; input: UpdateQuestionnaireInput }) =>
      updateQuestionnaire(questionnaireId, input),
  });
}

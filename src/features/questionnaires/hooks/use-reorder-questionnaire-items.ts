import { useMutation } from '@tanstack/react-query';
import { reorderQuestionnaireItems } from '@/services/questionnaires/questionnaires-service';
import { ReorderQuestionnaireItemsInput } from '../types/questionnaire';

export function useReorderQuestionnaireItems() {
  return useMutation({
    mutationFn: ({ questionnaireId, input }: { questionnaireId: string; input: ReorderQuestionnaireItemsInput }) =>
      reorderQuestionnaireItems(questionnaireId, input),
  });
}

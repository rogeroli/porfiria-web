import { useMutation } from '@tanstack/react-query';
import { addQuizItem } from '@/services/questionnaires/questionnaires-service';

interface AddQuizItemVariables {
  questionnaireId: string;
  input: Parameters<typeof addQuizItem>[1];
}

export function useAddQuizItem() {
  return useMutation({
    mutationFn: ({ questionnaireId, input }: AddQuizItemVariables) => addQuizItem(questionnaireId, input),
  });
}

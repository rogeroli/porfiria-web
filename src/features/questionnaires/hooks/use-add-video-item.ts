import { useMutation } from '@tanstack/react-query';
import { addVideoItem } from '@/services/questionnaires/questionnaires-service';

interface AddVideoItemVariables {
  questionnaireId: string;
  file: File;
}

export function useAddVideoItem() {
  return useMutation({
    mutationFn: ({ questionnaireId, file }: AddVideoItemVariables) => addVideoItem(questionnaireId, file),
  });
}

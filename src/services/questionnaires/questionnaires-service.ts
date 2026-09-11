import { ApiSuccessResponse } from '@/types/api-response';
import {
  CreateQuizItemInput,
  CreateQuestionnaireInput,
  ReorderQuestionnaireItemsInput,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireStatus,
  UpdateQuestionnaireInput,
} from '@/features/questionnaires/types/questionnaire';
import { apiClient } from '../http/api-client';

function buildQuestionnaireFormData(input: CreateQuestionnaireInput | UpdateQuestionnaireInput): FormData {
  const formData = new FormData();

  formData.append('title', input.title);
  formData.append('description', input.description);
  formData.append('contentFormat', input.contentFormat);

  if (input.contentText) {
    formData.append('contentText', input.contentText);
  }

  if (input.contentFile) {
    formData.append('contentFile', input.contentFile);
  }

  return formData;
}

export async function listAdminQuestionnaires(): Promise<Questionnaire[]> {
  const response = await apiClient.get<ApiSuccessResponse<Questionnaire[]>>('/questionnaires/admin');

  return response.data.data;
}

export async function listPublishedQuestionnaires(): Promise<Questionnaire[]> {
  const response = await apiClient.get<ApiSuccessResponse<Questionnaire[]>>('/questionnaires');

  return response.data.data;
}

export async function getQuestionnaire(questionnaireId: string): Promise<Questionnaire> {
  const response = await apiClient.get<ApiSuccessResponse<Questionnaire>>(`/questionnaires/${questionnaireId}`);

  return response.data.data;
}

export async function createQuestionnaire(input: CreateQuestionnaireInput): Promise<Questionnaire> {
  const response = await apiClient.post<ApiSuccessResponse<Questionnaire>>(
    '/questionnaires',
    buildQuestionnaireFormData(input),
  );

  return response.data.data;
}

export async function updateQuestionnaire(questionnaireId: string, input: UpdateQuestionnaireInput): Promise<Questionnaire> {
  const response = await apiClient.patch<ApiSuccessResponse<Questionnaire>>(
    `/questionnaires/${questionnaireId}`,
    buildQuestionnaireFormData(input),
  );

  return response.data.data;
}

export async function addQuizItem(questionnaireId: string, input: CreateQuizItemInput): Promise<QuestionnaireItem> {
  const response = await apiClient.post<ApiSuccessResponse<QuestionnaireItem>>(
    `/questionnaires/${questionnaireId}/items/quiz`,
    input,
  );

  return response.data.data;
}

export async function addVideoItem(questionnaireId: string, file: File): Promise<QuestionnaireItem> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<ApiSuccessResponse<QuestionnaireItem>>(
    `/questionnaires/${questionnaireId}/items/video`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data.data;
}

export async function reorderQuestionnaireItems(
  questionnaireId: string,
  input: ReorderQuestionnaireItemsInput,
): Promise<Questionnaire> {
  const response = await apiClient.patch<ApiSuccessResponse<Questionnaire>>(
    `/questionnaires/${questionnaireId}/items/reorder`,
    input,
  );

  return response.data.data;
}

export async function updateQuestionnaireStatus(questionnaireId: string, status: QuestionnaireStatus): Promise<Questionnaire> {
  const response = await apiClient.patch<ApiSuccessResponse<Questionnaire>>(`/questionnaires/${questionnaireId}/status`, {
    status,
  });

  return response.data.data;
}

export async function publishQuestionnaire(questionnaireId: string): Promise<Questionnaire> {
  return updateQuestionnaireStatus(questionnaireId, QuestionnaireStatus.Published);
}

export async function disableQuestionnaire(questionnaireId: string): Promise<Questionnaire> {
  return updateQuestionnaireStatus(questionnaireId, QuestionnaireStatus.Disabled);
}

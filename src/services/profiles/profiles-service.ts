import { ApiSuccessResponse } from '@/types/api-response';
import { ProfileStatus, ProfileSummary } from '@/features/auth/types/auth';
import { Questionnaire } from '@/features/questionnaires/types/questionnaire';
import { apiClient } from '../http/api-client';

export interface CreateProfileInput {
  name: string;
  description?: string;
}

export interface UpdateProfileInput {
  name?: string;
  description?: string;
}

export interface ProfileQuestionnaireResponse {
  assignedQuestionnaires: Array<Questionnaire & { profileOrder: number }>;
  availableQuestionnaires: Questionnaire[];
}

export async function listActiveProfiles(): Promise<ProfileSummary[]> {
  const response = await apiClient.get<ApiSuccessResponse<ProfileSummary[]>>('/profiles/active');

  return response.data.data;
}

export async function listAdminProfiles(): Promise<ProfileSummary[]> {
  const response = await apiClient.get<ApiSuccessResponse<ProfileSummary[]>>('/profiles/admin');

  return response.data.data;
}

export async function createProfile(input: CreateProfileInput): Promise<ProfileSummary> {
  const response = await apiClient.post<ApiSuccessResponse<ProfileSummary>>('/profiles', input);

  return response.data.data;
}

export async function updateProfile(
  profileId: string,
  input: UpdateProfileInput,
): Promise<ProfileSummary> {
  const response = await apiClient.patch<ApiSuccessResponse<ProfileSummary>>(
    `/profiles/${profileId}`,
    input,
  );

  return response.data.data;
}

export async function disableProfile(profileId: string): Promise<ProfileSummary> {
  const response = await apiClient.patch<ApiSuccessResponse<ProfileSummary>>(
    `/profiles/${profileId}/status`,
    { status: ProfileStatus.Disabled },
  );

  return response.data.data;
}

export async function getProfileQuestionnaire(profileId: string): Promise<ProfileQuestionnaireResponse> {
  const response = await apiClient.get<ApiSuccessResponse<ProfileQuestionnaireResponse>>(
    `/profiles/${profileId}/trails`,
  );

  return response.data.data;
}

export async function updateProfileQuestionnaire(
  profileId: string,
  questionnaireIds: string[],
): Promise<ProfileQuestionnaireResponse> {
  const response = await apiClient.put<ApiSuccessResponse<ProfileQuestionnaireResponse>>(
    `/profiles/${profileId}/trails`,
    { questionnaireIds },
  );

  return response.data.data;
}

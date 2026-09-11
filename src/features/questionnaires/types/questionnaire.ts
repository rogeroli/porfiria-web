import { ProfileSummary } from '@/features/auth/types/auth';

export enum QuestionnaireStatus {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
  Disabled = 'DISABLED',
}

export enum QuestionnaireItemType {
  Quiz = 'QUIZ',
  Video = 'VIDEO',
}

export enum QuestionnaireContentFormat {
  Html = 'HTML',
  Txt = 'TXT',
  Video = 'VIDEO',
  Pdf = 'PDF',
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface QuestionnaireItem {
  id: string;
  type: QuestionnaireItemType;
  order: number;
  question?: string | null;
  videoPath?: string | null;
  videoOriginalName?: string | null;
  videoMimeType?: string | null;
  options: QuizOption[];
}

export interface Questionnaire {
  id: string;
  title: string;
  description: string;
  contentFormat: QuestionnaireContentFormat;
  contentText?: string | null;
  contentFilePath?: string | null;
  contentFileOriginalName?: string | null;
  contentFileMimeType?: string | null;
  status: QuestionnaireStatus;
  targetProfiles: ProfileSummary[];
  items: QuestionnaireItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionnaireInput {
  title: string;
  description: string;
  contentFormat: QuestionnaireContentFormat;
  contentText?: string;
  contentFile?: File;
}

export interface UpdateQuestionnaireInput {
  title: string;
  description: string;
  contentFormat: QuestionnaireContentFormat;
  contentText?: string;
  contentFile?: File;
}

export interface CreateQuizItemInput {
  question: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

export interface ReorderQuestionnaireItemsInput {
  items: Array<{
    id: string;
    order: number;
  }>;
}

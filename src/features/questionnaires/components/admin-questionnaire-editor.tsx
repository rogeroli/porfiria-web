'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowDown,
  ArrowUp,
  HelpCircle,
  LoaderCircle,
  Plus,
  Save,
  Send,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { getCurrentUser } from '@/services/auth/auth-service';
import { UserRole } from '@/features/auth/types/auth';
import { getApiErrorMessage } from '@/features/auth/utils/get-api-error-message';
import { getAuthSession } from '@/features/auth/utils/auth-storage';
import { useAddQuizItem } from '../hooks/use-add-quiz-item';
import { useCreateQuestionnaire } from '../hooks/use-create-questionnaire';
import { usePublishQuestionnaire } from '../hooks/use-publish-questionnaire';
import { useReorderQuestionnaireItems } from '../hooks/use-reorder-questionnaire-items';
import { useQuestionnaire } from '../hooks/use-questionnaire';
import { useUpdateQuestionnaire } from '../hooks/use-update-questionnaire';
import { createQuestionnaireSchema, CreateQuestionnaireFormData } from '../schemas/create-questionnaire-schema';
import { quizItemSchema, QuizItemFormData } from '../schemas/quiz-item-schema';
import {
  Questionnaire,
  QuestionnaireContentFormat,
  QuestionnaireItemType,
  QuestionnaireStatus,
} from '../types/questionnaire';

const optionKeys = ['option1', 'option2', 'option3', 'option4'] as const;

const questionnaireStatusLabels: Record<QuestionnaireStatus, string> = {
  [QuestionnaireStatus.Published]: 'Publicado',
  [QuestionnaireStatus.Draft]: 'Rascunho',
  [QuestionnaireStatus.Disabled]: 'Desativado',
};

export function AdminQuestionnaireEditor({ questionnaireId }: { questionnaireId?: string }) {
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [reorderError, setReorderError] = useState<string | null>(null);
  const [savingFileContentLabel, setSavingFileContentLabel] = useState<string | null>(null);
  const createQuestionnaireMutation = useCreateQuestionnaire();
  const updateQuestionnaireMutation = useUpdateQuestionnaire();
  const publishQuestionnaireMutation = usePublishQuestionnaire();
  const reorderQuestionnaireItemsMutation = useReorderQuestionnaireItems();
  const questionnaireQuery = useQuestionnaire(questionnaireId);
  const currentQuestionnaire = questionnaire ?? questionnaireQuery.data ?? null;

  const questionnaireForm = useForm<CreateQuestionnaireFormData>({
    resolver: zodResolver(createQuestionnaireSchema),
    defaultValues: {
      title: '',
      description: '',
      contentFormat: QuestionnaireContentFormat.Txt,
      contentText: '',
    },
  });
  const selectedContentFormat = useWatch({
    control: questionnaireForm.control,
    name: 'contentFormat',
  });
  const selectedContentFile = useWatch({
    control: questionnaireForm.control,
    name: 'contentFile',
  });
  const isSavingQuestionnaire = createQuestionnaireMutation.isPending || updateQuestionnaireMutation.isPending;
  const isFileContent = [QuestionnaireContentFormat.Video, QuestionnaireContentFormat.Pdf].includes(selectedContentFormat);
  const fileUploadLabel = selectedContentFormat === QuestionnaireContentFormat.Video ? 'video' : 'PDF';
  const selectedContentFileName = isFileContent ? getSelectedFileName(selectedContentFile) : null;
  const shouldShowFileSavingOverlay = Boolean(savingFileContentLabel) && isSavingQuestionnaire;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (!getAuthSession()) {
        router.replace('/login');
        return;
      }

      getCurrentUser()
        .then((user) => {
          if (user.role !== UserRole.Admin) {
            router.replace('/dashboard');
          }
        })
        .finally(() => setIsCheckingAccess(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  useEffect(() => {
    if (!questionnaireQuery.data) {
      return;
    }

    questionnaireForm.reset({
      title: questionnaireQuery.data.title,
      description: questionnaireQuery.data.description,
      contentFormat: questionnaireQuery.data.contentFormat,
      contentText: questionnaireQuery.data.contentText ?? '',
    });
  }, [questionnaireForm, questionnaireQuery.data]);

  async function handleCreateQuestionnaire(data: CreateQuestionnaireFormData): Promise<void> {
    const fileList = data.contentFile as FileList | undefined;
    const contentFile = fileList?.item(0) ?? undefined;
    const isSubmittingFileContent = [QuestionnaireContentFormat.Video, QuestionnaireContentFormat.Pdf].includes(data.contentFormat);
    const input = {
      title: data.title,
      description: data.description,
      contentFormat: data.contentFormat,
      contentText: data.contentText,
      contentFile,
    };

    setSavingFileContentLabel(isSubmittingFileContent ? getFileContentLabel(data.contentFormat) : null);

    try {
      if (currentQuestionnaire) {
        await updateQuestionnaireMutation.mutateAsync({
          questionnaireId: currentQuestionnaire.id,
          input,
        });
        router.replace('/admin/questionnaires?saved=updated');
        return;
      }

      await createQuestionnaireMutation.mutateAsync(input);
      router.replace('/admin/questionnaires?saved=created');
    } catch {
      setSavingFileContentLabel(null);
    }
  }

  async function handlePublishQuestionnaire(): Promise<void> {
    if (!currentQuestionnaire) {
      return;
    }

    setPublishError(null);

    try {
      await publishQuestionnaireMutation.mutateAsync(currentQuestionnaire.id);
      router.replace('/admin/questionnaires');
    } catch (error) {
      setPublishError(getApiErrorMessage(error));
    }
  }

  async function handleMoveItem(itemId: string, direction: 'up' | 'down'): Promise<void> {
    if (!currentQuestionnaire || currentQuestionnaire.status === QuestionnaireStatus.Disabled) {
      return;
    }

    const orderedItems = [...currentQuestionnaire.items].sort((first, second) => first.order - second.order);
    const currentIndex = orderedItems.findIndex((item) => item.id === itemId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedItems.length) {
      return;
    }

    const movedItems = [...orderedItems];
    const [selectedItem] = movedItems.splice(currentIndex, 1);
    movedItems.splice(targetIndex, 0, selectedItem);
    setReorderError(null);

    try {
      const updatedQuestionnaire = await reorderQuestionnaireItemsMutation.mutateAsync({
        questionnaireId: currentQuestionnaire.id,
        input: {
          items: movedItems.map((item, index) => ({
            id: item.id,
            order: index + 1,
          })),
        },
      });
      setQuestionnaire(updatedQuestionnaire);
    } catch (error) {
      setReorderError(getApiErrorMessage(error));
    }
  }

  if (isCheckingAccess || (questionnaireId && questionnaireQuery.isLoading)) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#fbfbfd]">
      {shouldShowFileSavingOverlay && savingFileContentLabel ? <FileSavingOverlay label={savingFileContentLabel} /> : null}

      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/dashboard" className="flex items-center gap-3" aria-label="Porfiria Academy">
            <Image
              src="https://www.porfiriabr.org/store/1/porfiria.png"
              alt="Porfiria Academy"
              width={174}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          <Link className="text-sm font-bold text-[#1f3b64] hover:text-[#43d477]" href="/dashboard">
            Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="rounded-[18px] bg-[#1f3b64] p-7 text-white shadow-[0_12px_23px_rgba(62,73,84,0.15)] md:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#43d477]">
            Administracao
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
            {questionnaireId ? 'Editar questionario' : 'Criar questionario'}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
            Monte um questionario com conteudo, perguntas e respostas para os usuarios consumirem na plataforma.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            className="rounded-[15px] border border-[#ececec] bg-white p-6 shadow-[0_5px_12px_rgba(0,0,0,0.05)]"
            onSubmit={questionnaireForm.handleSubmit(handleCreateQuestionnaire)}
            noValidate
          >
            <h2 className="text-xl font-bold text-[#1f3b64]">Dados do questionario</h2>
            <div className="mt-5 space-y-5">
              <div>
                <label className="text-sm font-bold text-[#343434]" htmlFor="title">
                  Titulo
                </label>
                <input
                  id="title"
                  className="mt-2 h-12 w-full rounded-[10px] border border-[#ececec] bg-white px-4 text-sm text-[#343434] shadow-sm focus:border-[#43d477] focus:ring-[#43d477]"
                  {...questionnaireForm.register('title')}
                />
                {questionnaireForm.formState.errors.title ? (
                  <p className="mt-2 text-sm font-medium text-[#f63c3c]">
                    {questionnaireForm.formState.errors.title.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-bold text-[#343434]" htmlFor="contentFormat">
                  Formato do conteudo
                </label>
                <select
                  id="contentFormat"
                  className="mt-2 h-12 w-full rounded-[10px] border border-[#ececec] bg-white px-4 text-sm text-[#343434] shadow-sm focus:border-[#43d477] focus:ring-[#43d477]"
                  {...questionnaireForm.register('contentFormat')}
                >
                  <option value={QuestionnaireContentFormat.Txt}>Texto</option>
                  <option value={QuestionnaireContentFormat.Html}>HTML</option>
                  <option value={QuestionnaireContentFormat.Video}>Video</option>
                  <option value={QuestionnaireContentFormat.Pdf}>PDF</option>
                </select>
              </div>

              {[QuestionnaireContentFormat.Txt, QuestionnaireContentFormat.Html].includes(selectedContentFormat) ? (
                <div>
                  <label className="text-sm font-bold text-[#343434]" htmlFor="contentText">
                    Conteudo
                  </label>
                  <textarea
                    id="contentText"
                    className="mt-2 min-h-44 w-full rounded-[10px] border border-[#ececec] bg-white px-4 py-3 font-mono text-sm text-[#343434] shadow-sm focus:border-[#43d477] focus:ring-[#43d477]"
                    {...questionnaireForm.register('contentText')}
                  />
                  {questionnaireForm.formState.errors.contentText ? (
                    <p className="mt-2 text-sm font-medium text-[#f63c3c]">
                      {questionnaireForm.formState.errors.contentText.message}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div>
                  <label className="text-sm font-bold text-[#343434]" htmlFor="contentFile">
                    Conteudo
                  </label>
                  <input
                    id="contentFile"
                    className="mt-2 block w-full rounded-[10px] border border-[#ececec] bg-white px-4 py-3 text-sm text-[#343434]"
                    type="file"
                    accept={selectedContentFormat === QuestionnaireContentFormat.Video ? 'video/*' : 'application/pdf'}
                    {...questionnaireForm.register('contentFile')}
                  />
                  {selectedContentFileName ? (
                    <p className="mt-2 text-xs font-bold text-[#1f3b64]">
                      Arquivo selecionado: {selectedContentFileName}
                    </p>
                  ) : null}
                  {currentQuestionnaire?.contentFileOriginalName ? (
                    <p className="mt-2 text-xs font-semibold text-[#818894]">
                      Arquivo atual: {currentQuestionnaire.contentFileOriginalName}
                    </p>
                  ) : null}
                  {questionnaireForm.formState.errors.contentFile ? (
                    <p className="mt-2 text-sm font-medium text-[#f63c3c]">
                      {String(questionnaireForm.formState.errors.contentFile.message)}
                    </p>
                  ) : null}
                  {isSavingQuestionnaire ? (
                    <p className="mt-2 inline-flex items-center text-xs font-semibold text-[#1f3b64]">
                      <LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin text-[#43d477]" aria-hidden="true" />
                      Enviando {fileUploadLabel}. Isso pode levar alguns instantes.
                    </p>
                  ) : null}
                </div>
              )}

              <div>
                <label className="text-sm font-bold text-[#343434]" htmlFor="description">
                  Descricao
                </label>
                <textarea
                  id="description"
                  className="mt-2 min-h-32 w-full rounded-[10px] border border-[#ececec] bg-white px-4 py-3 text-sm text-[#343434] shadow-sm focus:border-[#43d477] focus:ring-[#43d477]"
                  {...questionnaireForm.register('description')}
                />
                {questionnaireForm.formState.errors.description ? (
                  <p className="mt-2 text-sm font-medium text-[#f63c3c]">
                    {questionnaireForm.formState.errors.description.message}
                  </p>
                ) : null}
              </div>

              {createQuestionnaireMutation.isError ? (
                <ErrorMessage message={getApiErrorMessage(createQuestionnaireMutation.error)} />
              ) : null}
              {updateQuestionnaireMutation.isError ? (
                <ErrorMessage message={getApiErrorMessage(updateQuestionnaireMutation.error)} />
              ) : null}
              {questionnaireQuery.isError ? (
                <ErrorMessage message={getApiErrorMessage(questionnaireQuery.error)} />
              ) : null}

              <button
                type="submit"
                disabled={isSavingQuestionnaire}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#43d477] px-6 text-sm font-bold text-white shadow-[0_3px_6px_rgba(64,213,125,0.3)] transition hover:bg-[#1FB354] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSavingQuestionnaire ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : currentQuestionnaire ? (
                  <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                Salvar
              </button>
            </div>
          </form>

          <div className="space-y-6">
            {currentQuestionnaire ? (
              <>
                <QuestionnaireSummary
                  questionnaire={currentQuestionnaire}
                  onMoveItem={handleMoveItem}
                  onPublish={handlePublishQuestionnaire}
                  isPublishing={publishQuestionnaireMutation.isPending}
                  isSavingQuestionnaire={isSavingQuestionnaire}
                  isReordering={reorderQuestionnaireItemsMutation.isPending}
                  publishError={publishError}
                  reorderError={reorderError}
                />
                <QuizItemForm questionnaire={currentQuestionnaire} onQuestionnaireUpdated={setQuestionnaire} />
              </>
            ) : (
              <div className="rounded-[15px] border border-dashed border-[#c4e4da] bg-white p-6 text-sm font-semibold leading-6 text-[#818894]">
                Crie o rascunho do questionario para liberar o cadastro de itens.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function QuestionnaireSummary({
  questionnaire,
  isPublishing,
  isSavingQuestionnaire,
  isReordering,
  publishError,
  reorderError,
  onMoveItem,
  onPublish,
}: {
  questionnaire: Questionnaire;
  isPublishing: boolean;
  isSavingQuestionnaire: boolean;
  isReordering: boolean;
  publishError: string | null;
  reorderError: string | null;
  onMoveItem: (itemId: string, direction: 'up' | 'down') => Promise<void>;
  onPublish: () => Promise<void>;
}) {
  const orderedItems = [...questionnaire.items].sort((first, second) => first.order - second.order);

  return (
    <div className="rounded-[15px] border border-[#ececec] bg-white p-6 shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#43d477]">
            {questionnaireStatusLabels[questionnaire.status]}
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#1f3b64]">{questionnaire.title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#818894]">{questionnaire.items.length} item(ns)</p>
        </div>
        <button
          type="button"
          disabled={
            questionnaire.items.length === 0 ||
            questionnaire.status === QuestionnaireStatus.Disabled ||
            isPublishing ||
            isSavingQuestionnaire
          }
          onClick={onPublish}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#1f3b64] px-5 text-sm font-bold text-white transition hover:bg-[#152944] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPublishing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="mr-2 h-4 w-4" aria-hidden="true" />}
          Publicar
        </button>
      </div>

      {publishError ? <div className="mt-4"><ErrorMessage message={publishError} /></div> : null}
      {reorderError ? <div className="mt-4"><ErrorMessage message={reorderError} /></div> : null}

      {questionnaire.items.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {orderedItems.map((item, index) => (
            <div
              className="grid gap-3 rounded-[10px] border border-[#ececec] bg-[#fbfbfd] p-4 md:grid-cols-[1fr_auto] md:items-center"
              key={item.id}
            >
              <div>
                <p className="text-sm font-bold text-[#1f3b64]">
                  {index + 1}. {item.type === QuestionnaireItemType.Quiz ? item.question : item.videoOriginalName}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#818894]">
                  {item.type === QuestionnaireItemType.Quiz ? 'Quiz' : 'Video'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Mover item para cima"
                  disabled={
                    index === 0 ||
                    questionnaire.status === QuestionnaireStatus.Disabled ||
                    isReordering
                  }
                  onClick={() => onMoveItem(item.id, 'up')}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ececec] bg-white text-[#1f3b64] transition hover:border-[#43d477] hover:text-[#43d477] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Mover item para baixo"
                  disabled={
                    index === orderedItems.length - 1 ||
                    questionnaire.status === QuestionnaireStatus.Disabled ||
                    isReordering
                  }
                  onClick={() => onMoveItem(item.id, 'down')}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ececec] bg-white text-[#1f3b64] transition hover:border-[#43d477] hover:text-[#43d477] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function QuizItemForm({ questionnaire, onQuestionnaireUpdated }: { questionnaire: Questionnaire; onQuestionnaireUpdated: (questionnaire: Questionnaire) => void }) {
  const addQuizMutation = useAddQuizItem();
  const form = useForm<QuizItemFormData>({
    resolver: zodResolver(quizItemSchema),
    defaultValues: {
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctOptions: [],
    },
  });

  async function handleSubmit(data: QuizItemFormData): Promise<void> {
    const options = optionKeys
      .map((key) => ({
        text: data[key]?.trim() ?? '',
        isCorrect: data.correctOptions.includes(key),
      }))
      .filter((option) => option.text.length > 0);
    const item = await addQuizMutation.mutateAsync({
      questionnaireId: questionnaire.id,
      input: {
        question: data.question,
        options,
      },
    });

    onQuestionnaireUpdated({ ...questionnaire, items: [...questionnaire.items, item] });
    form.reset();
  }

  return (
    <form
      className="rounded-[15px] border border-[#ececec] bg-white p-6 shadow-[0_5px_12px_rgba(0,0,0,0.05)]"
      onSubmit={form.handleSubmit(handleSubmit)}
      noValidate
    >
      <div className="flex items-center gap-3">
        <HelpCircle className="h-5 w-5 text-[#43d477]" aria-hidden="true" />
        <h2 className="text-lg font-bold text-[#1f3b64]">Adicionar quiz</h2>
      </div>

      <div className="mt-5 space-y-4">
        <input
          className="h-12 w-full rounded-[10px] border border-[#ececec] px-4 text-sm text-[#343434] focus:border-[#43d477] focus:ring-[#43d477]"
          placeholder="Pergunta"
          {...form.register('question')}
        />
        {form.formState.errors.question ? <FieldError message={form.formState.errors.question.message} /> : null}

        {optionKeys.map((key, index) => (
          <div className="grid gap-2 md:grid-cols-[1fr_auto]" key={key}>
            <input
              className="h-11 rounded-[10px] border border-[#ececec] px-4 text-sm text-[#343434] focus:border-[#43d477] focus:ring-[#43d477]"
              placeholder={`Alternativa ${index + 1}`}
              {...form.register(key)}
            />
            <label className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-[#ececec] px-3 text-sm font-semibold text-[#343434]">
              <input type="checkbox" value={key} {...form.register('correctOptions')} />
              Correta
            </label>
          </div>
        ))}
        {form.formState.errors.correctOptions ? <FieldError message={form.formState.errors.correctOptions.message} /> : null}
        {addQuizMutation.isError ? <ErrorMessage message={getApiErrorMessage(addQuizMutation.error)} /> : null}

        <button
          type="submit"
          disabled={addQuizMutation.isPending}
          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#43d477] px-5 text-sm font-bold text-white transition hover:bg-[#1FB354] disabled:opacity-70"
        >
          {addQuizMutation.isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="mr-2 h-4 w-4" aria-hidden="true" />}
          Adicionar quiz
        </button>
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-sm font-medium text-[#f63c3c]">{message}</p> : null;
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-[10px] border border-[#fbb0b0] bg-[#ffdbdf] px-4 py-3 text-sm font-semibold text-[#993838]">
      {message}
    </div>
  );
}

function FileSavingOverlay({ label }: { label: string }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f3b64]/35 px-5 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label={`Enviando ${label}`}
    >
      <div className="w-full max-w-sm rounded-[15px] border border-[#ececec] bg-white p-6 text-center shadow-[0_18px_40px_rgba(31,59,100,0.22)]">
        <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-[#43d477]" aria-hidden="true" />
        <p className="mt-4 text-base font-bold text-[#1f3b64]">Enviando {label}</p>
        <p className="mt-2 text-sm leading-6 text-[#6f7682]">
          Aguarde enquanto o arquivo e salvo. Voce sera redirecionado apos a confirmacao.
        </p>
      </div>
    </div>
  );
}

function getSelectedFileName(fileInput: unknown): string | null {
  const maybeFileList = fileInput as { length?: number; item?: (index: number) => File | null } | undefined;

  if (!maybeFileList?.length) {
    return null;
  }

  return maybeFileList.item?.(0)?.name ?? null;
}

function getFileContentLabel(contentFormat: QuestionnaireContentFormat): string {
  return contentFormat === QuestionnaireContentFormat.Video ? 'video' : 'PDF';
}

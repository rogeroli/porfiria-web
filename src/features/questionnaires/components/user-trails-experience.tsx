'use client';

import { ArrowRight, FileQuestion, LoaderCircle, LogOut, PartyPopper, Unlock, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser, logoutUser } from '@/services/auth/auth-service';
import { getApiErrorMessage } from '@/features/auth/utils/get-api-error-message';
import { AuthSession, UserStatus } from '@/features/auth/types/auth';
import { clearAuthSession, getAuthSession, getRefreshToken } from '@/features/auth/utils/auth-storage';
import { usePublishedQuestionnaires } from '../hooks/use-published-questionnaires';
import {
  Questionnaire,
  QuestionnaireContentFormat,
  QuestionnaireItem,
  QuestionnaireItemType,
} from '../types/questionnaire';
import { getQuestionnaireContentUrl } from '../utils/get-questionnaire-content-url';

type QuizAnswers = Record<string, string[]>;
type QuizResults = Record<string, boolean>;

const emptyQuestionnaires: Questionnaire[] = [];

export function UserTrailsExperience() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [quizResults, setQuizResults] = useState<QuizResults>({});
  const [stepError, setStepError] = useState<string | null>(null);
  const [celebratingQuizItemId, setCelebratingQuizItemId] = useState<string | null>(null);
  const [unlockedStepMessage, setUnlockedStepMessage] = useState<string | null>(null);
  const questionnairesQuery = usePublishedQuestionnaires(Boolean(session));
  const questionnaires = questionnairesQuery.data ?? emptyQuestionnaires;
  const selectedQuestionnaire = useMemo(
    () => questionnaires.find((questionnaire) => questionnaire.id === selectedQuestionnaireId) ?? questionnaires[0] ?? null,
    [questionnaires, selectedQuestionnaireId],
  );
  const maxUnlockedStepIndex = useMemo(
    () => getMaxUnlockedStepIndex(questionnaires, quizResults),
    [questionnaires, quizResults],
  );
  const selectedQuestionnaireIndex = selectedQuestionnaire
    ? questionnaires.findIndex((questionnaire) => questionnaire.id === selectedQuestionnaire.id)
    : -1;
  const nextQuestionnaire =
    selectedQuestionnaireIndex >= 0 && selectedQuestionnaireIndex < questionnaires.length - 1
      ? questionnaires[selectedQuestionnaireIndex + 1]
      : null;
  const canGoToNextStep =
    Boolean(selectedQuestionnaire && nextQuestionnaire) &&
    selectedQuestionnaireIndex + 1 <= maxUnlockedStepIndex &&
    isQuestionnaireCorrect(selectedQuestionnaire, quizResults);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedSession = getAuthSession();

      if (!storedSession) {
        setHasMounted(true);
        return;
      }

      getCurrentUser()
        .then((user) => {
          const refreshedSession = getAuthSession() ?? storedSession;

          setSession({
            ...refreshedSession,
            mustChangePassword: user.status === UserStatus.ChangePassword,
            user,
          });
        })
        .catch(() => {
          clearAuthSession();
          setSession(null);
        })
        .finally(() => setHasMounted(true));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    if (!session) {
      router.replace('/login');
      return;
    }

    if (session.user.status === UserStatus.Pending) {
      clearAuthSession();
      router.replace('/login?reason=email-pending');
      return;
    }

    if (session.mustChangePassword) {
      router.replace('/change-password');
      return;
    }

    if (session.user.status !== UserStatus.Available) {
      clearAuthSession();
      router.replace('/login');
    }
  }, [hasMounted, router, session]);

  async function handleLogout(): Promise<void> {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } finally {
      clearAuthSession();
      router.replace('/login');
    }
  }

  function selectQuestionnaire(questionnaireId: string, targetIndex: number): void {
    if (targetIndex > maxUnlockedStepIndex) {
      setStepError('Acerte todas as perguntas da etapa atual para liberar a proxima etapa.');
      return;
    }

    setStepError(null);
    setUnlockedStepMessage(null);
    setSelectedQuestionnaireId(questionnaireId);
  }

  function toggleAnswer(item: QuestionnaireItem, optionId: string): void {
    setCelebratingQuizItemId((current) => (current === item.id ? null : current));
    setUnlockedStepMessage(null);
    setQuizResults((current) => {
      const remainingResults = { ...current };
      delete remainingResults[item.id];

      return remainingResults;
    });
    setStepError(null);
    setQuizAnswers((current) => {
      const selectedOptions = current[item.id] ?? [];
      const isSingleAnswerQuestion = item.options.filter((option) => option.isCorrect).length === 1;
      let nextOptions: string[];

      if (isSingleAnswerQuestion) {
        nextOptions = [optionId];
      } else {
        nextOptions = selectedOptions.includes(optionId)
          ? selectedOptions.filter((selectedOptionId) => selectedOptionId !== optionId)
          : [...selectedOptions, optionId];
      }

      return {
        ...current,
        [item.id]: nextOptions,
      };
    });
  }

  function validateQuiz(item: QuestionnaireItem): void {
    const selectedOptionIds = new Set(quizAnswers[item.id] ?? []);
    const correctOptionIds = new Set(item.options.filter((option) => option.isCorrect).map((option) => option.id));
    const isCorrect =
      selectedOptionIds.size === correctOptionIds.size &&
      [...correctOptionIds].every((optionId) => selectedOptionIds.has(optionId));
    const previousMaxUnlockedStepIndex = getMaxUnlockedStepIndex(questionnaires, quizResults);
    const nextQuizResults = {
      ...quizResults,
      [item.id]: isCorrect,
    };
    const nextMaxUnlockedStepIndex = getMaxUnlockedStepIndex(questionnaires, nextQuizResults);

    setQuizResults(nextQuizResults);
    setStepError(null);

    if (!isCorrect) {
      setCelebratingQuizItemId(null);
      setUnlockedStepMessage(null);
      return;
    }

    setCelebratingQuizItemId(item.id);
    window.setTimeout(() => {
      setCelebratingQuizItemId((current) => (current === item.id ? null : current));
    }, 1800);

    const currentQuestionnaireIndex = questionnaires.findIndex((questionnaire) =>
      questionnaire.items.some((questionnaireItem) => questionnaireItem.id === item.id),
    );
    const currentQuestionnaire = currentQuestionnaireIndex >= 0 ? questionnaires[currentQuestionnaireIndex] : null;
    const isCurrentQuestionnaireCompleted = currentQuestionnaire
      ? isQuestionnaireCorrect(currentQuestionnaire, nextQuizResults)
      : false;

    if (
      currentQuestionnaire &&
      currentQuestionnaireIndex === questionnaires.length - 1 &&
      isCurrentQuestionnaireCompleted
    ) {
      setUnlockedStepMessage('Trilha concluida.');
      return;
    }

    if (isCurrentQuestionnaireCompleted && nextMaxUnlockedStepIndex > previousMaxUnlockedStepIndex) {
      const unlockedQuestionnaire = questionnaires[nextMaxUnlockedStepIndex];

      setUnlockedStepMessage(`Proxima etapa liberada: ${unlockedQuestionnaire.title}.`);
    }
  }

  if (!hasMounted || !session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#fbfbfd]">
      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <button type="button" onClick={() => router.push('/dashboard')} aria-label="Porfiria Academy">
            <Image
              src="https://www.porfiriabr.org/store/1/porfiria.png"
              alt="Porfiria Academy"
              width={174}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[#ececec] bg-white px-4 text-sm font-bold text-[#1f3b64] shadow-sm transition hover:border-[#43d477]"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sair
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="rounded-[18px] bg-[#1f3b64] p-7 text-white shadow-[0_12px_23px_rgba(62,73,84,0.15)] md:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#43d477]">Trilhas</p>
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Sua jornada de aprendizagem</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
            Acompanhe os conteudos selecionados para o perfil {session.user.profile.name} e responda os questionarios
            associados a cada etapa.
          </p>
        </div>

        {questionnairesQuery.isLoading ? (
          <div className="mt-8 flex min-h-40 items-center justify-center rounded-[15px] border border-[#ececec] bg-white">
            <LoaderCircle className="h-6 w-6 animate-spin text-[#43d477]" aria-hidden="true" />
          </div>
        ) : null}

        {questionnairesQuery.isError ? (
          <div className="mt-8 rounded-[10px] border border-[#fbb0b0] bg-[#ffdbdf] px-4 py-3 text-sm font-semibold text-[#993838]">
            {getApiErrorMessage(questionnairesQuery.error)}
          </div>
        ) : null}

        {!questionnairesQuery.isLoading && questionnaires.length === 0 ? (
          <div className="mt-8 rounded-[15px] border border-dashed border-[#c4e4da] bg-white p-6 text-sm font-semibold leading-6 text-[#818894]">
            Ainda nao ha trilhas publicadas para o seu perfil.
          </div>
        ) : null}

        {selectedQuestionnaire ? (
          <div className="mt-8 space-y-6">
            <nav
              className="rounded-[15px] border border-[#ececec] bg-white p-4 shadow-[0_5px_12px_rgba(0,0,0,0.05)]"
              aria-label="Etapas da trilha"
            >
              <div className="overflow-x-auto pb-1">
                <div className="flex w-max min-w-full justify-center">
                {questionnaires.map((questionnaire, index) => {
                  const isActive = questionnaire.id === selectedQuestionnaire.id;
                  const isCorrect = isQuestionnaireCorrect(questionnaire, quizResults);
                  const isLocked = index > maxUnlockedStepIndex;

                  return (
                    <div className="flex min-w-[230px] items-center md:min-w-[280px]" key={questionnaire.id}>
                      <button
                        type="button"
                        className={`grid min-h-28 w-full grid-cols-[auto_1fr] gap-3 rounded-[10px] border p-4 text-left transition ${
                          isActive
                            ? 'border-[#43d477] bg-[#e7f4f0]'
                            : isLocked
                              ? 'border-[#ececec] bg-[#f5f5f5] opacity-65'
                              : 'border-[#ececec] bg-[#fbfbfd] hover:border-[#43d477]'
                        }`}
                        onClick={() => selectQuestionnaire(questionnaire.id, index)}
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                            isActive || isCorrect ? 'bg-[#43d477] text-white' : 'bg-white text-[#1f3b64]'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span>
                          <span className="block text-xs font-bold uppercase tracking-[0.08em] text-[#818894]">
                            {isCorrect ? 'Concluida' : isLocked ? 'Bloqueada' : 'Etapa'}
                          </span>
                          <span className="mt-1 block text-sm font-bold text-[#1f3b64]">{questionnaire.title}</span>
                          <span className="mt-2 block text-xs font-semibold text-[#818894]">
                            {questionnaire.items.filter((item) => item.type === QuestionnaireItemType.Quiz).length} pergunta(s)
                          </span>
                        </span>
                      </button>
                      {index < questionnaires.length - 1 ? (
                        <span className="mx-3 hidden h-0.5 w-9 shrink-0 bg-[#c4e4da] md:block" aria-hidden="true" />
                      ) : null}
                    </div>
                  );
                })}
                </div>
              </div>
              {stepError ? (
                <p className="mt-3 rounded-[10px] border border-[#fbb0b0] bg-[#ffdbdf] px-4 py-3 text-sm font-semibold text-[#993838]">
                  {stepError}
                </p>
              ) : null}
            </nav>

            <article className="rounded-[15px] border border-[#ececec] bg-white p-6 shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col gap-3 border-b border-[#ececec] pb-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#43d477]">Conteudo</p>
                  <h2 className="mt-2 text-2xl font-bold text-[#1f3b64]">{selectedQuestionnaire.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#6f7682]">{selectedQuestionnaire.description}</p>
                </div>
              </div>

              <QuestionnaireContent questionnaire={selectedQuestionnaire} />

              <section className="mt-8">
                {unlockedStepMessage ? (
                  <div className="relative mb-5 overflow-hidden rounded-[10px] border border-[#c4e4da] bg-[#e7f4f0] px-4 py-3 text-sm font-bold text-[#1f8f4d]">
                    <span
                      className="absolute right-5 top-3 h-2 w-2 animate-ping rounded-full bg-[#43d477]"
                      aria-hidden="true"
                    />
                    <span
                      className="absolute right-11 bottom-3 h-2.5 w-2.5 animate-pulse rounded-full bg-[#1f3b64]"
                      aria-hidden="true"
                    />
                    <span className="relative inline-flex items-center">
                      <PartyPopper className="mr-2 h-4 w-4 shrink-0 animate-bounce" aria-hidden="true" />
                      <Unlock className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
                      {unlockedStepMessage}
                    </span>
                  </div>
                ) : null}
                <div className="flex items-center gap-3">
                  <FileQuestion className="h-5 w-5 text-[#43d477]" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-[#1f3b64]">Questionario</h3>
                </div>
                <div className="mt-5 grid gap-4">
                  {selectedQuestionnaire.items.filter((item) => item.type === QuestionnaireItemType.Quiz).map((item) => (
                    <QuizCard
                      item={item}
                      key={item.id}
                      result={quizResults[item.id]}
                      isCelebrating={celebratingQuizItemId === item.id}
                      selectedOptionIds={quizAnswers[item.id] ?? []}
                      onToggleAnswer={toggleAnswer}
                      onValidate={validateQuiz}
                    />
                  ))}
                  {selectedQuestionnaire.items.filter((item) => item.type === QuestionnaireItemType.Quiz).length === 0 ? (
                    <div className="rounded-[10px] border border-dashed border-[#c4e4da] bg-[#fbfbfd] p-4 text-sm font-semibold text-[#818894]">
                      Esta etapa ainda nao possui perguntas.
                    </div>
                  ) : null}
                </div>
                {canGoToNextStep && nextQuestionnaire ? (
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#1f3b64] px-5 text-sm font-bold uppercase text-white shadow-[0_10px_20px_rgba(31,59,100,0.18)] transition hover:bg-[#162b49]"
                      onClick={() => selectQuestionnaire(nextQuestionnaire.id, selectedQuestionnaireIndex + 1)}
                    >
                      PROXIMA ETAPA
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ) : null}
              </section>
            </article>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function QuestionnaireContent({ questionnaire }: { questionnaire: Questionnaire }) {
  const contentUrl = getQuestionnaireContentUrl(questionnaire.contentFilePath);

  if (questionnaire.contentFormat === QuestionnaireContentFormat.Txt) {
    return (
      <div className="mt-6 whitespace-pre-wrap rounded-[10px] border border-[#ececec] bg-[#fbfbfd] p-5 text-sm leading-7 text-[#343434]">
        {questionnaire.contentText}
      </div>
    );
  }

  if (questionnaire.contentFormat === QuestionnaireContentFormat.Html) {
    return (
      <iframe
        className="mt-6 min-h-[60vh] w-full rounded-[10px] border border-[#ececec] bg-[#fbfbfd]"
        sandbox=""
        srcDoc={buildHtmlContentDocument(questionnaire.contentText ?? '')}
        title={`Conteudo - ${questionnaire.title}`}
      />
    );
  }

  if (questionnaire.contentFormat === QuestionnaireContentFormat.Video && contentUrl) {
    return (
      <video
        className="mt-6 aspect-video w-full rounded-[10px] border border-[#ececec] bg-black"
        controls
        src={contentUrl}
      />
    );
  }

  if (questionnaire.contentFormat === QuestionnaireContentFormat.Pdf && contentUrl) {
    return (
      <iframe
        className="mt-6 h-[70vh] w-full rounded-[10px] border border-[#ececec] bg-[#fbfbfd]"
        src={contentUrl}
        title={`PDF - ${questionnaire.title}`}
      />
    );
  }

  return (
    <div className="mt-6 rounded-[10px] border border-dashed border-[#c4e4da] bg-[#fbfbfd] p-5 text-sm font-semibold text-[#818894]">
      Conteudo indisponivel para esta etapa.
    </div>
  );
}

function QuizCard({
  item,
  result,
  isCelebrating,
  selectedOptionIds,
  onToggleAnswer,
  onValidate,
}: {
  item: QuestionnaireItem;
  result?: boolean;
  isCelebrating: boolean;
  selectedOptionIds: string[];
  onToggleAnswer: (item: QuestionnaireItem, optionId: string) => void;
  onValidate: (item: QuestionnaireItem) => void;
}) {
  const isSingleAnswerQuestion = item.options.filter((option) => option.isCorrect).length === 1;

  return (
    <div className="relative overflow-hidden rounded-[10px] border border-[#ececec] bg-[#fbfbfd] p-5">
      {isCelebrating ? (
        <div className="pointer-events-none absolute inset-x-4 top-4 flex justify-center" aria-hidden="true">
          <span className="inline-flex animate-bounce items-center rounded-full border border-[#c4e4da] bg-white px-4 py-2 text-sm font-bold text-[#1f8f4d] shadow-[0_10px_22px_rgba(31,143,77,0.18)]">
            <PartyPopper className="mr-2 h-4 w-4" />
            Muito bem, resposta correta
          </span>
          <span className="absolute left-7 top-3 h-2 w-2 animate-ping rounded-full bg-[#43d477]" />
          <span className="absolute right-9 top-8 h-2.5 w-2.5 animate-pulse rounded-full bg-[#1f3b64]" />
        </div>
      ) : null}
      {result === false ? (
        <div className="pointer-events-none absolute inset-x-4 top-4 flex justify-center" aria-hidden="true">
          <span className="inline-flex animate-pulse items-center rounded-full border border-[#fbb0b0] bg-white px-4 py-2 text-sm font-bold text-[#b23333] shadow-[0_10px_22px_rgba(178,51,51,0.14)]">
            <XCircle className="mr-2 h-4 w-4" />
            Revise o conteudo e tente novamente
          </span>
          <span className="absolute left-7 top-3 h-2 w-2 animate-ping rounded-full bg-[#f87171]" />
          <span className="absolute right-9 top-8 h-2.5 w-2.5 animate-pulse rounded-full bg-[#b23333]" />
        </div>
      ) : null}
      <p className="text-base font-bold text-[#1f3b64]">{item.question}</p>
      <p className="mt-2 text-xs font-semibold text-[#818894]">
        {isSingleAnswerQuestion ? 'Selecione uma alternativa.' : 'Selecione uma ou mais alternativas.'}
      </p>
      <div className="mt-4 grid gap-2">
        {item.options.map((option) => (
          <label
            className="flex cursor-pointer items-start gap-3 rounded-[10px] border border-[#ececec] bg-white px-4 py-3 text-sm font-semibold text-[#343434] transition hover:border-[#43d477]"
            key={option.id}
          >
            <input
              type="checkbox"
              checked={selectedOptionIds.includes(option.id)}
              onChange={() => onToggleAnswer(item, option.id)}
            />
            {option.text}
          </label>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-full bg-[#43d477] px-5 text-sm font-bold text-white transition hover:bg-[#1FB354] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={selectedOptionIds.length === 0}
          onClick={() => onValidate(item)}
        >
          Verificar resposta
        </button>
      </div>
    </div>
  );
}

function isQuestionnaireCorrect(questionnaire: Questionnaire, quizResults: QuizResults): boolean {
  const quizItems = questionnaire.items.filter((item) => item.type === QuestionnaireItemType.Quiz);

  if (quizItems.length === 0) {
    return true;
  }

  return quizItems.every((item) => quizResults[item.id] === true);
}

function getMaxUnlockedStepIndex(questionnaires: Questionnaire[], quizResults: QuizResults): number {
  let maxUnlockedIndex = 0;

  for (let index = 0; index < questionnaires.length; index += 1) {
    if (!isQuestionnaireCorrect(questionnaires[index], quizResults)) {
      return maxUnlockedIndex;
    }

    maxUnlockedIndex = Math.min(index + 1, questionnaires.length - 1);
  }

  return maxUnlockedIndex;
}

function buildHtmlContentDocument(content: string): string {
  return `
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 20px;
        background: #fbfbfd;
        color: #343434;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        line-height: 1.7;
      }

      img, video, iframe {
        max-width: 100%;
      }
    </style>
  </head>
  <body>${content}</body>
</html>`;
}

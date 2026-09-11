'use client';

import { Edit3, FileQuestion, LoaderCircle, Plus, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole } from '@/features/auth/types/auth';
import { getAuthSession } from '@/features/auth/utils/auth-storage';
import { getApiErrorMessage } from '@/features/auth/utils/get-api-error-message';
import { getCurrentUser } from '@/services/auth/auth-service';
import { useAdminQuestionnaires } from '../hooks/use-admin-questionnaires';
import { useDisableQuestionnaire } from '../hooks/use-disable-questionnaire';
import { QuestionnaireStatus } from '../types/questionnaire';

const questionnaireStatusLabels: Record<QuestionnaireStatus, { label: string; className: string }> = {
  [QuestionnaireStatus.Published]: {
    label: 'Publicado',
    className: 'bg-[#e7f4f0] text-[#1f8f4d]',
  },
  [QuestionnaireStatus.Draft]: {
    label: 'Rascunho',
    className: 'bg-[#fff4cc] text-[#9a6b00]',
  },
  [QuestionnaireStatus.Disabled]: {
    label: 'Desativado',
    className: 'bg-[#ffdbdf] text-[#b23333]',
  },
};

export function AdminQuestionnairesManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [disableError, setDisableError] = useState<string | null>(null);
  const questionnairesQuery = useAdminQuestionnaires(hasAdminAccess);
  const disableQuestionnaireMutation = useDisableQuestionnaire();
  const savedStatus = searchParams.get('saved');
  const successMessage =
    savedStatus === 'created'
      ? 'Questionario criado com sucesso.'
      : savedStatus === 'updated'
        ? 'Questionario editado com sucesso.'
        : null;

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
            return;
          }

          setHasAdminAccess(true);
        })
        .finally(() => setIsCheckingAccess(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  if (isCheckingAccess) {
    return null;
  }

  async function handleDisableQuestionnaire(questionnaireId: string, questionnaireTitle: string): Promise<void> {
    const confirmed = window.confirm(`Deseja desativar o questionario "${questionnaireTitle}"?`);

    if (!confirmed) {
      return;
    }

    setDisableError(null);

    try {
      await disableQuestionnaireMutation.mutateAsync(questionnaireId);
      await questionnairesQuery.refetch();
    } catch (error) {
      setDisableError(getApiErrorMessage(error));
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfbfd]">
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
        <div className="grid gap-6 rounded-[18px] bg-[#1f3b64] p-7 text-white shadow-[0_12px_23px_rgba(62,73,84,0.15)] md:grid-cols-[1fr_auto] md:items-end md:p-9">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#43d477]">
              Administracao
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Gerenciar questionarios</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
              Crie questionarios, edite conteudos existentes e organize perguntas, respostas e videos.
            </p>
          </div>
          <Link
            href="/admin/questionnaires/new"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#43d477] px-6 text-sm font-bold text-white shadow-[0_3px_6px_rgba(64,213,125,0.3)] transition hover:bg-[#1FB354]"
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Novo questionario
          </Link>
        </div>

        <div className="mt-8">
          {successMessage ? (
            <div className="mb-4 rounded-[10px] border border-[#bdebcf] bg-[#e7f4f0] px-4 py-3 text-sm font-semibold text-[#1f8f4d]">
              {successMessage}
            </div>
          ) : null}

          {questionnairesQuery.isLoading ? (
            <div className="flex min-h-40 items-center justify-center rounded-[15px] border border-[#ececec] bg-white">
              <LoaderCircle className="h-6 w-6 animate-spin text-[#43d477]" aria-hidden="true" />
            </div>
          ) : null}

          {questionnairesQuery.isError ? (
            <div className="rounded-[10px] border border-[#fbb0b0] bg-[#ffdbdf] px-4 py-3 text-sm font-semibold text-[#993838]">
              {getApiErrorMessage(questionnairesQuery.error)}
            </div>
          ) : null}
          {disableError ? (
            <div className="mb-4 rounded-[10px] border border-[#fbb0b0] bg-[#ffdbdf] px-4 py-3 text-sm font-semibold text-[#993838]">
              {disableError}
            </div>
          ) : null}

          {questionnairesQuery.data?.length === 0 ? (
            <div className="rounded-[15px] border border-dashed border-[#c4e4da] bg-white p-6 text-sm font-semibold leading-6 text-[#818894]">
              Nenhum questionario cadastrado ainda.
            </div>
          ) : null}

          {questionnairesQuery.data && questionnairesQuery.data.length > 0 ? (
            <div className="grid gap-4">
              {questionnairesQuery.data.map((questionnaire) => (
                <article
                  className="grid gap-4 rounded-[15px] border border-[#ececec] bg-white p-6 shadow-[0_5px_12px_rgba(0,0,0,0.05)] md:grid-cols-[1fr_auto] md:items-center"
                  key={questionnaire.id}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f4f0] text-[#43d477]">
                        <FileQuestion className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${questionnaireStatusLabels[questionnaire.status].className}`}
                      >
                        {questionnaireStatusLabels[questionnaire.status].label}
                      </span>
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-[#1f3b64]">{questionnaire.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6f7682]">
                      {questionnaire.description}
                    </p>
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-[#818894]">
                      {questionnaire.items.length} item(ns)
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {questionnaire.targetProfiles.map((profile) => (
                        <span
                          className="rounded-full bg-[#f7fafd] px-3 py-1 text-xs font-bold text-[#1f3b64]"
                          key={profile.id}
                        >
                          {profile.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={`/admin/questionnaires/${questionnaire.id}`}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-[#ececec] bg-white px-5 text-sm font-bold text-[#1f3b64] transition hover:border-[#43d477] hover:text-[#43d477]"
                    >
                      <Edit3 className="mr-2 h-4 w-4" aria-hidden="true" />
                      Editar
                    </Link>
                    <button
                      type="button"
                      disabled={questionnaire.status === QuestionnaireStatus.Disabled || disableQuestionnaireMutation.isPending}
                      onClick={() => handleDisableQuestionnaire(questionnaire.id, questionnaire.title)}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-[#fbb0b0] bg-white px-5 text-sm font-bold text-[#b23333] transition hover:bg-[#ffdbdf] disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      {disableQuestionnaireMutation.isPending ? (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      )}
                      Desativar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

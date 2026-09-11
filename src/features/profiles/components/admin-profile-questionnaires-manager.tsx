'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, LoaderCircle, Plus, Save, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ProfileSummary, UserRole } from '@/features/auth/types/auth';
import { getAuthSession } from '@/features/auth/utils/auth-storage';
import { getApiErrorMessage } from '@/features/auth/utils/get-api-error-message';
import { Questionnaire } from '@/features/questionnaires/types/questionnaire';
import { getCurrentUser } from '@/services/auth/auth-service';
import {
  getProfileQuestionnaire,
  listAdminProfiles,
  updateProfileQuestionnaire,
} from '@/services/profiles/profiles-service';

type OrderedQuestionnaire = Questionnaire & { profileOrder?: number };

export function AdminProfileQuestionnairesManager() {
  const router = useRouter();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [assignedQuestionnaires, setAssignedQuestionnaires] = useState<OrderedQuestionnaire[]>([]);
  const [availableQuestionnaires, setAvailableQuestionnaires] = useState<Questionnaire[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const profilesQuery = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: listAdminProfiles,
    enabled: hasAdminAccess,
  });
  const profileQuestionnairesQuery = useQuery({
    queryKey: ['profile-questionnaires', selectedProfileId],
    queryFn: () => getProfileQuestionnaire(selectedProfileId),
    enabled: Boolean(selectedProfileId),
  });
  const updateMutation = useMutation({
    mutationFn: ({ profileId, questionnaireIds }: { profileId: string; questionnaireIds: string[] }) =>
      updateProfileQuestionnaire(profileId, questionnaireIds),
  });
  const selectedProfile = useMemo<ProfileSummary | undefined>(
    () => profilesQuery.data?.find((profile) => profile.id === selectedProfileId),
    [profilesQuery.data, selectedProfileId],
  );

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

  useEffect(() => {
    if (!selectedProfileId && profilesQuery.data?.[0]) {
      const timeoutId = window.setTimeout(() => setSelectedProfileId(profilesQuery.data[0].id), 0);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [profilesQuery.data, selectedProfileId]);

  useEffect(() => {
    if (!profileQuestionnairesQuery.data) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setAssignedQuestionnaires(profileQuestionnairesQuery.data.assignedQuestionnaires);
      setAvailableQuestionnaires(profileQuestionnairesQuery.data.availableQuestionnaires);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [profileQuestionnairesQuery.data]);

  function addQuestionnaire(questionnaire: Questionnaire): void {
    setSuccessMessage(null);
    setAvailableQuestionnaires((current) => current.filter((item) => item.id !== questionnaire.id));
    setAssignedQuestionnaires((current) => [...current, questionnaire]);
  }

  function removeQuestionnaire(questionnaire: Questionnaire): void {
    setSuccessMessage(null);
    setAssignedQuestionnaires((current) => current.filter((item) => item.id !== questionnaire.id));
    setAvailableQuestionnaires((current) => [questionnaire, ...current]);
  }

  function moveQuestionnaire(questionnaireId: string, direction: 'up' | 'down'): void {
    setSuccessMessage(null);
    setAssignedQuestionnaires((current) => {
      const currentIndex = current.findIndex((questionnaire) => questionnaire.id === questionnaireId);
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const updated = [...current];
      const [questionnaire] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, questionnaire);

      return updated;
    });
  }

  async function handleSave(): Promise<void> {
    if (!selectedProfileId) {
      return;
    }

    setActionError(null);
    setSuccessMessage(null);

    try {
      const response = await updateMutation.mutateAsync({
        profileId: selectedProfileId,
        questionnaireIds: assignedQuestionnaires.map((questionnaire) => questionnaire.id),
      });
      setAssignedQuestionnaires(response.assignedQuestionnaires);
      setAvailableQuestionnaires(response.availableQuestionnaires);
      setSuccessMessage('Trilha por perfil salva com sucesso.');
    } catch (error) {
      setActionError(getApiErrorMessage(error));
    }
  }

  if (isCheckingAccess) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#fbfbfd]">
      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/dashboard" aria-label="Porfiria Academy">
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
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#43d477]">Administracao</p>
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Trilhas por perfil</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
            Escolha quais questionarios compoem a trilha de cada perfil e organize a ordem de apresentacao.
          </p>
        </div>

        <div className="mt-8 rounded-[15px] border border-[#ececec] bg-white p-6 shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
          <label className="text-sm font-bold text-[#343434]" htmlFor="profileId">
            Perfil
          </label>
          <select
            id="profileId"
            className="mt-2 h-12 w-full rounded-[10px] border border-[#ececec] px-4 text-sm font-semibold text-[#343434] focus:border-[#43d477] focus:ring-[#43d477]"
            value={selectedProfileId}
            onChange={(event) => {
              setSelectedProfileId(event.target.value);
              setActionError(null);
              setSuccessMessage(null);
            }}
          >
            {profilesQuery.data?.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </select>
          {selectedProfile ? (
            <p className="mt-3 text-sm leading-6 text-[#818894]">
              Ordem atual para o perfil {selectedProfile.name}.
            </p>
          ) : null}
        </div>

        {actionError ? <div className="mt-5"><ErrorMessage message={actionError} /></div> : null}
        {successMessage ? <div className="mt-5"><SuccessMessage message={successMessage} /></div> : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[15px] border border-[#ececec] bg-white p-6 shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-[#1f3b64]">Questionarios selecionados</h2>
              <button
                type="button"
                disabled={updateMutation.isPending || !selectedProfileId}
                onClick={handleSave}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#43d477] px-4 text-sm font-bold text-white transition hover:bg-[#1FB354] disabled:opacity-60"
              >
                {updateMutation.isPending ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                Salvar
              </button>
            </div>
            <div className="mt-5 grid gap-3">
              {profileQuestionnairesQuery.isLoading ? (
                <LoaderCircle className="h-6 w-6 animate-spin text-[#43d477]" aria-hidden="true" />
              ) : null}
              {assignedQuestionnaires.map((questionnaire, index) => (
                <QuestionnaireRow
                  key={questionnaire.id}
                  questionnaire={questionnaire}
                  index={index}
                  total={assignedQuestionnaires.length}
                  onMove={moveQuestionnaire}
                  onRemove={removeQuestionnaire}
                />
              ))}
            </div>
          </section>

          <section className="rounded-[15px] border border-[#ececec] bg-white p-6 shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
            <h2 className="text-xl font-bold text-[#1f3b64]">Questionarios disponiveis</h2>
            <div className="mt-5 grid gap-3">
              {availableQuestionnaires.map((questionnaire) => (
                <div
                  className="grid gap-3 rounded-[10px] border border-[#ececec] bg-[#fbfbfd] p-4 md:grid-cols-[1fr_auto] md:items-center"
                  key={questionnaire.id}
                >
                  <div>
                    <p className="text-sm font-bold text-[#1f3b64]">{questionnaire.title}</p>
                    <p className="mt-1 text-xs font-semibold text-[#818894]">{questionnaire.items.length} item(ns)</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-full border border-[#ececec] bg-white px-4 text-sm font-bold text-[#1f3b64] transition hover:border-[#43d477] hover:text-[#43d477]"
                    onClick={() => addQuestionnaire(questionnaire)}
                  >
                    <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function QuestionnaireRow({
  questionnaire,
  index,
  total,
  onMove,
  onRemove,
}: {
  questionnaire: Questionnaire;
  index: number;
  total: number;
  onMove: (questionnaireId: string, direction: 'up' | 'down') => void;
  onRemove: (questionnaire: Questionnaire) => void;
}) {
  return (
    <div className="grid gap-3 rounded-[10px] border border-[#ececec] bg-[#fbfbfd] p-4 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <p className="text-sm font-bold text-[#1f3b64]">
          {index + 1}. {questionnaire.title}
        </p>
        <p className="mt-1 text-xs font-semibold text-[#818894]">{questionnaire.items.length} item(ns)</p>
      </div>
      <div className="flex items-center gap-2">
        <IconButton disabled={index === 0} label="Mover para cima" onClick={() => onMove(questionnaire.id, 'up')}>
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </IconButton>
        <IconButton disabled={index === total - 1} label="Mover para baixo" onClick={() => onMove(questionnaire.id, 'down')}>
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </IconButton>
        <IconButton label="Remover" onClick={() => onRemove(questionnaire)}>
          <XCircle className="h-4 w-4" aria-hidden="true" />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({
  children,
  disabled,
  label,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ececec] bg-white text-[#1f3b64] transition hover:border-[#43d477] hover:text-[#43d477] disabled:cursor-not-allowed disabled:opacity-45"
    >
      {children}
    </button>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-[10px] border border-[#fbb0b0] bg-[#ffdbdf] px-4 py-3 text-sm font-semibold text-[#993838]">
      {message}
    </div>
  );
}

function SuccessMessage({ message }: { message: string }) {
  return (
    <div className="rounded-[10px] border border-[#bdebcf] bg-[#e7f4f0] px-4 py-3 text-sm font-semibold text-[#1f8f4d]">
      {message}
    </div>
  );
}

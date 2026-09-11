'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Edit3, LoaderCircle, Plus, Save, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ProfileStatus, ProfileSummary, UserRole } from '@/features/auth/types/auth';
import { getAuthSession } from '@/features/auth/utils/auth-storage';
import { getApiErrorMessage } from '@/features/auth/utils/get-api-error-message';
import { getCurrentUser } from '@/services/auth/auth-service';
import {
  createProfile,
  disableProfile,
  listAdminProfiles,
  updateProfile,
} from '@/services/profiles/profiles-service';

const profileSchema = z.object({
  name: z.string().min(2, 'Informe um nome com pelo menos 2 caracteres.'),
  description: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function AdminProfilesManager() {
  const router = useRouter();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [editingProfile, setEditingProfile] = useState<ProfileSummary | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const profilesQuery = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: listAdminProfiles,
    enabled: hasAdminAccess,
  });
  const createMutation = useMutation({ mutationFn: createProfile });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProfileFormData }) => updateProfile(id, data),
  });
  const disableMutation = useMutation({ mutationFn: disableProfile });
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', description: '' },
  });

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

  async function handleSubmit(data: ProfileFormData): Promise<void> {
    setActionError(null);

    try {
      if (editingProfile) {
        await updateMutation.mutateAsync({ id: editingProfile.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }

      setEditingProfile(null);
      form.reset({ name: '', description: '' });
      await profilesQuery.refetch();
    } catch (error) {
      setActionError(getApiErrorMessage(error));
    }
  }

  async function handleDisable(profile: ProfileSummary): Promise<void> {
    const confirmed = window.confirm(`Deseja desativar o perfil "${profile.name}"?`);

    if (!confirmed) {
      return;
    }

    setActionError(null);

    try {
      await disableMutation.mutateAsync(profile.id);
      await profilesQuery.refetch();
    } catch (error) {
      setActionError(getApiErrorMessage(error));
    }
  }

  function startEditing(profile: ProfileSummary): void {
    setEditingProfile(profile);
    form.reset({
      name: profile.name,
      description: profile.description ?? '',
    });
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
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Gerenciar perfis</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
            Cadastre, edite e desative os perfis que organizam usuarios e trilhas.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <form
            className="rounded-[15px] border border-[#ececec] bg-white p-6 shadow-[0_5px_12px_rgba(0,0,0,0.05)]"
            onSubmit={form.handleSubmit(handleSubmit)}
            noValidate
          >
            <h2 className="text-xl font-bold text-[#1f3b64]">
              {editingProfile ? 'Editar perfil' : 'Novo perfil'}
            </h2>
            <div className="mt-5 space-y-5">
              <div>
                <label className="text-sm font-bold text-[#343434]" htmlFor="name">Nome</label>
                <input
                  id="name"
                  className="mt-2 h-12 w-full rounded-[10px] border border-[#ececec] px-4 text-sm text-[#343434] focus:border-[#43d477] focus:ring-[#43d477]"
                  {...form.register('name')}
                />
                {form.formState.errors.name ? (
                  <p className="mt-2 text-sm font-medium text-[#f63c3c]">{form.formState.errors.name.message}</p>
                ) : null}
              </div>
              <div>
                <label className="text-sm font-bold text-[#343434]" htmlFor="description">Descricao</label>
                <textarea
                  id="description"
                  className="mt-2 min-h-28 w-full rounded-[10px] border border-[#ececec] px-4 py-3 text-sm text-[#343434] focus:border-[#43d477] focus:ring-[#43d477]"
                  {...form.register('description')}
                />
              </div>
              {actionError ? <ErrorMessage message={actionError} /> : null}
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#43d477] px-6 text-sm font-bold text-white transition hover:bg-[#1FB354] disabled:opacity-70"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : editingProfile ? (
                  <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                {editingProfile ? 'Salvar alteracoes' : 'Cadastrar perfil'}
              </button>
            </div>
          </form>

          <div className="grid gap-4">
            {profilesQuery.isLoading ? (
              <div className="flex min-h-40 items-center justify-center rounded-[15px] border border-[#ececec] bg-white">
                <LoaderCircle className="h-6 w-6 animate-spin text-[#43d477]" aria-hidden="true" />
              </div>
            ) : null}
            {profilesQuery.data?.map((profile) => (
              <article
                className="grid gap-4 rounded-[15px] border border-[#ececec] bg-white p-6 shadow-[0_5px_12px_rgba(0,0,0,0.05)] md:grid-cols-[1fr_auto] md:items-center"
                key={profile.id}
              >
                <div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${
                      profile.status === ProfileStatus.Active
                        ? 'bg-[#e7f4f0] text-[#1f8f4d]'
                        : 'bg-[#ffdbdf] text-[#b23333]'
                    }`}
                  >
                    {profile.status === ProfileStatus.Active ? 'Ativo' : 'Desativado'}
                  </span>
                  <h2 className="mt-4 text-xl font-bold text-[#1f3b64]">{profile.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#6f7682]">{profile.description ?? 'Sem descricao.'}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#ececec] bg-white px-5 text-sm font-bold text-[#1f3b64] transition hover:border-[#43d477] hover:text-[#43d477]"
                    onClick={() => startEditing(profile)}
                  >
                    <Edit3 className="mr-2 h-4 w-4" aria-hidden="true" />
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={profile.status === ProfileStatus.Disabled || disableMutation.isPending}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#fbb0b0] bg-white px-5 text-sm font-bold text-[#b23333] transition hover:bg-[#ffdbdf] disabled:opacity-55"
                    onClick={() => handleDisable(profile)}
                  >
                    <XCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                    Desativar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-[10px] border border-[#fbb0b0] bg-[#ffdbdf] px-4 py-3 text-sm font-semibold text-[#993838]">
      {message}
    </div>
  );
}

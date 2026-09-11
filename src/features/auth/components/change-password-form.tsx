'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useChangePassword } from '../hooks/use-change-password';
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from '../schemas/change-password-schema';
import { saveAuthSession, getAuthSession } from '../utils/auth-storage';
import { getApiErrorMessage } from '../utils/get-api-error-message';

export function ChangePasswordForm() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const changePasswordMutation = useChangePassword();
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const session = getAuthSession();

      setHasSession(Boolean(session));
      setHasMounted(true);

      if (!session) {
        router.replace('/login');
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  useEffect(() => {
    if (hasMounted && !hasSession) {
      router.replace('/login');
    }
  }, [hasMounted, hasSession, router]);

  async function onSubmit(data: ChangePasswordFormData): Promise<void> {
    const updatedSession = await changePasswordMutation.mutateAsync(data);
    saveAuthSession(updatedSession);
    router.replace('/dashboard');
  }

  if (!hasMounted || !hasSession) {
    return null;
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div>
        <label className="text-sm font-bold text-[#343434]" htmlFor="currentPassword">
          Senha atual ou temporaria
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          className="mt-2 h-12 w-full rounded-[10px] border border-[#ececec] bg-white px-4 text-sm text-[#343434] shadow-sm transition placeholder:text-[#818894] focus:border-[#43d477] focus:ring-[#43d477]"
          aria-invalid={Boolean(form.formState.errors.currentPassword)}
          aria-describedby={
            form.formState.errors.currentPassword ? 'current-password-error' : undefined
          }
          {...form.register('currentPassword')}
        />
        {form.formState.errors.currentPassword ? (
          <p className="mt-2 text-sm font-medium text-[#f63c3c]" id="current-password-error">
            {form.formState.errors.currentPassword.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-bold text-[#343434]" htmlFor="newPassword">
          Nova senha
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          className="mt-2 h-12 w-full rounded-[10px] border border-[#ececec] bg-white px-4 text-sm text-[#343434] shadow-sm transition placeholder:text-[#818894] focus:border-[#43d477] focus:ring-[#43d477]"
          placeholder="Exemplo: NovaSenha@123"
          aria-invalid={Boolean(form.formState.errors.newPassword)}
          aria-describedby={form.formState.errors.newPassword ? 'new-password-error' : undefined}
          {...form.register('newPassword')}
        />
        <p className="mt-2 text-xs font-medium leading-5 text-[#818894]">
          Use mais de 8 caracteres com maiuscula, minuscula, numero e caractere especial.
        </p>
        {form.formState.errors.newPassword ? (
          <p className="mt-2 text-sm font-medium text-[#f63c3c]" id="new-password-error">
            {form.formState.errors.newPassword.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-bold text-[#343434]" htmlFor="confirmPassword">
          Confirmar nova senha
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="mt-2 h-12 w-full rounded-[10px] border border-[#ececec] bg-white px-4 text-sm text-[#343434] shadow-sm transition placeholder:text-[#818894] focus:border-[#43d477] focus:ring-[#43d477]"
          aria-invalid={Boolean(form.formState.errors.confirmPassword)}
          aria-describedby={
            form.formState.errors.confirmPassword ? 'confirm-password-error' : undefined
          }
          {...form.register('confirmPassword')}
        />
        {form.formState.errors.confirmPassword ? (
          <p className="mt-2 text-sm font-medium text-[#f63c3c]" id="confirm-password-error">
            {form.formState.errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      {changePasswordMutation.isError ? (
        <div className="rounded-[10px] border border-[#fbb0b0] bg-[#ffdbdf] px-4 py-3 text-sm font-semibold text-[#993838]">
          {getApiErrorMessage(changePasswordMutation.error)}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={changePasswordMutation.isPending}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#43d477] px-6 text-sm font-bold text-white shadow-[0_3px_6px_rgba(64,213,125,0.3)] transition hover:bg-[#1FB354] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {changePasswordMutation.isPending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Salvando...
          </>
        ) : (
          'Criar nova senha'
        )}
      </button>
    </form>
  );
}

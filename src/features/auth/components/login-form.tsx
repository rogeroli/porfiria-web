'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useLoginUser } from '../hooks/use-login-user';
import { loginSchema, LoginFormData } from '../schemas/login-schema';
import { saveAuthSession } from '../utils/auth-storage';
import { getApiErrorMessage } from '../utils/get-api-error-message';

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLoginUser();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormData): Promise<void> {
    const session = await loginMutation.mutateAsync(data);
    saveAuthSession(session);
    router.replace('/dashboard');
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div>
        <label className="text-sm font-bold text-[#343434]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="mt-2 h-12 w-full rounded-[10px] border border-[#ececec] bg-white px-4 text-sm text-[#343434] shadow-sm transition placeholder:text-[#818894] focus:border-[#43d477] focus:ring-[#43d477]"
          placeholder="voce@example.com"
          aria-invalid={Boolean(form.formState.errors.email)}
          aria-describedby={form.formState.errors.email ? 'email-error' : undefined}
          {...form.register('email')}
        />
        {form.formState.errors.email ? (
          <p className="mt-2 text-sm font-medium text-[#f63c3c]" id="email-error">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-bold text-[#343434]" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="mt-2 h-12 w-full rounded-[10px] border border-[#ececec] bg-white px-4 text-sm text-[#343434] shadow-sm transition placeholder:text-[#818894] focus:border-[#43d477] focus:ring-[#43d477]"
          placeholder="Sua senha"
          aria-invalid={Boolean(form.formState.errors.password)}
          aria-describedby={form.formState.errors.password ? 'password-error' : undefined}
          {...form.register('password')}
        />
        {form.formState.errors.password ? (
          <p className="mt-2 text-sm font-medium text-[#f63c3c]" id="password-error">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      {loginMutation.isError ? (
        <div className="rounded-[10px] border border-[#fbb0b0] bg-[#ffdbdf] px-4 py-3 text-sm font-semibold text-[#993838]">
          {getApiErrorMessage(loginMutation.error)}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#43d477] px-6 text-sm font-bold text-white shadow-[0_3px_6px_rgba(64,213,125,0.3)] transition hover:bg-[#1FB354] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loginMutation.isPending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </button>
    </form>
  );
}

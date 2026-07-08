'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useForgotPassword } from '../hooks/use-forgot-password';
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from '../schemas/forgot-password-schema';
import { getApiErrorMessage } from '../utils/get-api-error-message';

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordFormData): Promise<void> {
    await forgotPasswordMutation.mutateAsync(data);
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

      {forgotPasswordMutation.isSuccess ? (
        <div className="flex gap-3 rounded-[10px] border border-[#c4e4da] bg-[#e7f4f0] px-4 py-3 text-sm font-semibold leading-6 text-[#1f3b64]">
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#43d477]" aria-hidden="true" />
          {forgotPasswordMutation.data.message}
        </div>
      ) : null}

      {forgotPasswordMutation.isError ? (
        <div className="rounded-[10px] border border-[#fbb0b0] bg-[#ffdbdf] px-4 py-3 text-sm font-semibold text-[#993838]">
          {getApiErrorMessage(forgotPasswordMutation.error)}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={forgotPasswordMutation.isPending}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#43d477] px-6 text-sm font-bold text-white shadow-[0_3px_6px_rgba(64,213,125,0.3)] transition hover:bg-[#1FB354] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {forgotPasswordMutation.isPending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Enviando...
          </>
        ) : (
          'Enviar senha temporaria'
        )}
      </button>
    </form>
  );
}

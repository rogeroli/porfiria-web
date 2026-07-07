'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useRegisterUser } from '../hooks/use-register-user';
import { registerSchema, RegisterFormData } from '../schemas/register-schema';
import { UserProfile } from '../types/auth';
import { getApiErrorMessage } from '../utils/get-api-error-message';

const profileOptions = [
  { value: UserProfile.Patient, label: 'Paciente' },
  { value: UserProfile.Doctor, label: 'Médico' },
  { value: UserProfile.Researcher, label: 'Pesquisador' },
];

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegisterUser();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      profile: UserProfile.Patient,
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: RegisterFormData): Promise<void> {
    await registerMutation.mutateAsync(data);
    router.replace('/?registered=success');
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div>
        <label className="text-sm font-bold text-[#343434]" htmlFor="name">
          Nome
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className="mt-2 h-12 w-full rounded-[10px] border border-[#ececec] bg-white px-4 text-sm text-[#343434] shadow-sm transition placeholder:text-[#818894] focus:border-[#43d477] focus:ring-[#43d477]"
          placeholder="Seu nome completo"
          aria-invalid={Boolean(form.formState.errors.name)}
          aria-describedby={form.formState.errors.name ? 'name-error' : undefined}
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="mt-2 text-sm font-medium text-[#f63c3c]" id="name-error">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-bold text-[#343434]" htmlFor="profile">
          Perfil
        </label>
        <select
          id="profile"
          className="mt-2 h-12 w-full rounded-[10px] border border-[#ececec] bg-white px-4 text-sm font-semibold text-[#343434] shadow-sm transition focus:border-[#43d477] focus:ring-[#43d477]"
          aria-invalid={Boolean(form.formState.errors.profile)}
          aria-describedby={form.formState.errors.profile ? 'profile-error' : undefined}
          {...form.register('profile')}
        >
          {profileOptions.map((profile) => (
            <option key={profile.value} value={profile.value}>
              {profile.label}
            </option>
          ))}
        </select>
        {form.formState.errors.profile ? (
          <p className="mt-2 text-sm font-medium text-[#f63c3c]" id="profile-error">
            {form.formState.errors.profile.message}
          </p>
        ) : null}
      </div>

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
          autoComplete="new-password"
          className="mt-2 h-12 w-full rounded-[10px] border border-[#ececec] bg-white px-4 text-sm text-[#343434] shadow-sm transition placeholder:text-[#818894] focus:border-[#43d477] focus:ring-[#43d477]"
          placeholder="Exemplo: Senha@123"
          aria-invalid={Boolean(form.formState.errors.password)}
          aria-describedby={form.formState.errors.password ? 'password-error' : undefined}
          {...form.register('password')}
        />
        <p className="mt-2 text-xs font-medium leading-5 text-[#818894]">
          Use mais de 8 caracteres com maiúscula, minúscula, número e caractere especial.
        </p>
        {form.formState.errors.password ? (
          <p className="mt-2 text-sm font-medium text-[#f63c3c]" id="password-error">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-bold text-[#343434]" htmlFor="confirmPassword">
          Confirmar senha
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="mt-2 h-12 w-full rounded-[10px] border border-[#ececec] bg-white px-4 text-sm text-[#343434] shadow-sm transition placeholder:text-[#818894] focus:border-[#43d477] focus:ring-[#43d477]"
          placeholder="Digite a senha novamente"
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

      {registerMutation.isError ? (
        <div className="rounded-[10px] border border-[#fbb0b0] bg-[#ffdbdf] px-4 py-3 text-sm font-semibold text-[#993838]">
          {getApiErrorMessage(registerMutation.error)}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#43d477] px-6 text-sm font-bold text-white shadow-[0_3px_6px_rgba(64,213,125,0.3)] transition hover:bg-[#1FB354] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {registerMutation.isPending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Criando conta...
          </>
        ) : (
          'Criar conta'
        )}
      </button>
    </form>
  );
}

import { LockKeyhole, TimerReset } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfd]">
      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3" aria-label="Porfiria Academy">
            <Image
              src="https://www.porfiriabr.org/store/1/porfiria.png"
              alt="Porfiria Academy"
              width={174}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          <Link className="text-sm font-bold text-[#1f3b64] hover:text-[#43d477]" href="/register">
            Criar conta
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[0.95fr_1.05fr] md:items-center md:py-16">
        <div className="rounded-[18px] bg-[#1f3b64] p-7 text-white shadow-[0_12px_23px_rgba(62,73,84,0.15)] md:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#43d477]">
            Acesso à plataforma
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
            Entre para continuar sua jornada no Porfiria Academy.
          </h1>
          <p className="mt-5 text-sm leading-7 text-white/80 md:text-base">
            Use seu email e senha para acessar a dashboard inicial. Seu access token é válido por
            30 minutos e a sessão poderá ser renovada com refresh token.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="flex gap-3">
              <LockKeyhole className="mt-0.5 h-5 w-5 flex-none text-[#43d477]" aria-hidden="true" />
              <p className="text-sm font-medium leading-6 text-white/90">
                Autenticação com token de curta duração.
              </p>
            </div>
            <div className="flex gap-3">
              <TimerReset className="mt-0.5 h-5 w-5 flex-none text-[#43d477]" aria-hidden="true" />
              <p className="text-sm font-medium leading-6 text-white/90">
                Refresh token preparado para manter a sessão com segurança.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#ececec] bg-white p-6 shadow-[0_5px_12px_rgba(0,0,0,0.05)] md:p-8">
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#43d477]">
              Bem-vindo de volta
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#1f3b64]">Dados de acesso</h2>
            <p className="mt-2 text-sm leading-6 text-[#818894]">
              Informe suas credenciais para acessar a área autenticada.
            </p>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}

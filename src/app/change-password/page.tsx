import { KeyRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ChangePasswordForm } from '@/features/auth/components/change-password-form';

export default function ChangePasswordPage() {
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

          <Link className="text-sm font-bold text-[#1f3b64] hover:text-[#43d477]" href="/login">
            Login
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[0.95fr_1.05fr] md:items-center md:py-16">
        <div className="rounded-[18px] bg-[#1f3b64] p-7 text-white shadow-[0_12px_23px_rgba(62,73,84,0.15)] md:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#43d477]">
            Seguranca da conta
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
            Crie uma nova senha para continuar.
          </h1>
          <p className="mt-5 text-sm leading-7 text-white/80 md:text-base">
            Este passo e obrigatorio quando sua conta recebe uma senha temporaria por email ou
            quando voce solicita alteracao nas configuracoes.
          </p>
          <div className="mt-8 flex gap-3">
            <KeyRound className="mt-0.5 h-5 w-5 flex-none text-[#43d477]" aria-hidden="true" />
            <p className="text-sm font-medium leading-6 text-white/90">
              A nova senha deve seguir a politica de seguranca da plataforma.
            </p>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#ececec] bg-white p-6 shadow-[0_5px_12px_rgba(0,0,0,0.05)] md:p-8">
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#43d477]">
              Nova senha
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#1f3b64]">Atualize o acesso</h2>
            <p className="mt-2 text-sm leading-6 text-[#818894]">
              Informe sua senha atual ou temporaria e escolha uma nova senha.
            </p>
          </div>

          <ChangePasswordForm />
        </div>
      </section>
    </main>
  );
}

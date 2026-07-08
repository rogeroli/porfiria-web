'use client';

import { CheckCircle2, LoaderCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useConfirmEmail } from '../hooks/use-confirm-email';
import { getApiErrorMessage } from '../utils/get-api-error-message';

export function ConfirmEmailPanel() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const confirmEmailMutation = useConfirmEmail();
  const { mutate } = confirmEmailMutation;

  useEffect(() => {
    if (token) {
      mutate(token);
    }
  }, [mutate, token]);

  if (!token) {
    return (
      <div className="rounded-[18px] border border-[#fbb0b0] bg-white p-7 text-center shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
        <XCircle className="mx-auto h-12 w-12 text-[#f63c3c]" aria-hidden="true" />
        <h1 className="mt-5 text-2xl font-bold text-[#1f3b64]">Link invalido</h1>
        <p className="mt-3 text-sm leading-6 text-[#818894]">
          Nao encontramos o token de confirmacao neste link.
        </p>
        <LoginLink />
      </div>
    );
  }

  if (confirmEmailMutation.isPending || confirmEmailMutation.isIdle) {
    return (
      <div className="rounded-[18px] border border-[#ececec] bg-white p-7 text-center shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
        <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-[#43d477]" aria-hidden="true" />
        <h1 className="mt-5 text-2xl font-bold text-[#1f3b64]">Confirmando email</h1>
        <p className="mt-3 text-sm leading-6 text-[#818894]">
          Estamos validando seu link de confirmacao.
        </p>
      </div>
    );
  }

  if (confirmEmailMutation.isError) {
    return (
      <div className="rounded-[18px] border border-[#fbb0b0] bg-white p-7 text-center shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
        <XCircle className="mx-auto h-12 w-12 text-[#f63c3c]" aria-hidden="true" />
        <h1 className="mt-5 text-2xl font-bold text-[#1f3b64]">Nao foi possivel confirmar</h1>
        <p className="mt-3 text-sm leading-6 text-[#818894]">
          {getApiErrorMessage(confirmEmailMutation.error)}
        </p>
        <LoginLink />
      </div>
    );
  }

  return (
    <div className="rounded-[18px] border border-[#c4e4da] bg-white p-7 text-center shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
      <CheckCircle2 className="mx-auto h-12 w-12 text-[#43d477]" aria-hidden="true" />
      <h1 className="mt-5 text-2xl font-bold text-[#1f3b64]">Email confirmado</h1>
      <p className="mt-3 text-sm leading-6 text-[#818894]">
        Sua conta foi ativada. Agora voce ja pode acessar a plataforma.
      </p>
      <LoginLink />
    </div>
  );
}

function LoginLink() {
  return (
    <Link
      className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#43d477] px-6 text-sm font-bold text-white shadow-[0_3px_6px_rgba(64,213,125,0.3)] transition hover:bg-[#1FB354]"
      href="/login"
    >
      Ir para login
    </Link>
  );
}

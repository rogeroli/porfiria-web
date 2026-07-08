import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { ConfirmEmailPanel } from '@/features/auth/components/confirm-email-panel';

export default function ConfirmEmailPage() {
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

      <section className="mx-auto flex max-w-xl px-5 py-16 md:py-24">
        <Suspense
          fallback={
            <div className="w-full rounded-[18px] border border-[#ececec] bg-white p-7 text-center text-sm font-semibold text-[#818894] shadow-[0_5px_12px_rgba(0,0,0,0.05)]">
              Carregando confirmacao...
            </div>
          }
        >
          <ConfirmEmailPanel />
        </Suspense>
      </section>
    </main>
  );
}

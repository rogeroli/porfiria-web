'use client';

import {
  BookOpenCheck,
  GraduationCap,
  LogOut,
  Settings,
  ShieldCheck,
  UserRoundCog,
  UsersRound,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logoutUser } from '@/services/auth/auth-service';
import { AuthSession, UserProfile, UserStatus } from '../types/auth';
import { clearAuthSession, getAuthSession, getRefreshToken } from '../utils/auth-storage';

const profileLabels: Record<UserProfile, string> = {
  [UserProfile.Patient]: 'Paciente',
  [UserProfile.Doctor]: 'Médico',
  [UserProfile.Researcher]: 'Pesquisador',
};

const summaryCards = [
  {
    title: 'Trilhas disponíveis',
    value: '6',
    description: 'Módulos educacionais mockados',
    icon: GraduationCap,
  },
  {
    title: 'Comunidade',
    value: '128',
    description: 'Participantes simulados',
    icon: UsersRound,
  },
  {
    title: 'Conteúdos revisados',
    value: '24',
    description: 'Materiais em preparação',
    icon: BookOpenCheck,
  },
];

export function DashboardShell() {
  const router = useRouter();
  const [session, setSession] = useState<(AuthSession & { expiresAt: number }) | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSession(getAuthSession());
      setHasMounted(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    if (!session) {
      router.replace('/login');
      return;
    }

    if (session.user.status === UserStatus.Pending) {
      clearAuthSession();
      router.replace('/login?reason=email-pending');
      return;
    }

    if (session.mustChangePassword) {
      router.replace('/change-password');
      return;
    }

    if (session.user.status !== UserStatus.Available) {
      clearAuthSession();
      router.replace('/login');
    }
  }, [hasMounted, router, session]);

  async function handleLogout(): Promise<void> {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } finally {
      clearAuthSession();
      router.replace('/login');
    }
  }

  if (!hasMounted || !session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#fbfbfd]">
      <header className="border-b border-[#ececec] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Image
            src="https://www.porfiriabr.org/store/1/porfiria.png"
            alt="Porfiria Academy"
            width={174}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />

          <div className="relative">
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#ececec] bg-white px-4 text-sm font-bold text-[#1f3b64] shadow-sm transition hover:border-[#43d477]"
              onClick={() => setIsSettingsOpen((current) => !current)}
              aria-expanded={isSettingsOpen}
              aria-haspopup="menu"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              Configurações
            </button>

            {isSettingsOpen ? (
              <div
                className="absolute right-0 z-10 mt-3 w-64 rounded-[15px] border border-[#ececec] bg-white p-3 shadow-[0_12px_23px_rgba(62,73,84,0.15)]"
                role="menu"
              >
                <div className="border-b border-[#ececec] px-3 py-3">
                  <p className="text-sm font-bold text-[#343434]">{session.user.name}</p>
                  <p className="mt-1 text-xs font-medium text-[#818894]">{session.user.email}</p>
                </div>
                <button
                  type="button"
                  className="mt-2 flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-left text-sm font-semibold text-[#343434] transition hover:bg-[#f7fafd]"
                  onClick={() => router.push('/change-password')}
                  role="menuitem"
                >
                  <UserRoundCog className="h-4 w-4 text-[#43d477]" aria-hidden="true" />
                  Alterar senha
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-left text-sm font-semibold text-[#f63c3c] transition hover:bg-[#ffdbdf]"
                  onClick={handleLogout}
                  role="menuitem"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sair
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="rounded-[18px] bg-[#1f3b64] p-7 text-white shadow-[0_12px_23px_rgba(62,73,84,0.15)] md:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#43d477]">
            Dashboard
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                Olá, {session.user.name}.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
                Esta é uma visão inicial mockada da sua área autenticada. Os próximos módulos
                trarão cursos, trilhas, comunidade e informações personalizadas.
              </p>
            </div>
            <div className="rounded-[15px] border border-white/20 bg-white/10 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#43d477]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold">{profileLabels[session.user.profile]}</p>
                  <p className="text-xs text-white/70">Sessão autenticada</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {summaryCards.map((card) => (
            <article
              className="rounded-[15px] border border-[#ececec] bg-white p-6 shadow-[0_5px_12px_rgba(0,0,0,0.05)]"
              key={card.title}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f4f0] text-[#43d477]">
                <card.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm font-bold text-[#818894]">{card.title}</p>
              <p className="mt-2 text-4xl font-bold text-[#1f3b64]">{card.value}</p>
              <p className="mt-3 text-sm leading-6 text-[#6f7682]">{card.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

import {
  ArrowRight,
  BookOpenCheck,
  GraduationCap,
  HeartPulse,
  Network,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const pillars = [
  {
    title: 'Educação contínua',
    description:
      'Cursos, trilhas e conteúdos essenciais para ampliar o conhecimento sobre porfirias com linguagem clara e rigor técnico.',
    icon: GraduationCap,
  },
  {
    title: 'Apoio à jornada clínica',
    description:
      'Base preparada para organizar orientações, acompanhamento e tomada de decisão entre pacientes e profissionais de saúde.',
    icon: HeartPulse,
  },
  {
    title: 'Comunidade científica',
    description:
      'Ambiente para aproximar médicos, pesquisadores, tutores e centros acadêmicos em torno de colaboração e produção científica.',
    icon: Network,
  },
];

const audiences = [
  { label: 'Pacientes', icon: UsersRound },
  { label: 'Médicos', icon: ShieldCheck },
  { label: 'Pesquisadores', icon: BookOpenCheck },
];

interface HomePageProps {
  searchParams: Promise<{
    registered?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const shouldShowRegistrationSuccess = params.registered === 'success';

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

          <nav aria-label="Navegação principal" className="hidden items-center gap-7 md:flex">
            <a className="text-sm font-semibold text-[#343434] hover:text-[#1f3b64]" href="#sistema">
              Sistema
            </a>
            <a className="text-sm font-semibold text-[#343434] hover:text-[#1f3b64]" href="#pilares">
              Pilares
            </a>
            <a className="text-sm font-semibold text-[#343434] hover:text-[#1f3b64]" href="#acesso">
              Acesso
            </a>
          </nav>

          <Link
            href="/register"
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#43d477] px-5 text-sm font-bold text-white shadow-[0_3px_6px_rgba(64,213,125,0.3)] transition hover:bg-[#1FB354]"
          >
            Comece agora
          </Link>
        </div>
      </header>

      <section id="sistema" className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-20">
          <div>
            {shouldShowRegistrationSuccess ? (
              <div
                className="mb-5 rounded-[10px] border border-[#c4e4da] bg-[#e7f4f0] px-4 py-3 text-sm font-semibold leading-6 text-[#1f3b64]"
                role="status"
              >
                Cadastro realizado com sucesso. Em breve você poderá acessar a plataforma com seu
                login.
              </div>
            ) : null}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c4e4da] bg-[#e7f4f0] px-4 py-2 text-sm font-bold text-[#1f3b64]">
              <Sparkles className="h-4 w-4 text-[#43d477]" aria-hidden="true" />
              Plataforma educacional e colaborativa
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-[#1f3b64] md:text-6xl">
              Conhecimento, cuidado e colaboração na luta contra a Porfiria
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#6f7682] md:text-lg">
              O Porfiria Academy nasce para conectar educação médica, orientação ao paciente,
              pesquisa e gestão em uma experiência digital preparada para crescer junto aos
              próximos módulos da plataforma.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#43d477] px-6 text-sm font-bold text-white shadow-[0_10px_30px_rgba(67,212,119,0.3)] transition hover:bg-[#1FB354]"
              >
                Criar minha conta
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#1f3b64] px-6 text-sm font-bold text-[#1f3b64] transition hover:bg-[#1f3b64] hover:text-white"
          >
            Acessar plataforma
              </Link>
            </div>
          </div>

          <div className="relative rounded-[18px] border border-[#ececec] bg-[#f7fafd] p-5 shadow-[0_12px_23px_rgba(62,73,84,0.07)]">
            <div className="rounded-[15px] bg-white p-5 shadow-[0_3px_15px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between border-b border-[#ececec] pb-4">
                <div>
                  <p className="text-sm font-bold text-[#43d477]">Porfiria Academy</p>
                  <p className="mt-1 text-xs font-medium text-[#818894]">Visão da plataforma</p>
                </div>
                <div className="rounded-full bg-[#ffab00] px-3 py-1 text-xs font-bold text-white">
                  Em evolução
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {audiences.map((audience) => (
                  <div
                    className="flex items-center gap-4 rounded-[10px] border border-[#ececec] bg-[#fbfbfd] p-4"
                    key={audience.label}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f4f0] text-[#43d477]">
                      <audience.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-bold text-[#343434]">{audience.label}</p>
                      <p className="text-sm text-[#818894]">Conteúdo, jornada e colaboração</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pilares" className="border-y border-[#ececec] bg-[#fbfbfd]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#43d477]">
              Pilares do sistema
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#1f3b64] md:text-4xl">
              Uma base única para aprendizado, acompanhamento e comunidade
            </h2>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article
                className="rounded-[15px] border border-[#ececec] bg-white p-6 shadow-[0_5px_12px_rgba(0,0,0,0.05)]"
                key={pillar.title}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f4f0] text-[#43d477]">
                  <pillar.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#1f3b64]">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6f7682]">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="acesso" className="bg-[#1f3b64]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#43d477]">
              Próximo passo
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold text-white">
              A página de login será o primeiro fluxo integrado entre web e API.
            </h2>
          </div>
          <Link
            href="/register"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-[#1f3b64]"
          >
            Criar conta
          </Link>
        </div>
      </section>
    </main>
  );
}

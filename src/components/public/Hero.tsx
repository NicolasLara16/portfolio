"use client";

import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SiClaude, SiGooglegemini } from "react-icons/si";
import {
  TbArrowUpRight,
  TbBrandOpenai,
  TbMail,
  TbMapPin,
  TbTerminal2,
} from "react-icons/tb";
import Reveal from "@/components/shared/Reveal";
import { btnOutline, btnPrimary } from "@/components/shared/buttons";
import { useProfile } from "@/hooks/useProfile";

const AI_TOOLS = [
  { name: "Gemini", Icon: SiGooglegemini },
  { name: "ChatGPT", Icon: TbBrandOpenai },
  { name: "Claude", Icon: SiClaude },
  { name: "OpenCode", Icon: TbTerminal2 },
];

export default function Hero() {
  const profile = useProfile();

  return (
    <section id="sobre" className="relative overflow-hidden pt-28 md:pt-36">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-48 h-72 w-72 rounded-full bg-accent-2/10 blur-3xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 sm:px-6 md:pb-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-2/30 bg-accent-2/10 px-3 py-1 text-xs font-medium text-accent-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-2 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-2" />
              </span>
              Disponível para oportunidades
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Nicolas Gerardo{" "}
              <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                Chagas Lara
              </span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-3 text-lg font-medium text-slate-300">{profile.role}</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-400">
              <TbMapPin size={15} className="text-accent" /> {profile.location}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-5 max-w-xl leading-relaxed text-slate-400">
              {profile.summary}
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#projetos" className={btnPrimary}>
                Ver projetos <TbArrowUpRight size={16} />
              </a>
              <a href="#contato" className={btnOutline}>
                Fale comigo
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-7 flex items-center gap-3">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="rounded-lg border border-ink-700 p-2.5 text-slate-300 transition-colors hover:border-accent/60 hover:text-accent"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="rounded-lg border border-ink-700 p-2.5 text-slate-300 transition-colors hover:border-accent/60 hover:text-accent"
              >
                <FaGithub size={18} />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="E-mail"
                title="E-mail"
                className="rounded-lg border border-ink-700 p-2.5 text-slate-300 transition-colors hover:border-accent/60 hover:text-accent"
              >
                <TbMail size={18} />
              </a>
              <a
                href={profile.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp"
                className="rounded-lg border border-ink-700 p-2.5 text-slate-300 transition-colors hover:border-accent/60 hover:text-accent"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="w-full max-w-md lg:justify-self-end">
          <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/80 shadow-2xl shadow-accent/5 backdrop-blur">
            <div className="flex items-center gap-2 border-b border-ink-800 bg-ink-850 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-slate-500">
                nicolas@dados: ~/portfolio
              </span>
            </div>
            <div className="space-y-2.5 p-5 font-mono text-[13px] leading-relaxed">
              <p>
                <span className="text-accent-2">$</span>{" "}
                <span className="text-accent">whoami</span>
              </p>
              <p className="text-slate-300">
                {profile.name} — {profile.location}
              </p>
              <p>
                <span className="text-accent-2">$</span>{" "}
                <span className="text-accent">formacao --list</span>
              </p>
              <ul className="space-y-1.5 text-slate-300">
                {profile.education.map((e) => (
                  <li key={e.title} className="flex gap-2">
                    <span className="text-accent-2">▸</span>
                    <span>
                      {e.title}{" "}
                      <span className="text-slate-500">
                        — {e.institution} ({e.period})
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <p>
                <span className="text-accent-2">$</span>{" "}
                <span className="text-accent">foco</span>
              </p>
              <p className="text-slate-300">
                insights estratégicos · automação com IAs generativas · engenharia
                de dados
                <span className="ml-1.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-accent" />
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              IAs no dia a dia:
            </span>
            {AI_TOOLS.map(({ name, Icon }) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-600 bg-ink-850 px-3 py-1 text-xs text-slate-300"
              >
                <Icon size={12} className="text-accent" /> {name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

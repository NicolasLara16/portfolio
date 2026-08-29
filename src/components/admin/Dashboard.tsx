"use client";

import { useState } from "react";
import { TbExternalLink, TbLogout } from "react-icons/tb";
import { useAuth } from "@/hooks/useAuth";
import SkillsManager from "./SkillsManager";
import SoftSkillsManager from "./SoftSkillsManager";
import CertificationsManager from "./CertificationsManager";
import ProjectsManager from "./ProjectsManager";
import ProfileManager from "./ProfileManager";

const TABS = [
  { key: "profile", label: "Perfil & Contato" },
  { key: "skills", label: "Hard Skills" },
  { key: "soft", label: "Soft Skills" },
  { key: "certifications", label: "Certificações" },
  { key: "projects", label: "Projetos" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function Dashboard({ userEmail }: { userEmail: string }) {
  const [tab, setTab] = useState<TabKey>("profile");
  const { logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-800 bg-ink-950/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <a href="/admin" className="font-mono text-lg font-bold text-white">
            <span className="text-accent">&lt;</span>NG
            <span className="text-accent"> /&gt;</span>
            <span className="ml-2 text-xs font-normal text-slate-500">admin</span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-accent sm:inline-flex"
            >
              <TbExternalLink size={15} /> Ver site
            </a>
            <span className="hidden max-w-[220px] truncate text-sm text-slate-500 md:block">
              {userEmail}
            </span>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-600 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-red-500/40 hover:text-red-400"
            >
              <TbLogout size={15} /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-white">Gerenciar conteúdo</h1>
        <p className="mt-1 text-sm text-slate-400">
          Todas as alterações são publicadas no portfólio em tempo real.
        </p>

        <div
          role="tablist"
          aria-label="Seções gerenciáveis"
          className="mt-6 flex flex-wrap gap-2"
        >
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                tab === key
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-ink-700 bg-ink-900/70 text-slate-300 hover:border-ink-600 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "profile" && <ProfileManager />}
          {tab === "skills" && <SkillsManager />}
          {tab === "soft" && <SoftSkillsManager />}
          {tab === "certifications" && <CertificationsManager />}
          {tab === "projects" && <ProjectsManager />}
        </div>
      </main>
    </div>
  );
}

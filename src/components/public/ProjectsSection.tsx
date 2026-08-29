"use client";

import { useEffect, useState } from "react";
import { SiGithub } from "react-icons/si";
import {
  TbCode,
  TbExternalLink,
  TbFolder,
  TbLoader,
  TbX,
} from "react-icons/tb";
import SectionHeading from "./SectionHeading";
import EmptyState from "@/components/shared/EmptyState";
import Reveal from "@/components/shared/Reveal";
import { btnOutline, btnOutlineSm, btnPrimary } from "@/components/shared/buttons";
import { useCollection } from "@/hooks/useCollection";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { Project } from "@/lib/types";

export default function ProjectsSection() {
  const { data: projects, loading } = useCollection<Project>("projects");
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section id="projetos" className="py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Projetos"
          title="Projetos em destaque"
          description="Análises, dashboards e automações que mostram a aplicação prática de dados, SQL, Python e BI."
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <TbLoader size={28} className="animate-spin text-accent" />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            message="Nenhum projeto publicado ainda."
            hint={
              isFirebaseConfigured
                ? "Adicione projetos pelo painel administrativo."
                : "Configure o Firebase (.env.local) para carregar o conteúdo dinâmico."
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={(i % 3) * 60}>
                <article className="flex h-full flex-col rounded-2xl border border-ink-700 bg-ink-900/70 p-5 transition-colors hover:border-accent/40">
                  <div className="flex items-start justify-between">
                    <span className="rounded-lg bg-accent-2/10 p-2.5 text-accent-2">
                      <TbFolder size={20} />
                    </span>
                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Repositório de ${project.title}`}
                          title="Repositório no GitHub"
                          className="text-slate-400 transition-colors hover:text-accent"
                        >
                          <SiGithub size={18} />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Demonstração de ${project.title}`}
                          title="Demonstração / Deploy"
                          className="text-slate-400 transition-colors hover:text-accent"
                        >
                          <TbExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                  <h3 className="mt-4 font-semibold leading-snug text-white">
                    {project.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-ink-600 bg-ink-850 px-2.5 py-0.5 text-[11px] text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4">
                    <button
                      type="button"
                      onClick={() => setSelected(project)}
                      className={`${btnOutlineSm} w-full`}
                    >
                      <TbCode size={14} /> Ver detalhes
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Detalhes do projeto ${selected.title}`}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-ink-700 bg-ink-900 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Fechar"
              className="absolute right-4 top-4 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-ink-800 hover:text-white"
            >
              <TbX size={18} />
            </button>
            <span className="inline-flex rounded-lg bg-accent-2/10 p-2.5 text-accent-2">
              <TbFolder size={20} />
            </span>
            <h3 className="mt-4 pr-8 text-xl font-bold text-white">
              {selected.title}
            </h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-300">
              {selected.description}
            </p>
            {selected.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-ink-600 bg-ink-850 px-3 py-1 text-xs text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {selected.githubUrl && (
                <a
                  href={selected.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btnPrimary} flex-1`}
                >
                  <SiGithub size={16} /> Repositório
                </a>
              )}
              {selected.demoUrl && (
                <a
                  href={selected.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btnOutline} flex-1`}
                >
                  Demonstração <TbExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import { TbCode, TbLoader, TbSparkles } from "react-icons/tb";
import SectionHeading from "./SectionHeading";
import EmptyState from "@/components/shared/EmptyState";
import Reveal from "@/components/shared/Reveal";
import { useCollection } from "@/hooks/useCollection";
import { getSkillIcon } from "@/lib/iconMap";
import { isFirebaseConfigured } from "@/lib/firebase";
import { SKILL_CATEGORIES, levelLabel, normalizeLevel, type Skill, type SoftSkill } from "@/lib/types";

const LEVEL_STYLES: Record<string, string> = {
  iniciante: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
  intermediario: "border-accent/40 bg-accent/10 text-accent",
  avancado: "border-accent-2/40 bg-accent-2/10 text-accent-2",
};

interface SkillGroup {
  key: string;
  label: string;
  items: Skill[];
}

export default function SkillsSection() {
  const { data: skills, loading } = useCollection<Skill>("skills");
  const { data: softSkills } = useCollection<SoftSkill>("softSkills");

  const groups: SkillGroup[] = SKILL_CATEGORIES.map((cat) => ({
    key: cat.key,
    label: cat.label,
    items: skills.filter((s) => s.category === cat.key),
  }));
  const others = skills.filter(
    (s) => !SKILL_CATEGORIES.some((c) => c.key === s.category)
  );
  if (others.length) {
    groups.push({ key: "outros", label: "Outros", items: others });
  }

  return (
    <section id="habilidades" className="py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Habilidades"
          title="Tecnologias & Competências"
          description="Hard skills organizadas por área de atuação, com nível de dominância. Conteúdo carregado dinamicamente do banco de dados."
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <TbLoader size={28} className="animate-spin text-accent" />
          </div>
        ) : skills.length === 0 ? (
          <EmptyState
            message="Nenhuma hard skill cadastrada ainda."
            hint={
              isFirebaseConfigured
                ? "Adicione skills pelo painel administrativo."
                : "Configure o Firebase (.env.local) para carregar o conteúdo dinâmico."
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {groups
              .filter((g) => g.items.length > 0)
              .map((group, gi) => (
                <Reveal key={group.key} delay={gi * 60}>
                  <div className="h-full rounded-2xl border border-ink-700 bg-ink-900/70 p-5 md:p-6">
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent">
                      <TbCode size={16} /> {group.label}
                    </h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {group.items.map((skill) => {
                        const Icon = getSkillIcon(skill.iconKey);
                        const levelKey = normalizeLevel(skill.level);
                        return (
                          <div
                            key={skill.id}
                            className="flex items-center gap-2.5 rounded-xl border border-ink-700 bg-ink-850/60 p-3.5 transition-colors hover:border-accent/40"
                          >
                            <Icon size={20} className="shrink-0 text-accent" />
                            <p className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                              {skill.name}
                            </p>
                            <span
                              className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${LEVEL_STYLES[levelKey]}`}
                            >
                              {levelLabel(levelKey)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              ))}
          </div>
        )}

        {softSkills.length > 0 && (
          <Reveal delay={120} className="mt-8">
            <div className="rounded-2xl border border-ink-700 bg-ink-900/70 p-5 md:p-6">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent-2">
                <TbSparkles size={16} /> Soft Skills
              </h3>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {softSkills.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-full border border-accent-2/25 bg-accent-2/5 px-4 py-1.5 text-sm text-slate-200"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

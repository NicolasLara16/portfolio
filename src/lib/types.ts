export interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  iconKey: string;
  order: number;
}

export const SKILL_LEVELS = [
  { key: "iniciante", label: "Iniciante" },
  { key: "intermediario", label: "Intermediário" },
  { key: "avancado", label: "Avançado" },
] as const;

export type SkillLevelKey = (typeof SKILL_LEVELS)[number]["key"];

export function levelLabel(key: string): string {
  return SKILL_LEVELS.find((l) => l.key === key)?.label ?? "Iniciante";
}

/** Converte dados legados (nível numérico 0–100) ou inválidos para o nível atual. */
export function normalizeLevel(level: unknown): SkillLevelKey {
  if (typeof level === "number") {
    return level <= 39 ? "iniciante" : level <= 69 ? "intermediario" : "avancado";
  }
  const key = String(level).toLowerCase();
  return SKILL_LEVELS.some((l) => l.key === key) ? (key as SkillLevelKey) : "iniciante";
}

export interface SoftSkill {
  id: string;
  name: string;
  order: number;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  hours: string;
  date: string;
  certUrl: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  demoUrl: string;
  order: number;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  email: string;
  whatsapp: string;
  whatsappLink: string;
  linkedin: string;
  github: string;
  summary: string;
  education: { title: string; institution: string; period: string }[];
}

export const SKILL_CATEGORIES = [
  { key: "analise", label: "Análise & Linguagens" },
  { key: "dados", label: "Data Science & Automation" },
  { key: "bi", label: "Business Intelligence" },
  { key: "ia", label: "Inteligência Artificial" },
  { key: "infra", label: "Infraestrutura & Ferramentas" },
] as const;

export type SkillCategoryKey = (typeof SKILL_CATEGORIES)[number]["key"];

export function categoryLabel(key: string): string {
  return SKILL_CATEGORIES.find((c) => c.key === key)?.label ?? "Outros";
}

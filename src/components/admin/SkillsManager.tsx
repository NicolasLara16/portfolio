"use client";

import { useState, type FormEvent } from "react";
import { TbLoader, TbPencil, TbPlus, TbTrash, TbX } from "react-icons/tb";
import { useCollection } from "@/hooks/useCollection";
import { addItem, removeItem, updateItem } from "@/lib/services";
import { sanitizeText } from "@/lib/sanitize";
import { ICON_OPTIONS, getSkillIcon } from "@/lib/iconMap";
import {
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  levelLabel,
  normalizeLevel,
  type Skill,
} from "@/lib/types";
import {
  btnDanger,
  btnEdit,
  btnPrimary,
  inputCls,
  labelCls,
} from "./formStyles";

const LEVEL_STYLES: Record<string, string> = {
  iniciante: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
  intermediario: "border-accent/40 bg-accent/10 text-accent",
  avancado: "border-accent-2/40 bg-accent-2/10 text-accent-2",
};

interface FormState {
  name: string;
  category: string;
  iconKey: string;
  level: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  category: "analise",
  iconKey: "SQL",
  level: "intermediario",
};

function nextOrder(skills: Skill[]): number {
  return skills.length ? Math.max(...skills.map((s) => s.order ?? 0)) + 1 : 1;
}

export default function SkillsManager() {
  const { data: skills, loading } = useCollection<Skill>("skills");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function startEdit(skill: Skill) {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      iconKey: skill.iconKey,
      level: normalizeLevel(skill.level),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const name = sanitizeText(form.name);
    if (!name) {
      setError("Informe o nome da tecnologia.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name,
        category: form.category,
        iconKey: form.iconKey,
        level: form.level,
        order: editingId
          ? (skills.find((s) => s.id === editingId)?.order ?? 0)
          : nextOrder(skills),
      };
      if (editingId) {
        await updateItem("skills", editingId, payload);
      } else {
        await addItem("skills", payload);
      }
      cancelEdit();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(skill: Skill) {
    if (!window.confirm(`Remover a skill "${skill.name}"?`)) return;
    try {
      await removeItem("skills", skill.id);
      if (editingId === skill.id) cancelEdit();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink-700 bg-ink-900/70 p-5 md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">
            {editingId ? "Editar skill" : "Adicionar skill"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
            >
              <TbX size={14} /> Cancelar edição
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="skill-name" className={labelCls}>
              Nome da tecnologia
            </label>
            <input
              id="skill-name"
              type="text"
              maxLength={60}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex.: Python, Power BI..."
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="skill-category" className={labelCls}>
              Categoria
            </label>
            <select
              id="skill-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputCls}
            >
              {SKILL_CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="skill-icon" className={labelCls}>
              Ícone
            </label>
            <select
              id="skill-icon"
              value={form.iconKey}
              onChange={(e) => setForm({ ...form, iconKey: e.target.value })}
              className={inputCls}
            >
              {ICON_OPTIONS.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="skill-level" className={labelCls}>
              Nível de dominância
            </label>
            <select
              id="skill-level"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className={inputCls}
            >
              {SKILL_LEVELS.map((lvl) => (
                <option key={lvl.key} value={lvl.key}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400 sm:col-span-2"
            >
              {error}
            </p>
          )}

          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? (
                <TbLoader size={16} className="animate-spin" />
              ) : (
                <TbPlus size={16} />
              )}
              {editingId ? "Salvar alterações" : "Adicionar skill"}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-5">
        {loading ? (
          <p className="text-sm text-slate-400">Carregando skills...</p>
        ) : skills.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink-600 p-6 text-center text-sm text-slate-400">
            Nenhuma skill cadastrada. Use o formulário acima para começar.
          </p>
        ) : (
          SKILL_CATEGORIES.map((cat) => {
            const items = skills.filter((s) => s.category === cat.key);
            if (!items.length) return null;
            return (
              <div key={cat.key} className="rounded-2xl border border-ink-700 bg-ink-900/70 p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-accent">
                  {cat.label}
                </h3>
                <ul className="mt-3 space-y-2">
                  {items.map((skill) => {
                    const Icon = getSkillIcon(skill.iconKey);
                    const levelKey = normalizeLevel(skill.level);
                    return (
                      <li
                        key={skill.id}
                        className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-850/60 px-3.5 py-2.5"
                      >
                        <Icon size={18} className="shrink-0 text-accent" />
                        <span className="min-w-0 flex-1 truncate text-sm text-white">
                          {skill.name}
                        </span>
                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${LEVEL_STYLES[levelKey]}`}
                        >
                          {levelLabel(levelKey)}
                        </span>
                        <button
                          type="button"
                          onClick={() => startEdit(skill)}
                          aria-label={`Editar ${skill.name}`}
                          className={btnEdit}
                        >
                          <TbPencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(skill)}
                          aria-label={`Remover ${skill.name}`}
                          className={btnDanger}
                        >
                          <TbTrash size={15} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}

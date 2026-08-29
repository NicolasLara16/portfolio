"use client";

import { useState, type FormEvent } from "react";
import { TbLoader, TbPlus, TbX } from "react-icons/tb";
import { useCollection } from "@/hooks/useCollection";
import { addItem, removeItem } from "@/lib/services";
import { sanitizeText } from "@/lib/sanitize";
import type { SoftSkill } from "@/lib/types";
import { btnPrimary, inputCls, labelCls } from "./formStyles";

export default function SoftSkillsManager() {
  const { data: softSkills, loading } = useCollection<SoftSkill>("softSkills");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const clean = sanitizeText(name);
    if (!clean) {
      setError("Informe o nome da competência.");
      return;
    }
    if (softSkills.some((s) => s.name.toLowerCase() === clean.toLowerCase())) {
      setError("Essa competência já foi adicionada.");
      return;
    }
    setSaving(true);
    try {
      const order = softSkills.length
        ? Math.max(...softSkills.map((s) => s.order ?? 0)) + 1
        : 1;
      await addItem("softSkills", { name: clean, order });
      setName("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(skill: SoftSkill) {
    if (!window.confirm(`Remover a soft skill "${skill.name}"?`)) return;
    try {
      await removeItem("softSkills", skill.id);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink-700 bg-ink-900/70 p-5 md:p-6">
        <h2 className="font-semibold text-white">Adicionar soft skill</h2>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1">
            <label htmlFor="soft-name" className={labelCls}>
              Competência comportamental
            </label>
            <input
              id="soft-name"
              type="text"
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Resolução de Problemas Complexos"
              className={inputCls}
            />
          </div>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? (
              <TbLoader size={16} className="animate-spin" />
            ) : (
              <TbPlus size={16} />
            )}
            Adicionar
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
          >
            {error}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-ink-700 bg-ink-900/70 p-5 md:p-6">
        <h2 className="font-semibold text-white">Competências cadastradas</h2>
        {loading ? (
          <p className="mt-3 text-sm text-slate-400">Carregando...</p>
        ) : softSkills.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">
            Nenhuma soft skill cadastrada ainda.
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {softSkills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-2 rounded-full border border-accent-2/25 bg-accent-2/5 px-4 py-1.5 text-sm text-slate-200"
              >
                {skill.name}
                <button
                  type="button"
                  onClick={() => void handleRemove(skill)}
                  aria-label={`Remover ${skill.name}`}
                  className="text-slate-500 transition-colors hover:text-red-400"
                >
                  <TbX size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

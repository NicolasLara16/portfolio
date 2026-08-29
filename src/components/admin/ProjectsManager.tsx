"use client";

import { useState, type FormEvent } from "react";
import { SiGithub } from "react-icons/si";
import {
  TbExternalLink,
  TbLoader,
  TbPencil,
  TbPlus,
  TbTrash,
  TbX,
} from "react-icons/tb";
import { useCollection } from "@/hooks/useCollection";
import { addItem, removeItem, updateItem } from "@/lib/services";
import { parseTags, sanitizeMultiline, sanitizeText, sanitizeUrl } from "@/lib/sanitize";
import type { Project } from "@/lib/types";
import {
  btnDanger,
  btnEdit,
  btnPrimary,
  inputCls,
  labelCls,
} from "./formStyles";

interface FormState {
  title: string;
  description: string;
  tags: string;
  githubUrl: string;
  demoUrl: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  tags: "",
  githubUrl: "",
  demoUrl: "",
};

export default function ProjectsManager() {
  const { data: projects, loading } = useCollection<Project>("projects");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function startEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      tags: project.tags.join(", "),
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
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
    const title = sanitizeText(form.title);
    const description = sanitizeMultiline(form.description);
    if (!title || !description) {
      setError("Preencha o título e a descrição do projeto.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title,
        description,
        tags: parseTags(form.tags),
        githubUrl: sanitizeUrl(form.githubUrl),
        demoUrl: sanitizeUrl(form.demoUrl),
        order: editingId
          ? (projects.find((p) => p.id === editingId)?.order ?? 0)
          : projects.length
            ? Math.max(...projects.map((p) => p.order ?? 0)) + 1
            : 1,
      };
      if (editingId) {
        await updateItem("projects", editingId, payload);
      } else {
        await addItem("projects", payload);
      }
      cancelEdit();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(project: Project) {
    if (!window.confirm(`Remover o projeto "${project.title}"?`)) return;
    try {
      await removeItem("projects", project.id);
      if (editingId === project.id) cancelEdit();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink-700 bg-ink-900/70 p-5 md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">
            {editingId ? "Editar projeto" : "Adicionar projeto"}
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
          <div className="sm:col-span-2">
            <label htmlFor="project-title" className={labelCls}>
              Título
            </label>
            <input
              id="project-title"
              type="text"
              maxLength={100}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex.: Dashboard de Vendas em Power BI"
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="project-description" className={labelCls}>
              Descrição
            </label>
            <textarea
              id="project-description"
              rows={4}
              maxLength={1200}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descreva o objetivo, os dados utilizados e os resultados..."
              className={`${inputCls} resize-y`}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="project-tags" className={labelCls}>
              Tecnologias (separadas por vírgula)
            </label>
            <input
              id="project-tags"
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="Ex.: Python, SQL, Power BI"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="project-github" className={labelCls}>
              Link do repositório (GitHub)
            </label>
            <input
              id="project-github"
              type="url"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              placeholder="https://github.com/usuario/repo"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="project-demo" className={labelCls}>
              Link da demonstração (opcional)
            </label>
            <input
              id="project-demo"
              type="url"
              value={form.demoUrl}
              onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
              placeholder="https://demo.exemplo.com"
              className={inputCls}
            />
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
              {editingId ? "Salvar alterações" : "Adicionar projeto"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-ink-700 bg-ink-900/70 p-5 md:p-6">
        <h2 className="font-semibold text-white">Projetos cadastrados</h2>
        {loading ? (
          <p className="mt-3 text-sm text-slate-400">Carregando...</p>
        ) : projects.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">
            Nenhum projeto cadastrado ainda.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-850/60 px-3.5 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {project.title}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {project.tags.join(" · ") || "Sem tags"}
                  </p>
                </div>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GitHub de ${project.title}`}
                    className={btnEdit}
                  >
                    <SiGithub size={15} />
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Demo de ${project.title}`}
                    className={btnEdit}
                  >
                    <TbExternalLink size={15} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => startEdit(project)}
                  aria-label={`Editar ${project.title}`}
                  className={btnEdit}
                >
                  <TbPencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(project)}
                  aria-label={`Remover ${project.title}`}
                  className={btnDanger}
                >
                  <TbTrash size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

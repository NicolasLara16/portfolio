"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  TbExternalLink,
  TbFileText,
  TbLoader,
  TbPencil,
  TbPlus,
  TbTrash,
  TbUpload,
  TbX,
} from "react-icons/tb";
import { useCollection } from "@/hooks/useCollection";
import { addItem, removeItem, updateItem, uploadCertificate } from "@/lib/services";
import { sanitizeText, sanitizeUrl } from "@/lib/sanitize";
import type { Certification } from "@/lib/types";
import {
  btnDanger,
  btnEdit,
  btnPrimary,
  inputCls,
  labelCls,
} from "./formStyles";

interface FormState {
  title: string;
  issuer: string;
  hours: string;
  date: string;
  certUrl: string;
}

const EMPTY_FORM: FormState = { title: "", issuer: "", hours: "", date: "", certUrl: "" };

export default function CertificationsManager() {
  const { data: certifications, loading } = useCollection<Certification>(
    "certifications"
  );
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function startEdit(cert: Certification) {
    setEditingId(cert.id);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      hours: cert.hours,
      date: cert.date,
      certUrl: cert.certUrl,
    });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const title = sanitizeText(form.title);
    const issuer = sanitizeText(form.issuer);
    if (!title || !issuer) {
      setError("Preencha o nome do curso e a instituição emissora.");
      return;
    }
    setSaving(true);
    try {
      let certUrl = sanitizeUrl(form.certUrl);
      if (file) {
        certUrl = await uploadCertificate(file);
      }
      const payload = {
        title,
        issuer,
        hours: sanitizeText(form.hours),
        date: sanitizeText(form.date),
        certUrl,
        order: editingId
          ? (certifications.find((c) => c.id === editingId)?.order ?? 0)
          : certifications.length
            ? Math.max(...certifications.map((c) => c.order ?? 0)) + 1
            : 1,
      };
      if (editingId) {
        await updateItem("certifications", editingId, payload);
      } else {
        await addItem("certifications", payload);
      }
      cancelEdit();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cert: Certification) {
    if (!window.confirm(`Remover a certificação "${cert.title}"?`)) return;
    try {
      await removeItem("certifications", cert.id);
      if (editingId === cert.id) cancelEdit();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink-700 bg-ink-900/70 p-5 md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">
            {editingId ? "Editar certificação" : "Adicionar certificação"}
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
            <label htmlFor="cert-title" className={labelCls}>
              Nome do curso
            </label>
            <input
              id="cert-title"
              type="text"
              maxLength={120}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex.: Programming with JavaScript"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="cert-issuer" className={labelCls}>
              Instituição emissora
            </label>
            <input
              id="cert-issuer"
              type="text"
              maxLength={80}
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              placeholder="Ex.: Meta / Coursera"
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cert-hours" className={labelCls}>
                Carga horária
              </label>
              <input
                id="cert-hours"
                type="text"
                maxLength={20}
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                placeholder="Ex.: 47h"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="cert-date" className={labelCls}>
                Data
              </label>
              <input
                id="cert-date"
                type="text"
                maxLength={20}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="Ex.: 03/2025"
                className={inputCls}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cert-url" className={labelCls}>
              Link do certificado (URL externa)
            </label>
            <input
              id="cert-url"
              type="url"
              value={form.certUrl}
              onChange={(e) => setForm({ ...form, certUrl: e.target.value })}
              placeholder="https://coursera.org/verify/..."
              className={inputCls}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Ou envie o comprovante (PDF/imagem) abaixo — o upload substitui o link.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cert-file" className={labelCls}>
              Upload do comprovante (PDF ou imagem, máx. 10 MB)
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="cert-file"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-ink-600 px-3 py-2 text-sm text-slate-300 transition hover:border-accent/50 hover:text-accent"
              >
                <TbUpload size={16} />
                {file ? file.name : "Escolher arquivo..."}
              </label>
              <input
                id="cert-file"
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-xs text-slate-400 hover:text-red-400"
                >
                  Remover arquivo
                </button>
              )}
            </div>
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
              {saving
                ? "Salvando..."
                : editingId
                  ? "Salvar alterações"
                  : "Adicionar certificação"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-ink-700 bg-ink-900/70 p-5 md:p-6">
        <h2 className="font-semibold text-white">Certificações cadastradas</h2>
        {loading ? (
          <p className="mt-3 text-sm text-slate-400">Carregando...</p>
        ) : certifications.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">
            Nenhuma certificação cadastrada ainda.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {certifications.map((cert) => (
              <li
                key={cert.id}
                className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-850/60 px-3.5 py-2.5"
              >
                <TbFileText size={18} className="shrink-0 text-accent" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {cert.title}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {cert.issuer}
                    {cert.hours ? ` · ${cert.hours}` : ""}
                    {cert.date ? ` · ${cert.date}` : ""}
                  </p>
                </div>
                {cert.certUrl && (
                  <a
                    href={cert.certUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir certificado de ${cert.title}`}
                    className={btnEdit}
                  >
                    <TbExternalLink size={15} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => startEdit(cert)}
                  aria-label={`Editar ${cert.title}`}
                  className={btnEdit}
                >
                  <TbPencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(cert)}
                  aria-label={`Remover ${cert.title}`}
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

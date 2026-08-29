"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { TbDeviceFloppy, TbLoader, TbPlus, TbTrash } from "react-icons/tb";
import { doc, onSnapshot } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { defaultProfile } from "@/data/profile";
import { saveProfile } from "@/lib/services";
import { sanitizeMultiline, sanitizeText, sanitizeUrl } from "@/lib/sanitize";
import type { Profile } from "@/lib/types";
import { btnDanger, btnGhost, btnPrimary, inputCls, labelCls } from "./formStyles";

type EducationItem = Profile["education"][number];

export default function ProfileManager() {
  const [form, setForm] = useState<Profile>(defaultProfile);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const initialized = useRef(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      return;
    }
    const unsubscribe = onSnapshot(
      doc(db, "profile", "main"),
      (snap) => {
        if (snap.exists() && !initialized.current) {
          initialized.current = true;
          const data = snap.data() as Partial<Profile>;
          setForm({
            ...defaultProfile,
            ...data,
            education:
              Array.isArray(data.education) && data.education.length > 0
                ? data.education
                : defaultProfile.education,
          });
        }
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao carregar perfil:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateEducation(index: number, patch: Partial<EducationItem>) {
    setForm((f) => ({
      ...f,
      education: f.education.map((item, i) =>
        i === index ? { ...item, ...patch } : item
      ),
    }));
  }

  function addEducation() {
    setForm((f) => ({
      ...f,
      education: [...f.education, { title: "", institution: "", period: "" }],
    }));
  }

  function removeEducation(index: number) {
    setForm((f) => ({
      ...f,
      education: f.education.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const name = sanitizeText(form.name);
    if (!name) {
      setError("Informe o seu nome.");
      return;
    }

    const clean: Profile = {
      name,
      role: sanitizeText(form.role),
      location: sanitizeText(form.location),
      email: sanitizeText(form.email),
      whatsapp: sanitizeText(form.whatsapp),
      whatsappLink: sanitizeUrl(form.whatsappLink),
      linkedin: sanitizeUrl(form.linkedin),
      github: sanitizeUrl(form.github),
      summary: sanitizeMultiline(form.summary),
      education: form.education
        .map((item) => ({
          title: sanitizeText(item.title),
          institution: sanitizeText(item.institution),
          period: sanitizeText(item.period),
        }))
        .filter((item) => item.title || item.institution),
    };

    setSaving(true);
    try {
      await saveProfile(clean as unknown as Record<string, unknown>);
      setMessage("Perfil atualizado com sucesso!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <TbLoader size={26} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-ink-700 bg-ink-900/70 p-5 md:p-6">
        <h2 className="font-semibold text-white">Sobre Mim</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="profile-name" className={labelCls}>
              Nome
            </label>
            <input
              id="profile-name"
              type="text"
              maxLength={100}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="profile-role" className={labelCls}>
              Título / Objetivo
            </label>
            <input
              id="profile-role"
              type="text"
              maxLength={140}
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              placeholder="Ex.: Estagiário / Analista de Dados | Foco em SQL, Python, IA & BI"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="profile-location" className={labelCls}>
              Localização
            </label>
            <input
              id="profile-location"
              type="text"
              maxLength={80}
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="profile-summary" className={labelCls}>
              Resumo profissional
            </label>
            <textarea
              id="profile-summary"
              rows={4}
              maxLength={800}
              value={form.summary}
              onChange={(e) => update("summary", e.target.value)}
              className={`${inputCls} resize-y`}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-700 bg-ink-900/70 p-5 md:p-6">
        <h2 className="font-semibold text-white">Formação acadêmica</h2>
        <div className="mt-4 space-y-4">
          {form.education.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-ink-700 bg-ink-850/60 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Formação {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeEducation(i)}
                  aria-label={`Remover formação ${i + 1}`}
                  className={btnDanger}
                >
                  <TbTrash size={15} />
                </button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor={`edu-title-${i}`}
                    className={labelCls}
                  >
                    Curso / Titulação
                  </label>
                  <input
                    id={`edu-title-${i}`}
                    type="text"
                    maxLength={140}
                    value={item.title}
                    onChange={(e) => updateEducation(i, { title: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`edu-institution-${i}`}
                    className={labelCls}
                  >
                    Instituição
                  </label>
                  <input
                    id={`edu-institution-${i}`}
                    type="text"
                    maxLength={100}
                    value={item.institution}
                    onChange={(e) =>
                      updateEducation(i, { institution: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor={`edu-period-${i}`} className={labelCls}>
                    Período / Previsão
                  </label>
                  <input
                    id={`edu-period-${i}`}
                    type="text"
                    maxLength={40}
                    value={item.period}
                    onChange={(e) => updateEducation(i, { period: e.target.value })}
                    placeholder="Ex.: 12/2026"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addEducation} className={btnGhost}>
            <TbPlus size={16} /> Adicionar formação
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-700 bg-ink-900/70 p-5 md:p-6">
        <h2 className="font-semibold text-white">Contato & Redes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-email" className={labelCls}>
              E-mail
            </label>
            <input
              id="profile-email"
              type="email"
              maxLength={120}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="profile-whatsapp" className={labelCls}>
              WhatsApp (exibido no site)
            </label>
            <input
              id="profile-whatsapp"
              type="text"
              maxLength={30}
              value={form.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              placeholder="(79) 99981-7577"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="profile-whatsapp-link" className={labelCls}>
              Link do WhatsApp (wa.me)
            </label>
            <input
              id="profile-whatsapp-link"
              type="url"
              value={form.whatsappLink}
              onChange={(e) => update("whatsappLink", e.target.value)}
              placeholder="https://wa.me/5579999999999"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="profile-linkedin" className={labelCls}>
              LinkedIn (URL)
            </label>
            <input
              id="profile-linkedin"
              type="url"
              value={form.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
              placeholder="https://www.linkedin.com/in/seu-usuario"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="profile-github" className={labelCls}>
              GitHub (URL)
            </label>
            <input
              id="profile-github"
              type="url"
              value={form.github}
              onChange={(e) => update("github", e.target.value)}
              placeholder="https://github.com/seu-usuario"
              className={inputCls}
            />
          </div>
        </div>
      </section>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="rounded-lg border border-accent-2/30 bg-accent-2/10 px-3 py-2 text-sm text-accent-2"
        >
          {message}
        </p>
      )}

      <button type="submit" disabled={saving} className={btnPrimary}>
        {saving ? (
          <TbLoader size={16} className="animate-spin" />
        ) : (
          <TbDeviceFloppy size={16} />
        )}
        {saving ? "Salvando..." : "Salvar perfil"}
      </button>
    </form>
  );
}

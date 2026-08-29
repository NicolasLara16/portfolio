"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { TbArrowLeft, TbLoader, TbLock } from "react-icons/tb";
import { auth } from "@/lib/firebase";
import { btnPrimary, inputCls, labelCls } from "./formStyles";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/wrong-password": "E-mail ou senha incorretos.",
  "auth/user-not-found": "E-mail ou senha incorretos.",
  "auth/too-many-requests":
    "Muitas tentativas. Tente novamente em alguns instantes.",
  "auth/network-request-failed": "Falha de conexão. Verifique sua internet.",
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth as NonNullable<typeof auth>, email, password);
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      setError(ERROR_MESSAGES[code] ?? "Não foi possível entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-ink-700 bg-ink-900/70 p-6 md:p-8">
          <div className="flex flex-col items-center text-center">
            <span className="rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 p-3 text-ink-950">
              <TbLock size={22} />
            </span>
            <h1 className="mt-4 text-xl font-bold text-white">
              Painel Administrativo
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Acesse com sua conta de administrador para gerenciar o conteúdo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className={labelCls}>
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@exemplo.com"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="password" className={labelCls}>
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
              >
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className={`${btnPrimary} w-full`}>
              {loading ? <TbLoader size={16} className="animate-spin" /> : <TbLock size={16} />}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="mt-4 flex items-center justify-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-accent"
        >
          <TbArrowLeft size={15} /> Voltar ao portfólio
        </Link>
      </div>
    </main>
  );
}

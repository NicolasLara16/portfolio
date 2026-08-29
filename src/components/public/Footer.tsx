"use client";

import { TbLock } from "react-icons/tb";
import { useProfile } from "@/hooks/useProfile";

export default function Footer() {
  const profile = useProfile();

  return (
    <footer className="border-t border-ink-800 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-500 sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p className="font-mono text-xs">
          Next.js · Tailwind CSS · Firebase
        </p>
        <a
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 transition-colors hover:text-accent"
        >
          <TbLock size={13} /> Área administrativa
        </a>
      </div>
    </footer>
  );
}

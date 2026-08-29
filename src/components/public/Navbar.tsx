"use client";

import { useEffect, useState } from "react";
import { TbLock, TbMenu2, TbX } from "react-icons/tb";

const NAV_LINKS = [
  { id: "sobre", label: "Sobre Mim" },
  { id: "habilidades", label: "Habilidades" },
  { id: "certificacoes", label: "Certificações" },
  { id: "projetos", label: "Projetos" },
  { id: "contato", label: "Contato" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("sobre");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-ink-800 bg-ink-950/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#sobre" className="font-mono text-lg font-bold text-white">
          <span className="text-accent">&lt;</span>NG
          <span className="text-accent"> /&gt;</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active === link.id
                    ? "text-accent"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="/admin"
            title="Painel administrativo"
            aria-label="Painel administrativo"
            className="hidden rounded-md border border-ink-700 p-2 text-slate-400 transition-colors hover:border-accent/50 hover:text-accent sm:block"
          >
            <TbLock size={16} />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="rounded-md border border-ink-700 p-2 text-slate-300 transition-colors hover:text-white md:hidden"
          >
            {open ? <TbX size={18} /> : <TbMenu2 size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-ink-800 bg-ink-950/95 px-4 pb-4 pt-2 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-ink-800 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-ink-800 hover:text-accent"
              >
                <TbLock size={14} /> Painel administrativo
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

"use client";

import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { TbArrowUpRight, TbMail, TbMapPin } from "react-icons/tb";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "./SectionHeading";
import { useProfile } from "@/hooks/useProfile";

export default function ContactSection() {
  const profile = useProfile();

  const CHANNELS = [
    {
      label: "E-mail",
      value: profile.email,
      href: `mailto:${profile.email}`,
      Icon: TbMail,
    },
    {
      label: "WhatsApp",
      value: profile.whatsapp,
      href: profile.whatsappLink,
      Icon: FaWhatsapp,
    },
    {
      label: "LinkedIn",
      value: "Conecte-se comigo",
      href: profile.linkedin,
      Icon: FaLinkedin,
    },
    {
      label: "GitHub",
      value: "Veja meu código",
      href: profile.github,
      Icon: FaGithub,
    },
  ];

  return (
    <section id="contato" className="bg-ink-900/40 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Contato"
          title="Vamos conversar?"
          description="Aberto a oportunidades, networking e projetos na área de dados. Escolha o canal que preferir."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map(({ label, value, href, Icon }, i) => (
            <Reveal key={label} delay={i * 60}>
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-ink-700 bg-ink-900/70 p-5 transition-colors hover:border-accent/50"
              >
                <div className="flex items-start justify-between">
                  <span className="rounded-lg bg-accent/10 p-2.5 text-accent">
                    <Icon size={20} />
                  </span>
                  <TbArrowUpRight
                    size={18}
                    className="text-slate-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </div>
                <p className="mt-4 text-sm font-semibold text-white">{label}</p>
                <p className="mt-1 truncate text-sm text-slate-400">{value}</p>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-10 flex items-center justify-center gap-1.5 text-sm text-slate-500">
            <TbMapPin size={15} className="text-accent" /> {profile.location} —
            disponível para remoto e híbrido
          </p>
        </Reveal>
      </div>
    </section>
  );
}

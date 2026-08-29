"use client";

import { TbCalendar, TbCertificate, TbExternalLink, TbLoader } from "react-icons/tb";
import SectionHeading from "./SectionHeading";
import EmptyState from "@/components/shared/EmptyState";
import Reveal from "@/components/shared/Reveal";
import { btnOutlineSm } from "@/components/shared/buttons";
import { useCollection } from "@/hooks/useCollection";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { Certification } from "@/lib/types";

export default function CertificationsSection() {
  const { data: certifications, loading } = useCollection<Certification>(
    "certifications"
  );

  return (
    <section id="certificacoes" className="bg-ink-900/40 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Certificações & Cursos"
          title="Formação complementar"
          description="Cursos e trilhas concluídos em plataformas como Meta/Coursera, Cisco Networking Academy e DataCamp."
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <TbLoader size={28} className="animate-spin text-accent" />
          </div>
        ) : certifications.length === 0 ? (
          <EmptyState
            message="Nenhuma certificação cadastrada ainda."
            hint={
              isFirebaseConfigured
                ? "Adicione certificações pelo painel administrativo."
                : "Configure o Firebase (.env.local) para carregar o conteúdo dinâmico."
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, i) => (
              <Reveal key={cert.id} delay={(i % 3) * 60}>
                <article className="flex h-full flex-col rounded-2xl border border-ink-700 bg-ink-900/70 p-5 transition-colors hover:border-accent/40">
                  <div className="flex items-start justify-between">
                    <span className="rounded-lg bg-accent/10 p-2.5 text-accent">
                      <TbCertificate size={20} />
                    </span>
                    {cert.hours && (
                      <span className="rounded-full border border-ink-600 px-2.5 py-0.5 text-[11px] text-slate-400">
                        {cert.hours}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-semibold leading-snug text-white">
                    {cert.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">{cert.issuer}</p>
                  {cert.date && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                      <TbCalendar size={13} /> {cert.date}
                    </p>
                  )}
                  <div className="mt-auto pt-4">
                    {cert.certUrl ? (
                      <a
                        href={cert.certUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${btnOutlineSm} w-full`}
                      >
                        Ver certificado <TbExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-600">
                        Certificado não anexado
                      </span>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

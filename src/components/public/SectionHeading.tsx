import type { ReactNode } from "react";
import Reveal from "@/components/shared/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  icon,
}: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="mb-10 md:mb-14">
        <span className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent">
          {icon}
          {eyebrow}
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-2xl text-slate-400">{description}</p>
        )}
      </div>
    </Reveal>
  );
}

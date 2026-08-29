import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const title = "Nicolas Gerardo Chagas Lara | Analista de Dados";
const description =
  "Portfólio de Nicolas Gerardo Chagas Lara — Estagiário/Analista de Dados em Itabaiana, SE. Foco em SQL, Python, IA & BI, com automação de fluxos de trabalho via IAs Generativas.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Nicolas Gerardo Chagas Lara",
  },
  description,
  keywords: [
    "Analista de Dados",
    "Nicolas Gerardo Chagas Lara",
    "SQL",
    "Python",
    "Power BI",
    "Business Intelligence",
    "Engenharia de Dados",
    "Itabaiana",
  ],
  authors: [{ name: "Nicolas Gerardo Chagas Lara" }],
  creator: "Nicolas Gerardo Chagas Lara",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Nicolas Gerardo Chagas Lara",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#05080f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrains.variable}`}>
      <body
        suppressHydrationWarning
        className="bg-ink-950 font-sans text-slate-200 antialiased"
      >
        {children}
      </body>
    </html>
  );
}

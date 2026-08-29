import type { Profile } from "@/lib/types";

/** Valores padrão do perfil — usados como fallback enquanto o documento
 * `profile/main` não existir no Firestore (ou sem Firebase configurado). */
export const defaultProfile: Profile = {
  name: "Nicolas Gerardo Chagas Lara",
  role: "Estagiário / Analista de Dados | Foco em SQL, Python, IA & BI",
  location: "Itabaiana, SE",
  email: "ngerardo18@gmail.com",
  whatsapp: "(79) 99981-7577",
  whatsappLink: "https://wa.me/5579999817577",
  linkedin: "https://www.linkedin.com/in/nicolas-gerardo-lara",
  github: "https://github.com/nicolasgerardo",
  summary:
    "Estudante de Análise e Desenvolvimento de Sistemas (Senac) com foco em geração de insights estratégicos, automação de fluxos de trabalho via IAs Generativas (Gemini, ChatGPT, Claude, OpenCode) e engenharia de dados.",
  education: [
    {
      title: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
      institution: "Centro Universitário Senac",
      period: "Previsão: 12/2026",
    },
    {
      title: "Qualificação Profissional em Desenvolvimento de Sistemas de TI",
      institution: "Senac",
      period: "09/2025",
    },
  ],
};

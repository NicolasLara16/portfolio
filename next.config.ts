import type { NextConfig } from "next";

// Exportação estática: todo o portfólio é prerenderizado (HTML puro),
// permitindo hospedar no Firebase Hosting no plano gratuito (Spark).
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;

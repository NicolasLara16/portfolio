/**
 * Seed inicial do portfólio (Firestore).
 *
 * Uso:
 *   1. Preencha o .env.local (credenciais do Firebase + ADMIN_EMAIL/ADMIN_PASSWORD)
 *   2. A conta do ADMIN_EMAIL já deve existir no Firebase Authentication
 *   3. Publique as firestore.rules (a conta admin precisa estar liberada para escrita)
 *   4. npm run seed
 *
 * O script só popula coleções VAZIAS — nunca sobrescreve dados existentes.
 */
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDoc, getDocs, getFirestore, writeBatch, doc, setDoc } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!config.apiKey || !config.projectId || !config.appId) {
  console.error(
    "✖ Credenciais do Firebase ausentes. Copie o .env.example para .env.local e preencha."
  );
  process.exit(1);
}

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error(
    "✖ Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env.local.\n" +
      "  A conta já deve existir no Firebase Authentication (Email/Senha)."
  );
  process.exit(1);
}

const SKILLS = [
  // Análise & Linguagens
  { name: "SQL", category: "analise", level: "avancado", iconKey: "SQL", order: 1 },
  { name: "Python", category: "analise", level: "avancado", iconKey: "Python", order: 2 },
  { name: "HTML5", category: "analise", level: "avancado", iconKey: "HTML5", order: 3 },
  { name: "CSS3", category: "analise", level: "avancado", iconKey: "CSS3", order: 4 },
  { name: "JavaScript", category: "analise", level: "avancado", iconKey: "JavaScript", order: 5 },
  // Data Science & Automation
  { name: "Pandas", category: "dados", level: "avancado", iconKey: "Pandas", order: 1 },
  { name: "Matplotlib", category: "dados", level: "intermediario", iconKey: "Matplotlib", order: 2 },
  { name: "Databricks", category: "dados", level: "intermediario", iconKey: "Databricks", order: 3 },
  { name: "n8n", category: "dados", level: "intermediario", iconKey: "n8n", order: 4 },
  // Business Intelligence
  { name: "Power BI", category: "bi", level: "avancado", iconKey: "Power BI", order: 1 },
  { name: "Looker Studio", category: "bi", level: "intermediario", iconKey: "Looker Studio", order: 2 },
  { name: "Tableau", category: "bi", level: "intermediario", iconKey: "Tableau", order: 3 },
  // Inteligência Artificial
  { name: "Gemini", category: "ia", level: "avancado", iconKey: "Gemini", order: 1 },
  { name: "GPT", category: "ia", level: "avancado", iconKey: "GPT", order: 2 },
  { name: "Claude", category: "ia", level: "avancado", iconKey: "Claude", order: 3 },
  { name: "OpenCode", category: "ia", level: "avancado", iconKey: "OpenCode", order: 4 },
  { name: "Engenharia de Prompts", category: "ia", level: "avancado", iconKey: "Engenharia de Prompts", order: 5 },
  // Infraestrutura & Ferramentas
  { name: "Docker", category: "infra", level: "intermediario", iconKey: "Docker", order: 1 },
  { name: "Git/GitHub", category: "infra", level: "avancado", iconKey: "Git/GitHub", order: 2 },
  { name: "Linux/OS", category: "infra", level: "intermediario", iconKey: "Linux/OS", order: 3 },
];

const SOFT_SKILLS = [
  { name: "Resolução de Problemas Complexos", order: 1 },
  { name: "Aprendizado Autodidata Contínuo", order: 2 },
  { name: "Automação Inteligente", order: 3 },
  { name: "Pensamento Analítico", order: 4 },
];

const CERTIFICATIONS = [
  { title: "Programming with JavaScript", issuer: "Meta / Coursera", hours: "47h", date: "", certUrl: "", order: 1 },
  { title: "HTML and CSS in Depth", issuer: "Meta / Coursera", hours: "31h", date: "", certUrl: "", order: 2 },
  { title: "Introduction to Front-End Development", issuer: "Meta / Coursera", hours: "18h", date: "", certUrl: "", order: 3 },
  { title: "Version Control", issuer: "Meta / Coursera", hours: "15h", date: "", certUrl: "", order: 4 },
  { title: "Fundamentos da Análise de Dados", issuer: "Cisco Networking Academy", hours: "", date: "", certUrl: "", order: 5 },
  { title: "Cibersegurança", issuer: "Cisco Networking Academy", hours: "", date: "", certUrl: "", order: 6 },
  { title: "Hardware & Sistemas Operacionais", issuer: "Cisco Networking Academy", hours: "", date: "", certUrl: "", order: 7 },
  { title: "Trilha Analista de Dados em Python", issuer: "DataCamp", hours: "", date: "", certUrl: "", order: 8 },
];

// Projetos de EXEMPLO — edite/remova pelo painel administrativo.
const PROJECTS = [
  {
    title: "Dashboard Executivo de Vendas — Power BI",
    description:
      "Modelagem de dados em star schema, medidas DAX e dashboards interativos para acompanhamento de KPIs de vendas em tempo real. (Projeto de exemplo — edite pelo painel admin.)",
    tags: ["Power BI", "DAX", "SQL"],
    githubUrl: "",
    demoUrl: "",
    order: 1,
  },
  {
    title: "Automação de Relatórios com Python & n8n",
    description:
      "Pipeline automático de coleta, tratamento e distribuição de relatórios periódicos usando Python, Pandas e fluxos no n8n, reduzindo trabalho manual repetitivo. (Projeto de exemplo — edite pelo painel admin.)",
    tags: ["Python", "Pandas", "n8n"],
    githubUrl: "",
    demoUrl: "",
    order: 2,
  },
  {
    title: "Análise Exploratória de Dados em SQL",
    description:
      "Consultas otimizadas e visualizações para extração de insights de bases relacionais, com documentação das etapas de limpeza e análise. (Projeto de exemplo — edite pelo painel admin.)",
    tags: ["SQL", "Databricks", "Matplotlib"],
    githubUrl: "",
    demoUrl: "",
    order: 3,
  },
];

const PROFILE = {
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

console.log(`✔ Autenticando como ${email}...`);
const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);

await signInWithEmailAndPassword(auth, email, password);
console.log("✔ Autenticado com sucesso.\n");

async function seedIfEmpty(collectionName, data) {
  const existing = await getDocs(collection(db, collectionName));
  if (!existing.empty) {
    console.log(`→ Coleção "${collectionName}" já possui ${existing.size} documento(s). Pulando.`);
    return;
  }
  let batch = writeBatch(db);
  let ops = 0;
  for (const item of data) {
    batch.set(doc(collection(db, collectionName)), item);
    ops += 1;
    if (ops % 400 === 0) {
      await batch.commit();
      batch = writeBatch(db);
    }
  }
  if (ops > 0) await batch.commit();
  console.log(`✔ "${collectionName}": ${ops} documento(s) criado(s).`);
}

async function seedProfileIfMissing() {
  const ref = doc(db, "profile", "main");
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    console.log('→ Documento "profile/main" já existe. Pulando.');
    return;
  }
  await setDoc(ref, PROFILE);
  console.log('✔ "profile/main": documento criado.');
}

await seedProfileIfMissing();
await seedIfEmpty("skills", SKILLS);
await seedIfEmpty("softSkills", SOFT_SKILLS);
await seedIfEmpty("certifications", CERTIFICATIONS);
await seedIfEmpty("projects", PROJECTS);

console.log("\n✅ Seed concluído! Abra http://localhost:3000 para ver o portfólio.");
process.exit(0);

# Portfólio Profissional Dinâmico — Nicolas Gerardo Chagas Lara

Portfólio pessoal com **gerenciamento de conteúdo via painel administrativo**.
Construído com **Next.js (App Router) + Tailwind CSS v4 + Firebase (Authentication, Cloud Firestore e Storage)**.

## Funcionalidades

- **Rota pública `/`**: Sobre Mim, Habilidades (hard skills dinâmicas + soft skills), Certificações, Projetos (modal com detalhes) e Contato — todas carregadas em tempo real do Firestore.
- **Rota protegida `/admin`**: login com e-mail/senha (Firebase Auth) e abas de CRUD para Perfil & Contato (Sobre Mim, formação, redes), Hard Skills, Soft Skills, Certificações (com upload de comprovante p/ Storage) e Projetos.
- **Segurança**: Firestore/Storage Rules com leitura pública e escrita restrita ao UID do admin; inputs sanitizados (anti-XSS); credenciais só via variáveis de ambiente.
- **SEO**: meta tags dinâmicas, Open Graph/Twitter Card com imagem gerada, `sitemap.xml` e `robots.txt`.
- **Design**: dark mode tech (azul escuro/grafite com acentos ciano e verde), responsivo (menu hamburger) e animações de scroll.

## Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx            # Metadata (SEO), fontes, tema
│   ├── page.tsx              # Portfólio público
│   ├── opengraph-image.tsx   # Imagem OG gerada dinamicamente
│   ├── sitemap.ts / robots.ts
│   └── admin/page.tsx        # Painel (login ou dashboard)
├── components/
│   ├── public/               # Navbar, Hero, Skills, Certifications, Projects, Contact, Footer
│   ├── admin/                # LoginForm, Dashboard, gerenciadores CRUD
│   └── shared/               # Reveal (animação), EmptyState, botões
├── data/profile.ts           # Dados fixos do perfil (nome, links, formação)
├── hooks/                    # useAuth, useCollection (onSnapshot)
└── lib/                      # firebase.ts, services.ts, sanitize.ts, types.ts, iconMap.ts
scripts/seed.mjs              # Popula o Firestore com os dados iniciais
firestore.rules / storage.rules  # Regras de segurança
```

## Configuração do Firebase (passo a passo)

### 1. Criar o projeto

1. Acesse o [Console do Firebase](https://console.firebase.google.com) e clique em **Adicionar projeto**.
2. Após criar, entre em **Configurações do projeto → Seus apps** e registre um app **Web** (`</>`).
3. Copie o objeto `firebaseConfig` exibido.

### 2. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha em `.env.local`:

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `apiKey` do firebaseConfig |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `appId` |
| `NEXT_PUBLIC_SITE_URL` | URL pública (ex.: `https://seudominio.com`) |

> O `.env.local` **nunca** deve ser commitado (já está no `.gitignore`).

### 3. Ativar o Authentication

1. Console → **Authentication → Get started**.
2. Aba **Sign-in method** → habilite **Email/Password**.
3. Aba **Users** → **Add user**: cadastre seu e-mail e uma senha forte.
   Esse será o **único usuário admin**. Copie o **User UID** gerado.

### 4. Criar o Firestore

1. Console → **Firestore Database → Create database** (modo produção).
2. Região: `southamerica-east1` (São Paulo) ou a de sua preferência.

### 5. (Opcional, para upload de certificados) Ativar o Storage

Console → **Storage → Get started** (modo produção).

### 6. Publicar as regras de segurança

Abra `firestore.rules` e `storage.rules` e substitua **`UID_DO_ADMIN`** pelo UID copiado no passo 3. Depois publique:

- **Firestore**: Console → Firestore Database → **Rules** → cole o conteúdo de `firestore.rules` → **Publish**.
- **Storage**: Console → Storage → **Rules** → cole o conteúdo de `storage.rules` → **Publish**.

Ou via CLI:

```bash
npm i -g firebase-tools
firebase login
firebase deploy --only firestore:rules,storage
```

(Configure `.firebaserc`/`firebase.json` se for usar a CLI.)

### 7. Popular o banco (seed)

Com `.env.local` preenchido **incluindo `ADMIN_EMAIL` e `ADMIN_PASSWORD`** (a mesma conta criada no passo 3):

```bash
npm run seed
```

O script popula o documento `profile/main` e as coleções `skills`, `softSkills`, `certifications` e `projects` — **somente se estiverem vazios**.

## Rodando o projeto

```bash
npm install
npm run dev      # http://localhost:3000
```

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run seed` | Popula o Firestore com dados iniciais |

## Uso do painel admin

1. Acesse `/admin` (ou o ícone de cadeado na navbar/rodapé).
2. Entre com o e-mail/senha do admin.
3. Use as abas para:
   - **Hard Skills**: adicionar/editar/remover tecnologias, categoria, ícone e nível (Iniciante, Intermediário ou Avançado);
   - **Soft Skills**: adicionar/remover tags de competências;
   - **Certificações**: curso, instituição, carga horária, data e link **ou** upload do comprovante (PDF/imagem até 10 MB);
   - **Projetos**: título, descrição, tecnologias (tags), GitHub e demo.
4. As alterações aparecem no site em tempo real (Firestore `onSnapshot`).

## Deploy (Firebase Hosting)

O projeto usa **exportação estática** (`output: "export"` no `next.config.ts`), então roda no plano gratuito (Spark) do Firebase.

1. Instale a CLI e faça login:

   ```bash
   npm i -g firebase-tools
   firebase login
   ```

2. Configure o projeto padrão (`.firebaserc` já aponta para `portfolio-cacef`).

3. Deploy — o build roda automaticamente no predeploy:

   ```bash
   firebase deploy --only hosting          # site
   firebase deploy --only firestore:rules  # regras do Firestore
   firebase deploy --only storage:rules    # regras do Storage
   # ou tudo de uma vez:
   firebase deploy
   ```

4. Site disponível em `https://portfolio-cacef.web.app`.

> Recomendado: adicione o domínio `portfolio-cacef.web.app` em **Firebase Console → Authentication → Settings → Authorized domains**.

## Personalização

- **Perfil/formação/links**: editáveis pelo painel admin (aba "Perfil & Contato", documento `profile/main`). Os valores padrão ficam em `src/data/profile.ts` (⚠️ atualize as URLs de LinkedIn/GitHub de exemplo pelas suas reais).
- **Cores/tema**: ajuste os tokens em `src/app/globals.css` (`@theme`).
- **Ícones de skills**: mapa em `src/lib/iconMap.ts`.
- **Coleções do Firestore**: `profile` (doc `main`), `skills`, `softSkills`, `certifications`, `projects`.

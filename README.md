# IFAD Connect – Jornada de leitura e devoção

Projeto desenvolvido para a disciplina **Front-end com Jamstack Next.js**, da pós-graduação em Desenvolvimento Full Stack.

O objetivo do IFAD Connect é oferecer um espaço digital para **leitura bíblica**, **devocionais** e **acompanhamento pastoral** (pedidos de oração, encontros de grupo), conectado ao contexto da **IFAD – Família Aliança de Um Novo Tempo (Guarulhos/SP)**.

---

## 1. Visão geral

O projeto é uma aplicação web construída em **Next.js 16** usando o **App Router**, com:

- Autenticação e sessão de usuários (membros, líderes, administradores);
- Leitura bíblica integrada à API da **ABíbliaDigital**;
- Devocionais diários fornecidos via **Strapi (GraphQL)** com fallback local;
- Planos de leitura no estilo Bible App, com progresso por usuário;
- Espaço do Membro (pedidos de oração, devocional do dia, encontros recentes);
- Espaço do Líder (pedidos recebidos, registro de encontros);
- Área administrativa para gestão de usuários.

---

## 2. Links principais

- **Deploy (Vercel):** https://ifad-connect.vercel.app  
- **Repositório GitHub:** https://github.com/elixsistemas/ifad-connect
- **Painel Strapi:** http://localhost:1337/admin  

## Acesso para Avaliação (usuário administrador)

Para facilitar a validação do projeto, foi criado um usuário com papel **ADMIN**:

- **Email:** admin@ifad.com.br  
- **Senha:** 123456  

Esse usuário possui acesso às rotas administrativas do sistema, incluindo:

- `/admin/users` – gestão de usuários
- `/leader` – espaço do líder (por também ter permissão superior)
- `/member` – espaço do membro
- Testes completos do fluxo de leitura bíblica, devocionais e planos de leitura

## 3. Tecnologias utilizadas

- **Frontend / Framework**
  - Next.js 16 (App Router)
  - React 19
  - TypeScript
  - Tailwind CSS

- **Backend / Dados**
  - API Routes (Route Handlers do App Router em `app/api/.../route.ts`)
  - Prisma ORM
  - Banco de dados: **PostgreSQL (Neon)**

- **Autenticação e sessão**
  - NextAuth (Credentials Provider)
  - Controle de acesso por papel:
    - `MEMBER`
    - `LEADER`
    - `ADMIN`

- **Integrações externas**
  - **ABíbliaDigital** – textos bíblicos e capítulos
  - **Strapi CMS (GraphQL)** – conteúdo de devocionais

---

## 4. Arquitetura da aplicação

A aplicação é organizada em torno do **App Router** (`/app`), com alguns endpoints complementares na pasta `/app/api`.

### Principais pastas

- `app/`
  - `page.tsx` – Home
  - `biblia/` – leitura bíblica com Bíblia Digital
  - `devocionais/` – listagem e leitura de devocionais
  - `planos/` – listagem de planos de leitura
  - `planos/[slug]/` – tela de plano no estilo Bible App
  - `meus-planos/` – planos do usuário logado
  - `member/` – espaço do membro (pedidos de oração, devocional do dia)
  - `leader/` – espaço do líder (pedidos recebidos, encontros)
  - `admin/` – telas administrativas (ex.: `/admin/users`)
  - `api/` – rotas de API (auth, planos, pedidos, etc.)

- `prisma/`
  - `schema.prisma` – definição do modelo de dados (User, ReadingPlan, ReadingPlanRun, PrayerRequest, GroupMeeting, etc.)

- `app/services/`
  - `bible.ts` – acesso à API da ABíbliaDigital
  - `devotionals.ts` – acesso ao Strapi (GraphQL) com fallback em memória

- `app/lib/`
  - `prisma.ts` – cliente Prisma
  - `readingPlans.ts` – lógica de execução de planos
  - `readingPlansWithProgress.ts` – visão de progresso por usuário

---

## 5. Funcionalidades principais

### 5.1. Leitura bíblica (`/biblia`)

- Consulta de capítulos por versão, livro e capítulo usando a API da ABíbliaDigital.
- Interface responsiva para acompanhar a leitura diretamente na plataforma.

### 5.2. Devocionais (`/devocionais` e `/devocionais/[slug]`)

- Lista de devocionais com:
  - título, subtítulo, data, referência bíblica, imagem de capa.
- Páginas de detalhe renderizadas no App Router:
  - busca por `slug` via GraphQL (Strapi) ou fallback local em caso de falha na API.

### 5.3. Planos de leitura (`/planos`, `/planos/[slug]`, `/meus-planos`)

- Lista de planos de leitura (modelo similar ao Bible App).
- Cada plano possui:
  - título, descrição, duração em dias, referência bíblica e devocional associado.
- O usuário pode:
  - **iniciar um plano** (rota protegida, cria um `ReadingPlanRun`);
  - ver o **dia atual** e marcar como concluído (atualiza `currentDay` e status);
  - acompanhar o progresso em `/meus-planos` (barrinha de progresso e histórico de execuções).

### 5.4. Espaço do Membro (`/member`)

- Bloco “Devocional de hoje” (integração planejada com Strapi + plano de leitura).
- **Formulário de pedido de oração / mensagem ao líder**:
  - assunto + mensagem, validação de campos obrigatórios;
  - envio para o líder selecionado (salvo no banco e exibido na área do líder).
- Lista de encontros recentes do grupo (registrados pelo líder).

### 5.5. Espaço do Líder (`/leader`)

- Lista de **pedidos de oração/mensagens** recebidos de membros.
- **Formulário de registro de encontro do grupo**:
  - título, data, horário, anotações;
  - salvando no banco e exibindo na lista de encontros recentes.

### 5.6. Área administrativa (`/admin`)

- Tela de **gestão de usuários** (`/admin/users`):
  - listagem com nome, email, papel (role), datas de criação, último login e última atividade.
- Acesso restrito a usuários com papel `ADMIN`.

---

## 6. Autenticação, sessão e segurança

- Implementação com **NextAuth** (Credentials Provider).
- Dados do usuário armazenados no banco via Prisma.
- Senhas salvas com hash (nunca em texto puro).
- Rotas protegidas verificando a sessão no servidor com `getServerSession(authOptions)`.
  - Exemplos:
    - `/member`, `/leader`, `/meus-planos`, `/admin/*`
    - `/api/reading-plans/join`, endpoints de pedidos de oração e encontros.

---

## 7. Rotas e navegação

### Rotas públicas

- `/` – Home  
- `/sobre` – Sobre a IFAD  
- `/biblia` – Leitura bíblica  
- `/devocionais` – Lista de devocionais  
- `/devocionais/[slug]` – Devocional específico  
- `/planos` – Lista de planos de leitura  
- `/planos/[slug]` – Plano de leitura (detalhe)

### Rotas autenticadas

- `/register` – Cadastro
- `/login` – Login
- `/dashboard` – Painel geral do usuário
- `/member` – Espaço do membro
- `/leader` – Espaço do líder
- `/meus-planos` – Planos do usuário
- `/admin/users` – Gestão de usuários (apenas ADMIN)

---

## 8. API Routes (App Router)

Alguns endpoints importantes:

- `POST /api/auth/register`  
  Cria um novo usuário no banco, com validação de dados.

- `GET /api/auth/session` (via NextAuth)  
  Retorna dados da sessão autenticada.

- `POST /api/reading-plans/join`  
  Inicia um plano de leitura para o usuário autenticado.

- `PATCH /api/reading-plans/update` (ou equivalente)  
  Atualiza o dia atual e o status da execução de um plano.

- `POST /api/prayer-requests` (nome ilustrativo)  
  Registra um pedido de oração enviado pelo membro ao líder.

- `POST /api/group-meetings` (nome ilustrativo)  
  Registra um encontro do grupo pelo líder.

> Os nomes exatos dos arquivos podem variar (`route.ts`), mas a ideia é ter rotas RESTful protegidas consumidas pelos formulários do front-end.

---

## 9. Como rodar o projeto localmente

### Pré-requisitos

- Node.js 20+
- Conta na **Neon** (ou outro Postgres) para o banco de dados
- Conta e token da **ABíbliaDigital**
- Instância do **Strapi** para os devocionais (opcional, há fallback local)

### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/SEU-USUARIO/ifad-connect.git
cd ifad-connect

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# editar .env.local com:
# DATABASE_URL=...
# ABIBLIA_TOKEN=...
# STRAPI_GRAPHQL_URL=...
# NEXTAUTH_SECRET=...
# NEXTAUTH_URL=http://localhost:3000

# 4. Rodar migrations do Prisma
npx prisma migrate dev

# 5. Rodar em desenvolvimento
npm run dev
# acessar http://localhost:3000

# QA Team E-commerce MVP

Digital products store for QA engineers and software testers. Built with Next.js 14, Prisma (SQLite), and Tailwind CSS.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.local.example .env.local

# 3. Setup database and seed products
npx prisma migrate dev
npx prisma db seed

# 4. (Optional) Start Mailpit for email capture
docker compose up -d mailpit
# UI: http://localhost:8025

# 5. Run the app
npm run dev
# Open: http://localhost:3000
```

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Database**: SQLite via Prisma
- **Payments**: Simulated checkout (no external API keys)
- **Email**: Mailpit (Docker, local only)
- **Tests**: Jest + React Testing Library + Playwright

## Architecture

See [docs/arquitetura-e-regras-de-negocio.md](./docs/arquitetura-e-regras-de-negocio.md)

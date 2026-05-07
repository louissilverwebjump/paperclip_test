# Regras de Negócio e Arquitetura — QA Team E-commerce MVP

> **v2 — sem dependências de contas externas.** Toda a stack roda localmente sem API keys de terceiros.

## Visão Geral

Plataforma de e-commerce para venda de produtos digitais (cursos, templates, scripts, ferramentas) a engenheiros de QA e testadores de software. MVP focado em velocidade de entrega, com ambiente local completamente auto-contido.

---

## Stack Técnico

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Frontend | Next.js 14 (App Router) | SSR/SSG, roteamento embutido |
| Estilização | Tailwind CSS | Prototipagem rápida |
| Backend/API | Next.js Route Handlers | Mesmo repo, zero overhead |
| Banco de dados | SQLite via Prisma | Arquivo local, zero configuração |
| Pagamento (simulado) | Página de checkout própria + mock de pagamento | Sem Stripe — fluxo simulado localmente |
| Entrega digital | Links de download diretos servidos pelo Next.js | Arquivos em `/public/downloads` ou storage local |
| Email (simulado) | Mailpit (Docker) | Captura emails localmente sem conta SMTP externa |
| Auth | Nenhuma (MVP) | Reduz escopo; revisitar pós-MVP |
| Testes | Jest + React Testing Library + Playwright | Unitário, componente e E2E |
| CI | GitHub Actions | Roda `npm test` antes de qualquer merge |

### Sobre o mock de pagamento

No lugar de um gateway externo, implementamos um fluxo simulado:

1. Usuário preenche formulário de checkout (email + "dados de cartão" fake)
2. API `/api/checkout` valida o payload e cria um `Order` com status `pending`
3. API `/api/checkout/confirm` simula a confirmação de pagamento → status `paid`
4. Após confirmação: gera token de download único (UUID) e "envia" email via Mailpit
5. Página de sucesso exibe link de download com o token

Isso reproduz o mesmo fluxo de um gateway real sem nenhuma conta externa, permitindo testes manuais e automatizados completos.

---

## Regras de Negócio

### Catálogo de Produtos

- Produtos têm: `id`, `slug`, `name`, `description`, `price_cents`, `category`, `file_path`, `active`
- Apenas produtos com `active = true` aparecem na vitrine
- Categorias iniciais: `templates`, `scripts`, `courses`, `tools`
- Nenhum arquivo digital é acessível sem token de download válido

### Carrinho

- Estado mantido em `localStorage` (sem login no MVP)
- Cada item: `productId`, `quantity` (sempre 1 para produtos digitais), `price_cents`
- Quantidade máxima por produto: 1 (produto digital não duplica)
- Carrinho persiste entre reloads; expira após 24h

### Checkout

- Comprador fornece: nome, email, e dados de cartão fictícios (número, validade, CVV — apenas formato, sem validação real)
- API cria `Order` com status `pending`
- Segunda chamada à API confirma o pagamento (simula aprovação da operadora)

### Entrega Digital

- Após confirmação de pagamento: gera `download_token` (UUID v4) único por pedido
- Token é válido por 48h (verificado server-side)
- URL de download: `/api/download?token=<uuid>`
- Handler verifica token no banco → se válido, serve o arquivo; se expirado/inválido, retorna 403
- Token não é reutilizável após o primeiro download (opcional, configurável)

### Email (local)

- Servidor Mailpit exposto em `http://localhost:8025` (UI web) e porta `1025` (SMTP)
- Next.js envia email via nodemailer apontando para `localhost:1025`
- Sem autenticação SMTP necessária
- Tester pode ver o email com o link de download diretamente na UI do Mailpit

### Segurança (contexto local/MVP)

- Tokens de download gerados server-side com `crypto.randomUUID()`
- Arquivos digitais não expostos diretamente em rotas públicas
- Variáveis de ambiente apenas em `.env.local`

---

## Estrutura de Diretórios

```
ecommerce-mvp/
├── app/
│   ├── page.tsx                    # Vitrine / Catálogo
│   ├── products/[slug]/page.tsx    # Página de detalhe
│   ├── cart/page.tsx               # Carrinho
│   ├── checkout/
│   │   ├── page.tsx                # Formulário de checkout
│   │   ├── success/page.tsx        # Pós-pagamento (exibe link de download)
│   │   └── cancel/page.tsx         # Cancelamento
│   └── api/
│       ├── checkout/route.ts       # Cria Order (pending)
│       ├── checkout/confirm/route.ts  # Confirma pagamento (mock)
│       └── download/route.ts       # Serve arquivo via token
├── components/
│   ├── ProductCard.tsx
│   ├── Cart.tsx
│   └── CheckoutForm.tsx
├── lib/
│   ├── db.ts                       # Prisma client
│   ├── products.ts                 # Dados de produtos (seed)
│   ├── mailer.ts                   # nodemailer → Mailpit
│   └── tokens.ts                   # Geração e validação de download tokens
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── downloads/                  # Arquivos digitais de exemplo (para dev)
├── docs/
│   └── arquitetura-e-regras-de-negocio.md  # Este documento
├── __tests__/                      # Testes unitários Jest
├── e2e/                            # Testes Playwright
├── docker-compose.yml              # Sobe Mailpit
├── .env.local.example              # Template de variáveis
└── README.md                       # Guia de setup local
```

---

## Configuração do Ambiente Local

### Pré-requisitos

```bash
node >= 18
npm >= 9
docker (apenas para Mailpit — opcional, pode ser pulado)
```

### Variáveis de Ambiente (`.env.local`)

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL=file:./dev.db
SMTP_HOST=localhost
SMTP_PORT=1025
DOWNLOAD_TOKEN_TTL_HOURS=48
```

**Zero API keys externas necessárias.**

### Comandos

```bash
# 1. Instalar dependências
npm install

# 2. Subir banco e popular com produtos de exemplo
npx prisma migrate dev
npx prisma db seed

# 3. (Opcional) Subir Mailpit para capturar emails
docker compose up -d mailpit
# UI disponível em http://localhost:8025

# 4. Rodar a aplicação
npm run dev
# Acesse http://localhost:3000
```

### `docker-compose.yml` (Mailpit)

```yaml
services:
  mailpit:
    image: axllent/mailpit
    ports:
      - "1025:1025"   # SMTP
      - "8025:8025"   # Web UI
```

---

## Fluxo de Dados (Happy Path)

```
[Usuário] → Vitrine → Adiciona ao Carrinho (localStorage)
          → Carrinho → Clica "Checkout"
          → Formulário de Checkout (email + cartão fictício)
          → [API] POST /api/checkout → cria Order (pending) no DB
          → [API] POST /api/checkout/confirm → Order vira "paid"
                                             → gera download_token (UUID, 48h)
                                             → envia email via Mailpit
          → Página de sucesso com link /api/download?token=<uuid>
          → [API] GET /api/download?token=<uuid> → valida token → serve arquivo
```

---

## Schema Prisma (simplificado)

```prisma
model Product {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String
  priceCents  Int
  category    String
  filePath    String
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  orders      Order[]
}

model Order {
  id             String    @id @default(cuid())
  buyerEmail     String
  buyerName      String
  productId      String
  product        Product   @relation(fields: [productId], references: [id])
  status         String    @default("pending")  // pending | paid | expired
  downloadToken  String?   @unique
  tokenExpiresAt DateTime?
  tokenUsed      Boolean   @default(false)
  createdAt      DateTime  @default(now())
}
```

---

## Critérios de Aceite para QA Sign-off

1. Vitrine exibe produtos ativos com preço e categoria corretos
2. Carrinho persiste entre reloads; remove duplicatas automaticamente
3. `POST /api/checkout` cria Order com status `pending`
4. `POST /api/checkout/confirm` muda status para `paid` e gera token
5. Token inválido/expirado em `/api/download` retorna 403
6. Token válido serve o arquivo corretamente
7. Email aparece na UI do Mailpit com link de download correto
8. Todos os testes unitários passando (`npm test`)
9. Testes E2E do fluxo completo aprovados (`npm run e2e`)

---

## Próximos Passos (Pós-MVP)

- Substituir mock de pagamento por Stripe (quando conta disponível)
- Autenticação (NextAuth.js)
- Dashboard do comprador (histórico de compras)
- Substituir Mailpit por provedor real de email (Resend, SendGrid)

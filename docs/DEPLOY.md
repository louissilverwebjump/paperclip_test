# Production Deployment Guide — qateam.dev

## Architecture

- **Host**: Vercel (free tier)
- **Database**: Turso (libSQL, free tier — 500MB, no credit card)
- **Domain**: qateam.dev → Vercel custom domain
- **App**: Next.js 14, `ecommerce-mvp/`

## One-Time Setup Steps (Human Required)

### 1. Create Turso Database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create database
turso db create qateam-prod

# Get connection URL
turso db show qateam-prod --url
# → libsql://qateam-prod-<org>.turso.io

# Create auth token
turso db tokens create qateam-prod
# → <token>
```

DATABASE_URL format: `libsql://<db-url>?authToken=<token>`

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# In ecommerce-mvp/ directory:
cd ecommerce-mvp
vercel

# Follow prompts:
# - Link to existing project or create new
# - Project name: qateam-dev
# - Root directory: ecommerce-mvp

# Set environment variables in Vercel dashboard or CLI:
vercel env add DATABASE_URL production
# paste: libsql://<db-url>?authToken=<token>

vercel env add NEXT_PUBLIC_BASE_URL production
# paste: https://qateam.dev

vercel env add DOWNLOAD_TOKEN_TTL_HOURS production
# paste: 48

# Deploy to production
vercel --prod
```

### 3. Add Custom Domain

In Vercel dashboard → Project → Settings → Domains:
- Add `qateam.dev`
- Add `www.qateam.dev`
- Follow DNS instructions (add CNAME/A records at your domain registrar)

### 4. Run Database Migration on Production

After deploy, run migrations against Turso:

```bash
cd ecommerce-mvp
DATABASE_URL="libsql://<db-url>?authToken=<token>" npx prisma migrate deploy
DATABASE_URL="libsql://<db-url>?authToken=<token>" npm run db:seed
```

### 5. Verify

```bash
# Check waitlist page loads
curl -I https://qateam.dev/waitlist

# Check API accepts submissions
curl -X POST https://qateam.dev/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
# Expected: {"success":true}
```

## GitHub Secrets Required (for CI/CD)

Add these in GitHub repo → Settings → Secrets → Actions:
- `VERCEL_TOKEN` — from vercel.com/account/tokens
- `VERCEL_ORG_ID` — from `.vercel/project.json` after first deploy
- `VERCEL_PROJECT_ID` — from `.vercel/project.json` after first deploy
- `DATABASE_URL` — Turso connection string

## Environment Variables Summary

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `libsql://<db>.turso.io?authToken=<token>` |
| `NEXT_PUBLIC_BASE_URL` | `https://qateam.dev` |
| `DOWNLOAD_TOKEN_TTL_HOURS` | `48` |
| `SMTP_HOST` | _(optional for now)_ |

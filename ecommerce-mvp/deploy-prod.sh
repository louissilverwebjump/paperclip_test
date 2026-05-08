#!/usr/bin/env bash
# deploy-prod.sh — One-command production deploy to Vercel + Turso
# Run from repo root. Requires: vercel CLI, turso CLI, DATABASE_URL env var set.
set -euo pipefail

cd ecommerce-mvp

echo "=== QATeam.dev Production Deploy ==="

# Validate required env
if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL is not set."
  echo "Set it to your Turso connection string:"
  echo "  export DATABASE_URL='libsql://<db>.turso.io?authToken=<token>'"
  exit 1
fi

echo "1. Running database migrations..."
npx prisma migrate deploy

echo "2. Building Next.js app..."
npm run build

echo "3. Deploying to Vercel (production)..."
npx vercel --prod --yes

echo ""
echo "=== Deploy complete ==="
echo "Verify: https://qateam.dev/waitlist"
echo "API test:"
echo "  curl -X POST https://qateam.dev/api/waitlist -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\"}'"

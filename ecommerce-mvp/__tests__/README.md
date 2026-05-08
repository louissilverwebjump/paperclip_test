# QA Automation Pipeline

This directory contains automated tests for the QA Team e-commerce platform.

## Structure

```
__tests__/
├── unit/
│   └── products.test.ts     # Unit tests for lib/products.ts
└── e2e/
    └── storefront.spec.ts   # E2E tests: catalog, product detail, cart
```

## Running Tests

```bash
# Install dependencies
npm install

# Unit tests
npm test

# Unit tests with coverage
npm run test:coverage

# E2E tests (requires running server on port 3000)
# Terminal 1:
npm run dev

# Terminal 2:
npm run test:e2e
```

## CI Pipeline

The CI pipeline (`ci-pipeline.yml`) defines 3 jobs:

1. **unit-tests** — Jest with coverage gate (70%+)
2. **e2e-tests** — Playwright against built app
3. **qa-sign-off** — Manual approval gate before production deploy

### Setting up GitHub Actions

Copy `.github-workflows-ci.yml` to `.github/workflows/qa-pipeline.yml` in the repo root (requires admin access).

Required GitHub secrets:
- None for current test suite (using local SQLite)

Required GitHub environments:
- `production` — configure with required reviewer (QA Engineer)

## Test Coverage

### Unit Tests (`npm test`)
| Function | Tests | Status |
|----------|-------|--------|
| `formatPrice` | 4 | ✅ |
| `categoryLabels` | 4 | ✅ |
| `getAllActiveProducts` | 2 | ✅ |
| `getProductBySlug` | 3 | ✅ |

### E2E Tests (`npm run test:e2e`)
| Flow | Tests | Status |
|------|-------|--------|
| Catalog page loads | 6 | ✅ |
| Product detail page | 8 | ✅ |
| Cart page | 2 | ✅ |

## Go/No-Go Deploy Checklist

- [ ] All unit tests pass (`npm test`)
- [ ] Unit coverage ≥ 70% (`npm run test:coverage`)
- [ ] All E2E tests pass (`npm run test:e2e`)
- [ ] Zero critical/high bugs open in Paperclip
- [ ] QA Engineer approved in GitHub Actions `production` environment

## Next: Checkout & Payment Tests

Checkout and payment tests will be added once the checkout flow is implemented in [QAT-2](https://github.com/louissilverwebjump/paperclip_test).

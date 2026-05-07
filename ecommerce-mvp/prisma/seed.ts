import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const url = process.env.DATABASE_URL ?? 'file:./dev.db'
const adapter = new PrismaLibSql({ url })
const prisma = new PrismaClient({ adapter })

async function main() {
  const products = [
    {
      slug: 'playwright-starter-kit',
      name: 'Playwright Starter Kit',
      description: 'Complete starter kit for end-to-end testing with Playwright. Includes page object models, fixtures, and CI configuration for GitHub Actions.',
      priceCents: 2999,
      category: 'templates',
      filePath: 'playwright-starter-kit.zip',
      active: true,
    },
    {
      slug: 'api-testing-scripts',
      name: 'API Testing Scripts Bundle',
      description: 'Collection of ready-to-use scripts for REST API testing. Covers authentication flows, CRUD operations, and error handling patterns.',
      priceCents: 1999,
      category: 'scripts',
      filePath: 'api-testing-scripts.zip',
      active: true,
    },
    {
      slug: 'qa-fundamentals-course',
      name: 'QA Fundamentals Course',
      description: 'Comprehensive course covering software testing fundamentals, test planning, bug reporting, and automation strategies. 8 hours of content.',
      priceCents: 4999,
      category: 'courses',
      filePath: 'qa-fundamentals-course.zip',
      active: true,
    },
    {
      slug: 'test-data-generator',
      name: 'Test Data Generator Tool',
      description: 'CLI tool to generate realistic test data for your test suites. Supports JSON, CSV, and SQL output formats with customizable schemas.',
      priceCents: 3499,
      category: 'tools',
      filePath: 'test-data-generator.zip',
      active: true,
    },
    {
      slug: 'cypress-template',
      name: 'Cypress E2E Template',
      description: 'Production-ready Cypress template with custom commands, interceptors, and reporting setup. Includes examples for common test scenarios.',
      priceCents: 2499,
      category: 'templates',
      filePath: 'cypress-template.zip',
      active: true,
    },
    {
      slug: 'performance-testing-guide',
      name: 'Performance Testing with k6',
      description: 'In-depth guide and scripts for load testing using k6. Covers ramp-up strategies, thresholds, and integrating performance tests into CI.',
      priceCents: 3999,
      category: 'courses',
      filePath: 'performance-testing-guide.zip',
      active: true,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
  }

  console.log('Seed completed: 6 products inserted.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

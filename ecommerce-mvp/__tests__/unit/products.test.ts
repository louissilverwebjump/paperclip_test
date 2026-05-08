/**
 * Unit Tests: lib/products.ts
 * Tests formatPrice and categoryLabels — pure functions that don't require DB.
 * getProductBySlug and getAllActiveProducts are tested via mocked Prisma client.
 */

import { formatPrice, categoryLabels, getAllActiveProducts, getProductBySlug } from '../lib/products'

// Mock the Prisma client
jest.mock('../lib/db', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}))

import { prisma } from '../lib/db'

const mockProducts = [
  {
    id: 'cuid-1',
    slug: 'playwright-starter-kit',
    name: 'Playwright Starter Kit',
    description: 'Complete starter kit for Playwright.',
    priceCents: 2999,
    category: 'templates',
    filePath: 'playwright-starter-kit.zip',
    active: true,
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'cuid-2',
    slug: 'api-testing-scripts',
    name: 'API Testing Scripts Bundle',
    description: 'Collection of API testing scripts.',
    priceCents: 1999,
    category: 'scripts',
    filePath: 'api-testing-scripts.zip',
    active: true,
    createdAt: new Date('2026-01-02'),
  },
]

describe('formatPrice', () => {
  it('should format cents as USD currency', () => {
    expect(formatPrice(2999)).toBe('$29.99')
  })

  it('should format zero correctly', () => {
    expect(formatPrice(0)).toBe('$0.00')
  })

  it('should format large amounts correctly', () => {
    expect(formatPrice(49900)).toBe('$499.00')
  })

  it('should format 99 cents correctly', () => {
    expect(formatPrice(99)).toBe('$0.99')
  })
})

describe('categoryLabels', () => {
  it('should have label for templates', () => {
    expect(categoryLabels['templates']).toBe('Templates')
  })

  it('should have label for scripts', () => {
    expect(categoryLabels['scripts']).toBe('Scripts')
  })

  it('should have label for courses', () => {
    expect(categoryLabels['courses']).toBe('Courses')
  })

  it('should have label for tools', () => {
    expect(categoryLabels['tools']).toBe('Tools')
  })
})

describe('getAllActiveProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return active products ordered by createdAt', async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts)

    const products = await getAllActiveProducts()

    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
    })
    expect(products).toHaveLength(2)
    expect(products[0].slug).toBe('playwright-starter-kit')
  })

  it('should return empty array when no active products exist', async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([])

    const products = await getAllActiveProducts()
    expect(products).toHaveLength(0)
  })
})

describe('getProductBySlug', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return product when found', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProducts[0])

    const product = await getProductBySlug('playwright-starter-kit')

    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { slug: 'playwright-starter-kit', active: true },
    })
    expect(product).not.toBeNull()
    expect(product?.name).toBe('Playwright Starter Kit')
  })

  it('should return null for non-existent slug', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null)

    const product = await getProductBySlug('does-not-exist')
    expect(product).toBeNull()
  })

  it('should return null for inactive product', async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null)

    const product = await getProductBySlug('inactive-product')
    expect(product).toBeNull()
  })
})

import { prisma } from './db'

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  priceCents: number
  category: string
  filePath: string
  active: boolean
  createdAt: Date
}

export async function getAllActiveProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'asc' },
  })
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { slug, active: true },
  })
}

export function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceCents / 100)
}

export const categoryLabels: Record<string, string> = {
  templates: 'Templates',
  scripts: 'Scripts',
  courses: 'Courses',
  tools: 'Tools',
}

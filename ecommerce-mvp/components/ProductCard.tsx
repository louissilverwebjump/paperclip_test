import Link from 'next/link'
import { Product, formatPrice, categoryLabels } from '@/lib/products'

interface ProductCardProps {
  product: Product
}

const categoryColors: Record<string, string> = {
  templates: 'bg-blue-100 text-blue-800',
  scripts: 'bg-green-100 text-green-800',
  courses: 'bg-purple-100 text-purple-800',
  tools: 'bg-orange-100 text-orange-800',
}

export default function ProductCard({ product }: ProductCardProps) {
  const categoryColor = categoryColors[product.category] ?? 'bg-gray-100 text-gray-800'
  const categoryLabel = categoryLabels[product.category] ?? product.category

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Product Image Placeholder */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-t-xl h-48 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-2">
            {product.category === 'templates' && '📋'}
            {product.category === 'scripts' && '⚙️'}
            {product.category === 'courses' && '🎓'}
            {product.category === 'tools' && '🔧'}
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColor}`}>
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h2>
        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="text-2xl font-bold text-indigo-600">
            {formatPrice(product.priceCents)}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

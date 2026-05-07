import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug, formatPrice, categoryLabels } from '@/lib/products'

interface ProductPageProps {
  params: { slug: string }
}

const categoryColors: Record<string, string> = {
  templates: 'bg-blue-100 text-blue-800',
  scripts: 'bg-green-100 text-green-800',
  courses: 'bg-purple-100 text-purple-800',
  tools: 'bg-orange-100 text-orange-800',
}

const categoryEmojis: Record<string, string> = {
  templates: '📋',
  scripts: '⚙️',
  courses: '🎓',
  tools: '🔧',
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const categoryColor = categoryColors[product.category] ?? 'bg-gray-100 text-gray-800'
  const categoryLabel = categoryLabels[product.category] ?? product.category
  const emoji = categoryEmojis[product.category] ?? '📦'

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600">QA Team Store</Link>
          <nav className="flex items-center gap-4">
            <Link href="/cart" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
              🛒 Cart
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-16 min-h-[320px]">
              <div className="text-center">
                <div className="text-8xl mb-4">{emoji}</div>
                <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${categoryColor}`}>
                  {categoryLabel}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-8 flex flex-col">
              <div className="flex-1">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColor} mb-3 inline-block`}>
                  {categoryLabel}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                  {product.name}
                </h1>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Features placeholder */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">What&apos;s included:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Instant digital download
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Lifetime access
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Ready for production use
                    </li>
                  </ul>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-indigo-600">
                    {formatPrice(product.priceCents)}
                  </span>
                  <span className="text-gray-500 text-sm">one-time payment</span>
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    data-product-id={product.id}
                    data-product-slug={product.slug}
                    data-product-name={product.name}
                    data-product-price={product.priceCents}
                  >
                    Add to Cart
                  </button>
                  <Link
                    href={`/checkout?productId=${product.id}`}
                    className="bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Buy Now
                  </Link>
                </div>

                <p className="text-xs text-gray-400 mt-3 text-center">
                  Secure checkout · Instant delivery
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to catalog */}
        <div className="mt-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
            ← Back to all products
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2026 QA Team Store. Digital products for testing professionals.</p>
        </div>
      </footer>
    </main>
  )
}

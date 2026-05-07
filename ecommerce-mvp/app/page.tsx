import { getAllActiveProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60

export default async function StorefrontPage() {
  const products = await getAllActiveProducts()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">QA Team Store</h1>
            <p className="text-sm text-gray-500">Digital products for QA engineers & testers</p>
          </div>
          <nav className="flex items-center gap-4">
            <a href="/cart" className="text-gray-600 hover:text-indigo-600 text-sm font-medium flex items-center gap-1">
              🛒 Cart
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Level Up Your QA Skills</h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Professional templates, scripts, courses, and tools crafted for software testers and QA engineers.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900">All Products</h3>
          <span className="text-sm text-gray-500">{products.length} products</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2026 QA Team Store. Digital products for testing professionals.</p>
        </div>
      </footer>
    </main>
  )
}

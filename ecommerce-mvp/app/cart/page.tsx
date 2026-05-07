'use client'

export default function CartPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-indigo-600">QA Team Store</a>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        <p className="text-gray-500">Cart functionality coming soon.</p>
        <a href="/" className="mt-4 inline-block text-indigo-600 hover:underline">← Continue Shopping</a>
      </div>
    </main>
  )
}

import { Metadata } from 'next'
import WaitlistForm from '@/components/WaitlistForm'

export const metadata: Metadata = {
  title: 'Join the Waitlist | QA Toolkit',
  description:
    'Professional templates, scripts, courses, and tools crafted for software testers. Join the waitlist for early access and launch pricing.',
}

const VALUE_BULLETS = [
  {
    icon: '✅',
    title: 'Ready-to-use QA templates',
    detail: 'Playwright, Cypress, k6, and more — production-grade, instantly reusable.',
  },
  {
    icon: '✅',
    title: 'Early-access launch pricing',
    detail: 'Waitlist members get exclusive discounts before the public launch.',
  },
  {
    icon: '✅',
    title: 'Scripts, courses & tools in one place',
    detail: 'Everything a software tester needs, curated and maintained by QA professionals.',
  },
]

export default function WaitlistPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1 mb-4 uppercase tracking-wide">
            Coming Soon
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            The QA Toolkit You&apos;ve Been Waiting For
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Professional templates, scripts, courses, and tools crafted for software testers. Join
            the waitlist for <span className="font-semibold text-indigo-600">early access</span> and{' '}
            <span className="font-semibold text-indigo-600">launch pricing</span>.
          </p>
        </div>

        {/* Value bullets */}
        <ul className="space-y-4 mb-10">
          {VALUE_BULLETS.map((bullet) => (
            <li
              key={bullet.title}
              className="flex items-start gap-3 rounded-xl bg-white border border-gray-100 shadow-sm px-5 py-4"
            >
              <span className="text-xl mt-0.5">{bullet.icon}</span>
              <div>
                <p className="font-semibold text-gray-900">{bullet.title}</p>
                <p className="text-sm text-gray-500">{bullet.detail}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Email signup form */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Get early access</h2>
          <p className="text-sm text-gray-500 mb-5">
            No spam, ever. Unsubscribe at any time.
          </p>
          <WaitlistForm />
        </div>
      </div>
    </main>
  )
}

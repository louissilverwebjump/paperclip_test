'use client'

import { useState, FormEvent } from 'react'

type FormState = 'idle' | 'loading' | 'success' | 'already_registered' | 'error'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        setState('error')
        return
      }

      if (data.alreadyRegistered) {
        setState('already_registered')
      } else {
        setState('success')
      }
    } catch {
      setErrorMessage('Network error. Please try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-xl bg-indigo-50 border border-indigo-200 px-6 py-8 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-xl font-semibold text-indigo-900 mb-2">You&apos;re on the list!</h3>
        <p className="text-indigo-700">
          We&apos;ll notify <strong>{email}</strong> when we launch. Expect early-access pricing and
          exclusive perks.
        </p>
      </div>
    )
  }

  if (state === 'already_registered') {
    return (
      <div className="rounded-xl bg-blue-50 border border-blue-200 px-6 py-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-xl font-semibold text-blue-900 mb-2">Already registered!</h3>
        <p className="text-blue-700">
          <strong>{email}</strong> is already on the waitlist. We&apos;ll be in touch soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        disabled={state === 'loading'}
        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold
          hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
      >
        {state === 'loading' ? 'Joining…' : 'Join Waitlist'}
      </button>
      {state === 'error' && (
        <p className="w-full text-sm text-red-600 mt-1">{errorMessage}</p>
      )}
    </form>
  )
}

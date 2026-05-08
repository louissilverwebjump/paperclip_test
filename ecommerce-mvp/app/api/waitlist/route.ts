import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/waitlist
 * Accepts { email: string }, validates format, saves to DB.
 * Returns { success: true } or { success: true, alreadyRegistered: true } for duplicates.
 * Returns { error: string } with 400 for invalid input.
 */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email } = body as { email?: unknown }

  // Validate email presence and format
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
  }

  const normalizedEmail = email.toLowerCase().trim()

  try {
    await prisma.waitlistEntry.create({
      data: { email: normalizedEmail },
    })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    // Prisma unique constraint violation — email already registered
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json({ success: true, alreadyRegistered: true })
    }
    console.error('Waitlist API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

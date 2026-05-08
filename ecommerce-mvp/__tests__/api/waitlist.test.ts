/**
 * Unit Tests: app/api/waitlist/route.ts
 * Tests the POST /api/waitlist handler using mocked Prisma client.
 */

import { NextRequest } from 'next/server'
import { POST } from '../../app/api/waitlist/route'

// Mock the Prisma client
jest.mock('../../lib/db', () => ({
  prisma: {
    waitlistEntry: {
      create: jest.fn(),
    },
  },
}))

import { prisma } from '../../lib/db'

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/waitlist', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('saves a valid email to the DB and returns success', async () => {
    ;(prisma.waitlistEntry.create as jest.Mock).mockResolvedValue({
      id: 'cuid-1',
      email: 'test@example.com',
      createdAt: new Date(),
    })

    const res = await POST(makeRequest({ email: 'test@example.com' }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({ success: true })
    expect(prisma.waitlistEntry.create).toHaveBeenCalledWith({
      data: { email: 'test@example.com' },
    })
  })

  it('normalises email to lowercase before saving', async () => {
    ;(prisma.waitlistEntry.create as jest.Mock).mockResolvedValue({
      id: 'cuid-2',
      email: 'user@example.com',
      createdAt: new Date(),
    })

    await POST(makeRequest({ email: 'User@Example.COM' }))

    expect(prisma.waitlistEntry.create).toHaveBeenCalledWith({
      data: { email: 'user@example.com' },
    })
  })

  it('returns success with alreadyRegistered when email is a duplicate', async () => {
    // Simulate Prisma unique constraint error (P2002)
    const duplicateError = Object.assign(new Error('Unique constraint failed'), { code: 'P2002' })
    ;(prisma.waitlistEntry.create as jest.Mock).mockRejectedValue(duplicateError)

    const res = await POST(makeRequest({ email: 'existing@example.com' }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({ success: true, alreadyRegistered: true })
  })

  it('returns 400 for an invalid email format', async () => {
    const res = await POST(makeRequest({ email: 'not-an-email' }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toMatch(/invalid email/i)
    expect(prisma.waitlistEntry.create).not.toHaveBeenCalled()
  })

  it('returns 400 when email field is missing', async () => {
    const res = await POST(makeRequest({}))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
    expect(prisma.waitlistEntry.create).not.toHaveBeenCalled()
  })

  it('returns 400 for an empty string email', async () => {
    const res = await POST(makeRequest({ email: '' }))
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
    expect(prisma.waitlistEntry.create).not.toHaveBeenCalled()
  })
})

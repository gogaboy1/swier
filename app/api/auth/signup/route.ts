import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { hashPassword, generateToken } from '@/lib/auth'
import { cookies } from 'next/headers'

function generateId() {
  return 'user_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM User WHERE email = ?').get(email)
    if (existingUser) {
      db.close()
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const userId = generateId()
    const createdAt = new Date().toISOString()

    db.prepare(`
      INSERT INTO User (id, email, password, name, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, email, hashedPassword, name || null, createdAt)

    // Create empty profile
    const profileId = 'profile_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    db.prepare(`
      INSERT INTO Profile (id, userId)
      VALUES (?, ?)
    `).run(profileId, userId)

    db.close()

    // Generate JWT token
    const token = await generateToken(userId, email)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return NextResponse.json({
      success: true,
      user: { id: userId, email, name }
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { verifyPassword, generateToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath, { readonly: true })

    // Find user
    const user = db.prepare('SELECT id, email, password, name FROM User WHERE email = ?').get(email) as any

    db.close()

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Generate JWT token
    const token = await generateToken(user.id, user.email)

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
      user: { id: user.id, email: user.email, name: user.name }
    })
  } catch (error: any) {
    console.error('Signin error:', error)
    
    // Check if it's a database error (SQLite not working on Vercel)
    if (error.message?.includes('SQLITE') || error.message?.includes('database') || error.code === 'SQLITE_CANTOPEN') {
      return NextResponse.json({ 
        error: 'Database is currently unavailable. Please try again later or contact support.' 
      }, { status: 503 })
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to sign in' 
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      }
    })

    const userId = user.id

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
      user: { id: user.id, email: user.email, name: user.name }
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    
    // Check if it's a database error (SQLite not working on Vercel)
    if (error.message?.includes('SQLITE') || error.message?.includes('database') || error.code === 'SQLITE_CANTOPEN') {
      return NextResponse.json({ 
        error: 'Database is currently unavailable. Please try again later or contact support.' 
      }, { status: 503 })
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to create account' 
    }, { status: 500 })
  }
}

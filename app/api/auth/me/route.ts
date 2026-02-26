import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath, { readonly: true })

    const user = db.prepare(`
      SELECT u.id, u.email, u.name, u.avatar, u.createdAt,
             p.bio, p.instagram, p.telegram, p.location
      FROM User u
      LEFT JOIN Profile p ON u.id = p.userId
      WHERE u.id = ?
    `).get(currentUser.userId) as any

    db.close()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
  }
}

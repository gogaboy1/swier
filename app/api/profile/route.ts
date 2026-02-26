import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import Database from 'better-sqlite3'
import path from 'path'

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { name, bio, instagram, telegram, location, avatar } = await request.json()

    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)

    db.prepare(`
      UPDATE User 
      SET name = ?, bio = ?, instagram = ?, telegram = ?, location = ?, avatar = ?
      WHERE id = ?
    `).run(name, bio, instagram, telegram, location, avatar, currentUser.userId)

    const updatedUser = db.prepare(`
      SELECT id, email, name, avatar, bio, instagram, telegram, location, createdAt
      FROM User
      WHERE id = ?
    `).get(currentUser.userId)

    db.close()

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

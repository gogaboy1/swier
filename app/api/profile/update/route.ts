import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { getCurrentUser } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { name, bio, location, instagram, telegram, avatar } = body

    // Validate avatar size if present
    if (avatar && avatar.length > 1000000) { // ~750KB base64
      return NextResponse.json({ error: 'Avatar too large. Please use a smaller image.' }, { status: 400 })
    }

    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)

    try {
      // Update User table
      db.prepare(`
        UPDATE User 
        SET name = ?, avatar = ?
        WHERE id = ?
      `).run(name || null, avatar || null, currentUser.userId)

      // Update Profile table
      db.prepare(`
        UPDATE Profile 
        SET bio = ?, location = ?, instagram = ?, telegram = ?
        WHERE userId = ?
      `).run(
        bio || null,
        location || null,
        instagram || null,
        telegram || null,
        currentUser.userId
      )

      db.close()

      return NextResponse.json({ success: true })
    } catch (dbError) {
      db.close()
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Database error: ' + (dbError as Error).message }, { status: 500 })
    }
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Failed to update profile: ' + (error as Error).message }, { status: 500 })
  }
}

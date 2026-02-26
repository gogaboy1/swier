import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { getCurrentUser } from '@/lib/auth'

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function POST(request: NextRequest) {
  try {
    let currentUser
    try {
      currentUser = await getCurrentUser()
    } catch (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json({ error: 'Authentication error' }, { status: 500 })
    }
    
    console.log('🔐 Like API called, currentUser:', currentUser ? `userId=${currentUser.userId}` : 'NOT AUTHENTICATED')
    
    if (!currentUser) {
      console.log('❌ Like creation failed: User not authenticated')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { startupId } = await request.json()
    console.log('📥 Like request for startupId:', startupId)
    
    if (!startupId) {
      return NextResponse.json({ error: 'Missing startupId' }, { status: 400 })
    }
    
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)
    
    // Check if already liked
    const existing = db.prepare('SELECT id FROM Like WHERE userId = ? AND startupId = ?').get(currentUser.userId, startupId)
    
    if (!existing) {
      const likeId = generateUUID()
      db.prepare(`
        INSERT INTO Like (id, userKey, userId, startupId, createdAt)
        VALUES (?, ?, ?, ?, datetime('now'))
      `).run(likeId, currentUser.userId, currentUser.userId, startupId)
      console.log(`✅ Like created: userId=${currentUser.userId}, startupId=${startupId}`)
    } else {
      console.log(`⚠️ Like already exists: userId=${currentUser.userId}, startupId=${startupId}`)
    }
    
    db.close()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating like:', error)
    return NextResponse.json({ error: 'Failed to create like' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { startupId } = await request.json()
    
    if (!startupId) {
      return NextResponse.json({ error: 'Missing startupId' }, { status: 400 })
    }
    
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)
    
    db.prepare('DELETE FROM Like WHERE userId = ? AND startupId = ?').run(currentUser.userId, startupId)
    
    db.close()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting like:', error)
    return NextResponse.json({ error: 'Failed to delete like' }, { status: 500 })
  }
}

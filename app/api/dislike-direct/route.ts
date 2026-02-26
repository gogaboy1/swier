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
    
    // Check if already disliked
    const existing = db.prepare('SELECT id FROM Dislike WHERE userId = ? AND startupId = ?').get(currentUser.userId, startupId)
    
    if (!existing) {
      db.prepare(`
        INSERT INTO Dislike (id, userKey, userId, startupId, createdAt)
        VALUES (?, ?, ?, ?, datetime('now'))
      `).run(generateUUID(), currentUser.userId, currentUser.userId, startupId)
    }
    
    db.close()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating dislike:', error)
    return NextResponse.json({ error: 'Failed to create dislike' }, { status: 500 })
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
    
    db.prepare('DELETE FROM Dislike WHERE userId = ? AND startupId = ?').run(currentUser.userId, startupId)
    
    db.close()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting dislike:', error)
    return NextResponse.json({ error: 'Failed to delete dislike' }, { status: 500 })
  }
}

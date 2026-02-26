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

// GET comments for a startup
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const startupId = searchParams.get('startupId')
  
  if (!startupId) {
    return NextResponse.json({ error: 'Missing startupId' }, { status: 400 })
  }
  
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath, { readonly: true })
    
    const comments = db.prepare(`
      SELECT c.id, c.text, c.createdAt, c.userId,
             u.name as userName, u.email as userEmail
      FROM Comment c
      LEFT JOIN User u ON c.userId = u.id
      WHERE c.startupId = ?
      ORDER BY c.createdAt DESC
    `).all(startupId)
    
    db.close()
    
    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

// POST a new comment
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { startupId, text } = await request.json()
    
    if (!startupId || !text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    if (text.length > 500) {
      return NextResponse.json({ error: 'Comment too long (max 500 characters)' }, { status: 400 })
    }
    
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)
    
    // Create Comment table if it doesn't exist
    try {
      db.prepare(`
        CREATE TABLE IF NOT EXISTS Comment (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          startupId TEXT NOT NULL,
          text TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
          FOREIGN KEY (startupId) REFERENCES Startup(id) ON DELETE CASCADE
        )
      `).run()
    } catch (e) {
      // Table already exists
    }

    const commentId = generateUUID()
    
    db.prepare(`
      INSERT INTO Comment (id, userId, startupId, text, createdAt)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).run(commentId, currentUser.userId, startupId, text.trim())
    
    db.close()
    
    return NextResponse.json({ success: true, id: commentId })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}

// DELETE a comment
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const commentId = searchParams.get('commentId')
    
    if (!commentId) {
      return NextResponse.json({ error: 'Missing commentId' }, { status: 400 })
    }
    
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)
    
    // Check if comment exists and belongs to the user
    const comment = db.prepare(`
      SELECT userId FROM Comment WHERE id = ?
    `).get(commentId) as { userId: string } | undefined
    
    if (!comment) {
      db.close()
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }
    
    if (comment.userId !== currentUser.userId) {
      db.close()
      return NextResponse.json({ error: 'Not authorized to delete this comment' }, { status: 403 })
    }
    
    // Delete the comment
    db.prepare(`DELETE FROM Comment WHERE id = ?`).run(commentId)
    
    db.close()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}

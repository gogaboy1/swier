import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath, { readonly: true })
    
    const startups = db.prepare('SELECT * FROM Startup ORDER BY createdAt DESC').all()
    
    db.close()
    
    return NextResponse.json(startups)
  } catch (error) {
    console.error('Error fetching startups:', error)
    return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, isFeatured, rejectReason } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Missing startup ID' }, { status: 400 })
    }
    
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)
    
    // Add rejectReason column if it doesn't exist
    try {
      db.prepare('ALTER TABLE Startup ADD COLUMN rejectReason TEXT').run()
    } catch (e) {
      // Column already exists
    }
    
    if (status !== undefined) {
      if (status === 'rejected' && rejectReason) {
        db.prepare('UPDATE Startup SET status = ?, rejectReason = ?, updatedAt = datetime(\'now\') WHERE id = ?').run(status, rejectReason, id)
      } else {
        db.prepare('UPDATE Startup SET status = ?, updatedAt = datetime(\'now\') WHERE id = ?').run(status, id)
      }
    }
    
    if (isFeatured !== undefined) {
      db.prepare('UPDATE Startup SET isFeatured = ?, updatedAt = datetime(\'now\') WHERE id = ?').run(isFeatured ? 1 : 0, id)
    }
    
    db.close()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating startup:', error)
    return NextResponse.json({ error: 'Failed to update startup' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Missing startup ID' }, { status: 400 })
    }
    
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)
    
    db.prepare('DELETE FROM Startup WHERE id = ?').run(id)
    
    db.close()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting startup:', error)
    return NextResponse.json({ error: 'Failed to delete startup' }, { status: 500 })
  }
}

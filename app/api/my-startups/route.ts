import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath, { readonly: true })
    
    const startups = db.prepare(`
      SELECT * FROM Startup 
      WHERE userId = ? 
      ORDER BY createdAt DESC
    `).all(currentUser.userId)
    
    db.close()
    
    return NextResponse.json(startups)
  } catch (error) {
    console.error('Error fetching user startups:', error)
    return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath, { readonly: true })
    
    const favorites = db.prepare(`
      SELECT s.* 
      FROM Startup s
      INNER JOIN Like l ON s.id = l.startupId
      WHERE l.userId = ?
      ORDER BY l.createdAt DESC
    `).all(currentUser.userId)
    
    console.log(`📋 Favorites for userId=${currentUser.userId}: ${favorites.length} items`)
    
    db.close()
    
    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

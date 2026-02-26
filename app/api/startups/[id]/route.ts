import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath, { readonly: true })
    
    const startup = db.prepare('SELECT * FROM Startup WHERE id = ?').get(id)
    
    db.close()
    
    if (!startup) {
      return NextResponse.json({ error: 'Startup not found' }, { status: 404 })
    }
    
    return NextResponse.json(startup)
  } catch (error) {
    console.error('Error fetching startup:', error)
    return NextResponse.json({ error: 'Failed to fetch startup' }, { status: 500 })
  }
}

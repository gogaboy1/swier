import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const geo = searchParams.get('geo') // optional filter: 'Russia', 'Worldwide', or null for all
  
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath, { readonly: true })
    
    // Get startups with their likes count
    let query = `
      SELECT 
        s.id,
        s.name,
        s.logo,
        s.geo,
        s.shortDescription,
        COUNT(l.id) as likesCount
      FROM Startup s
      LEFT JOIN Like l ON s.id = l.startupId
      WHERE s.status = 'approved'
    `
    
    const params: any[] = []
    
    if (geo) {
      query += ` AND s.geo = ?`
      params.push(geo)
    }
    
    query += `
      GROUP BY s.id
      ORDER BY likesCount DESC, s.createdAt DESC
    `
    
    const startups = db.prepare(query).all(...params)
    
    console.log('Rating query result:', startups.slice(0, 5)) // Log top 5 for debugging
    
    db.close()
    
    return NextResponse.json(startups)
  } catch (error) {
    console.error('Error fetching rating:', error)
    return NextResponse.json({ error: 'Failed to fetch rating' }, { status: 500 })
  }
}

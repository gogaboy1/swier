import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const geo = searchParams.get('geo')
  const category = searchParams.get('category')
  
  const currentUser = await getCurrentUser()
  
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath, { readonly: true })
    
    let startups: any[] = []
    
    // Russia tab shows only Russian startups that are approved
    // For backwards compatibility: show if paymentStatus is 'paid' OR null/unpaid (old startups)
    if (geo === 'Russia') {
      const query = `SELECT * FROM Startup WHERE status = 'approved' AND geo = ? ORDER BY createdAt DESC`
      startups = db.prepare(query).all('Russia')
    } 
    // Worldwide tab shows interleaved Russian and Worldwide startups (approved)
    else if (geo === 'Worldwide') {
      const russiaQuery = `SELECT * FROM Startup WHERE status = 'approved' AND geo = 'Russia' ORDER BY createdAt DESC`
      const worldwideQuery = `SELECT * FROM Startup WHERE status = 'approved' AND geo = 'Worldwide' ORDER BY createdAt DESC`
      
      const russiaStartups = db.prepare(russiaQuery).all()
      const worldwideStartups = db.prepare(worldwideQuery).all()
      
      // Interleave: 1 Russia, 1 Worldwide
      const maxLength = Math.max(russiaStartups.length, worldwideStartups.length)
      for (let i = 0; i < maxLength; i++) {
        if (i < russiaStartups.length) {
          startups.push(russiaStartups[i])
        }
        if (i < worldwideStartups.length) {
          startups.push(worldwideStartups[i])
        }
      }
    }
    // Default: show all approved
    else {
      const query = `SELECT * FROM Startup WHERE status = 'approved' ORDER BY createdAt DESC`
      startups = db.prepare(query).all()
    }
    
    // Filter by category if provided
    if (category) {
      startups = startups.filter((s: any) => s.tags && s.tags.toLowerCase().includes(category.toLowerCase()))
    }
    
    // Filter out already liked/disliked startups only if user is authenticated
    if (currentUser) {
      const likedIds = db.prepare('SELECT startupId FROM Like WHERE userId = ?').all(currentUser.userId).map((r: any) => r.startupId)
      const dislikedIds = db.prepare('SELECT startupId FROM Dislike WHERE userId = ?').all(currentUser.userId).map((r: any) => r.startupId)
      
      const excludedIds = new Set([...likedIds, ...dislikedIds])
      startups = startups.filter((s: any) => !excludedIds.has(s.id))
    }
    
    db.close()
    
    return NextResponse.json(startups)
  } catch (error) {
    console.error('Error fetching startups:', error)
    return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 })
  }
}

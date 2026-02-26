import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { isAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const adminPassword = request.headers.get('x-admin-password')
  
  const isUserAdmin = await isAdmin(adminPassword)
  if (!isUserAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath, { readonly: true })

    const now = new Date()
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // User statistics
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM User').get() as { count: number }
    const usersLast24h = db.prepare('SELECT COUNT(*) as count FROM User WHERE createdAt >= ?').get(dayAgo) as { count: number }
    const usersLast7d = db.prepare('SELECT COUNT(*) as count FROM User WHERE createdAt >= ?').get(weekAgo) as { count: number }

    // Startup statistics
    const totalStartups = db.prepare('SELECT COUNT(*) as count FROM Startup').get() as { count: number }
    const pendingStartups = db.prepare('SELECT COUNT(*) as count FROM Startup WHERE status = ?').get('pending') as { count: number }
    const approvedStartups = db.prepare('SELECT COUNT(*) as count FROM Startup WHERE status = ?').get('approved') as { count: number }
    const rejectedStartups = db.prepare('SELECT COUNT(*) as count FROM Startup WHERE status = ?').get('rejected') as { count: number }

    // Vote/Like statistics
    const totalLikes = db.prepare('SELECT COUNT(*) as count FROM [Like]').get() as { count: number }
    const likesLast24h = db.prepare('SELECT COUNT(*) as count FROM [Like] WHERE createdAt >= ?').get(dayAgo) as { count: number }
    
    const totalDislikes = db.prepare('SELECT COUNT(*) as count FROM Dislike').get() as { count: number }
    const dislikesLast24h = db.prepare('SELECT COUNT(*) as count FROM Dislike WHERE createdAt >= ?').get(dayAgo) as { count: number }

    const totalVotes = totalLikes.count + totalDislikes.count
    const votesLast24h = likesLast24h.count + dislikesLast24h.count

    // Conversion rate
    const conversionRate = totalVotes > 0 ? ((totalLikes.count / totalVotes) * 100).toFixed(1) : '0'

    // Top 5 startups by likes
    const topStartups = db.prepare(`
      SELECT 
        s.id,
        s.name,
        s.logo,
        COUNT(l.id) as likesCount
      FROM Startup s
      LEFT JOIN [Like] l ON s.id = l.startupId
      WHERE s.status = 'approved'
      GROUP BY s.id
      ORDER BY likesCount DESC
      LIMIT 5
    `).all()

    db.close()

    const stats = {
      users: {
        total: totalUsers.count,
        last24h: usersLast24h.count,
        last7d: usersLast7d.count,
      },
      startups: {
        total: totalStartups.count,
        pending: pendingStartups.count,
        approved: approvedStartups.count,
        rejected: rejectedStartups.count,
      },
      votes: {
        total: totalVotes,
        last24h: votesLast24h,
      },
      likes: {
        total: totalLikes.count,
        last24h: likesLast24h.count,
      },
      dislikes: {
        total: totalDislikes.count,
        last24h: dislikesLast24h.count,
      },
      conversionRate,
      topStartups,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

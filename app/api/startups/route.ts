import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const geo = searchParams.get('geo')
  const userKey = searchParams.get('userKey')
  
  try {
    const where: any = {
      status: 'approved'
    }
    
    if (geo && (geo === 'Russia' || geo === 'Worldwide')) {
      where.geo = geo
    }
    
    let startups = await prisma.startup.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    if (userKey) {
      const [likes, dislikes] = await Promise.all([
        prisma.like.findMany({
          where: { userKey },
          select: { startupId: true }
        }),
        prisma.dislike.findMany({
          where: { userKey },
          select: { startupId: true }
        })
      ])
      
      const likedIds = new Set(likes.map(l => l.startupId))
      const dislikedIds = new Set(dislikes.map(d => d.startupId))
      
      startups = startups.filter(s => !likedIds.has(s.id) && !dislikedIds.has(s.id))
    }
    
    return NextResponse.json(startups)
  } catch (error) {
    console.error('Error fetching startups:', error)
    return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 })
  }
}

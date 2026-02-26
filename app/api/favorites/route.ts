import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userKey = searchParams.get('userKey')
  
  if (!userKey) {
    return NextResponse.json({ error: 'Missing userKey' }, { status: 400 })
  }
  
  try {
    const likes = await prisma.like.findMany({
      where: { userKey },
      include: {
        startup: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    const startups = likes.map(like => like.startup)
    
    return NextResponse.json(startups)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const startups = await prisma.startup.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(startups)
  } catch (error) {
    console.error('Error fetching startups:', error)
    return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 })
  }
}

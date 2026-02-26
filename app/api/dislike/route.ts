import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userKey, startupId } = await request.json()
    
    if (!userKey || !startupId) {
      return NextResponse.json(
        { error: 'Missing userKey or startupId' },
        { status: 400 }
      )
    }
    
    const dislike = await prisma.dislike.upsert({
      where: {
        userKey_startupId: {
          userKey,
          startupId
        }
      },
      create: {
        userKey,
        startupId
      },
      update: {}
    })
    
    return NextResponse.json(dislike)
  } catch (error) {
    console.error('Error creating dislike:', error)
    return NextResponse.json({ error: 'Failed to create dislike' }, { status: 500 })
  }
}

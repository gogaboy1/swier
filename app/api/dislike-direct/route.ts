import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { startupId } = await request.json()
    
    if (!startupId) {
      return NextResponse.json({ error: 'Missing startupId' }, { status: 400 })
    }
    
    // Check if already disliked
    const existing = await prisma.dislike.findFirst({
      where: {
        userId: currentUser.userId,
        startupId: startupId
      }
    })
    
    if (!existing) {
      await prisma.dislike.create({
        data: {
          userId: currentUser.userId,
          startupId: startupId
        }
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating dislike:', error)
    return NextResponse.json({ error: 'Failed to create dislike' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { startupId } = await request.json()
    
    if (!startupId) {
      return NextResponse.json({ error: 'Missing startupId' }, { status: 400 })
    }
    
    await prisma.dislike.deleteMany({
      where: {
        userId: currentUser.userId,
        startupId: startupId
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting dislike:', error)
    return NextResponse.json({ error: 'Failed to delete dislike' }, { status: 500 })
  }
}

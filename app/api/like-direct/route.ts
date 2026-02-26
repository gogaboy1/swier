import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    let currentUser
    try {
      currentUser = await getCurrentUser()
    } catch (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json({ error: 'Authentication error' }, { status: 500 })
    }
    
    console.log('🔐 Like API called, currentUser:', currentUser ? `userId=${currentUser.userId}` : 'NOT AUTHENTICATED')
    
    if (!currentUser) {
      console.log('❌ Like creation failed: User not authenticated')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { startupId } = await request.json()
    console.log('📥 Like request for startupId:', startupId)
    
    if (!startupId) {
      return NextResponse.json({ error: 'Missing startupId' }, { status: 400 })
    }
    
    // Check if already liked
    const existing = await prisma.like.findFirst({
      where: {
        userId: currentUser.userId,
        startupId: startupId
      }
    })
    
    if (!existing) {
      await prisma.like.create({
        data: {
          userId: currentUser.userId,
          startupId: startupId
        }
      })
      console.log(`✅ Like created: userId=${currentUser.userId}, startupId=${startupId}`)
    } else {
      console.log(`⚠️ Like already exists: userId=${currentUser.userId}, startupId=${startupId}`)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating like:', error)
    return NextResponse.json({ error: 'Failed to create like' }, { status: 500 })
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
    
    await prisma.like.deleteMany({
      where: {
        userId: currentUser.userId,
        startupId: startupId
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting like:', error)
    return NextResponse.json({ error: 'Failed to delete like' }, { status: 500 })
  }
}

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
    
    await prisma.dislike.deleteMany({
      where: {
        userKey,
        startupId
      }
    })
    
    const like = await prisma.like.upsert({
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
    
    return NextResponse.json(like)
  } catch (error) {
    console.error('Error creating like:', error)
    return NextResponse.json({ error: 'Failed to create like' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userKey, startupId } = await request.json()
    
    if (!userKey || !startupId) {
      return NextResponse.json(
        { error: 'Missing userKey or startupId' },
        { status: 400 }
      )
    }
    
    await prisma.like.deleteMany({
      where: {
        userKey,
        startupId
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting like:', error)
    return NextResponse.json({ error: 'Failed to delete like' }, { status: 500 })
  }
}

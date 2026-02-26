import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const startups = await prisma.startup.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    })

    // Fetch user info for each startup
    const startupsWithUsers = await Promise.all(
      startups.map(async (startup) => {
        if (startup.userId) {
          const user = await prisma.user.findUnique({
            where: { id: startup.userId },
            select: { email: true, name: true }
          })
          return {
            ...startup,
            userEmail: user?.email,
            userName: user?.name
          }
        }
        return startup
      })
    )
    
    return NextResponse.json(startupsWithUsers)
  } catch (error) {
    console.error('Error fetching startups:', error)
    return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, isFeatured, rejectReason } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Missing startup ID' }, { status: 400 })
    }
    
    const updateData: any = {}
    
    if (status !== undefined) {
      updateData.status = status
      if (status === 'rejected' && rejectReason) {
        updateData.rejectReason = rejectReason
      }
    }
    
    if (isFeatured !== undefined) {
      updateData.isFeatured = isFeatured
    }
    
    await prisma.startup.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating startup:', error)
    return NextResponse.json({ error: 'Failed to update startup' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Missing startup ID' }, { status: 400 })
    }
    
    await prisma.startup.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting startup:', error)
    return NextResponse.json({ error: 'Failed to delete startup' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { name, bio, instagram, telegram, location, avatar } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.userId },
      data: {
        name,
        bio,
        instagram,
        telegram,
        location,
        avatar
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        instagram: true,
        telegram: true,
        location: true,
        createdAt: true
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeTelegram, normalizeWhatsApp } from '@/lib/contacts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      logo,
      shortDescription,
      longDescription,
      geo,
      stage,
      tags,
      telegram,
      email,
      whatsapp,
      website
    } = body
    
    if (!name || !shortDescription || !longDescription || !geo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const startup = await prisma.startup.create({
      data: {
        name,
        logo: logo || null,
        shortDescription,
        longDescription,
        geo,
        stage: stage || 'other',
        tags: Array.isArray(tags) ? tags.join(',') : tags || '',
        telegramUsername: telegram ? normalizeTelegram(telegram) : null,
        email: email || null,
        whatsappPhone: whatsapp ? normalizeWhatsApp(whatsapp) : null,
        website: website || null,
        status: 'pending'
      }
    })
    
    return NextResponse.json(startup, { status: 201 })
  } catch (error) {
    console.error('Error creating startup:', error)
    return NextResponse.json({ error: 'Failed to create startup' }, { status: 500 })
  }
}

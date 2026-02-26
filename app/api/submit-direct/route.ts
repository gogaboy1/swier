import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { getCurrentUser } from '@/lib/auth'

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    
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
      website,
      seekingInvestment
    } = body

    if (!name || !shortDescription || !longDescription || !geo || !stage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)

    // Add columns if they don't exist
    try {
      db.prepare(`ALTER TABLE Startup ADD COLUMN seekingInvestment INTEGER DEFAULT 0`).run()
    } catch (e) {}
    
    try {
      db.prepare(`ALTER TABLE Startup ADD COLUMN userId TEXT`).run()
    } catch (e) {}
    
    try {
      db.prepare(`ALTER TABLE Startup ADD COLUMN paymentStatus TEXT DEFAULT 'unpaid'`).run()
    } catch (e) {}
    
    try {
      db.prepare(`ALTER TABLE Startup ADD COLUMN paidAt TEXT`).run()
    } catch (e) {}
    
    try {
      db.prepare(`ALTER TABLE Startup ADD COLUMN priceRub INTEGER DEFAULT 290`).run()
    } catch (e) {}
    
    try {
      db.prepare(`ALTER TABLE Startup ADD COLUMN publishedAt TEXT`).run()
    } catch (e) {}
    
    try {
      db.prepare(`ALTER TABLE Startup ADD COLUMN rejectReason TEXT`).run()
    } catch (e) {}

    const id = generateUUID()
    
    db.prepare(`
      INSERT INTO Startup (
        id, name, logo, shortDescription, longDescription, 
        geo, stage, tags, telegramUsername, email, website, 
        status, isFeatured, seekingInvestment, userId, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
      id,
      name,
      logo || null,
      shortDescription,
      longDescription,
      geo,
      stage,
      tags || '',
      telegram || null,
      email || null,
      website || null,
      'pending',
      0,
      seekingInvestment ? 1 : 0,
      currentUser?.userId || null
    )

    db.close()

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error creating startup:', error)
    return NextResponse.json({ error: 'Failed to submit startup' }, { status: 500 })
  }
}

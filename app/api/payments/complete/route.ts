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
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { startupId } = await request.json()
    
    if (!startupId) {
      return NextResponse.json({ error: 'Missing startupId' }, { status: 400 })
    }
    
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)
    
    // Add payment-related columns if they don't exist
    try {
      db.prepare('ALTER TABLE Startup ADD COLUMN paymentStatus TEXT DEFAULT "unpaid"').run()
    } catch (e) {}
    
    try {
      db.prepare('ALTER TABLE Startup ADD COLUMN paidAt TEXT').run()
    } catch (e) {}
    
    try {
      db.prepare('ALTER TABLE Startup ADD COLUMN publishedAt TEXT').run()
    } catch (e) {}
    
    try {
      db.prepare('ALTER TABLE Startup ADD COLUMN priceRub INTEGER DEFAULT 290').run()
    } catch (e) {}
    
    // Create Payment table if it doesn't exist
    try {
      db.prepare(`
        CREATE TABLE IF NOT EXISTS Payment (
          id TEXT PRIMARY KEY,
          startupId TEXT NOT NULL,
          userId TEXT NOT NULL,
          amountRub INTEGER NOT NULL,
          status TEXT DEFAULT 'pending',
          provider TEXT DEFAULT 'mock',
          providerPaymentId TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (startupId) REFERENCES Startup(id) ON DELETE CASCADE
        )
      `).run()
    } catch (e) {}
    
    // Get startup and verify ownership
    const startup = db.prepare('SELECT * FROM Startup WHERE id = ?').get(startupId) as any
    
    if (!startup) {
      db.close()
      return NextResponse.json({ error: 'Startup not found' }, { status: 404 })
    }
    
    if (startup.userId !== currentUser.userId) {
      db.close()
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }
    
    if (startup.status !== 'approved') {
      db.close()
      return NextResponse.json({ error: 'Startup must be approved first' }, { status: 400 })
    }
    
    if (startup.paymentStatus === 'paid') {
      db.close()
      return NextResponse.json({ error: 'Already paid' }, { status: 400 })
    }
    
    // Create payment record
    const paymentId = generateUUID()
    const now = new Date().toISOString()
    
    db.prepare(`
      INSERT INTO Payment (id, startupId, userId, amountRub, status, provider, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(paymentId, startupId, currentUser.userId, startup.priceRub || 290, 'succeeded', 'mock', now, now)
    
    // Update startup status
    db.prepare(`
      UPDATE Startup 
      SET paymentStatus = 'paid', 
          paidAt = datetime('now'), 
          publishedAt = datetime('now'),
          updatedAt = datetime('now')
      WHERE id = ?
    `).run(startupId)
    
    db.close()
    
    return NextResponse.json({ 
      success: true, 
      paymentId,
      message: 'Payment completed successfully'
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
  }
}

import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
const db = new Database(dbPath)

console.log('🔧 Добавление полей профиля в таблицу User...')

try {
  // Добавляем новые поля в таблицу User
  db.prepare('ALTER TABLE User ADD COLUMN avatar TEXT').run()
  console.log('✅ Поле avatar добавлено')
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️  Поле avatar уже существует')
  } else {
    throw e
  }
}

try {
  db.prepare('ALTER TABLE User ADD COLUMN bio TEXT').run()
  console.log('✅ Поле bio добавлено')
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️  Поле bio уже существует')
  } else {
    throw e
  }
}

try {
  db.prepare('ALTER TABLE User ADD COLUMN instagram TEXT').run()
  console.log('✅ Поле instagram добавлено')
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️  Поле instagram уже существует')
  } else {
    throw e
  }
}

try {
  db.prepare('ALTER TABLE User ADD COLUMN telegram TEXT').run()
  console.log('✅ Поле telegram добавлено')
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️  Поле telegram уже существует')
  } else {
    throw e
  }
}

try {
  db.prepare('ALTER TABLE User ADD COLUMN location TEXT').run()
  console.log('✅ Поле location добавлено')
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️  Поле location уже существует')
  } else {
    throw e
  }
}

try {
  db.prepare('ALTER TABLE User ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP').run()
  console.log('✅ Поле createdAt добавлено')
} catch (e: any) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️  Поле createdAt уже существует')
  } else {
    throw e
  }
}

db.close()
console.log('\n✨ Поля профиля успешно добавлены!')

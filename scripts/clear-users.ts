import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
const db = new Database(dbPath)

console.log('🗑️  Очистка данных пользователей...')

try {
  // Удаляем все данные пользователей
  db.prepare('DELETE FROM Comment').run()
  console.log('✅ Комментарии удалены')
  
  db.prepare('DELETE FROM Profile').run()
  console.log('✅ Профили удалены')
  
  db.prepare('DELETE FROM Like').run()
  console.log('✅ Лайки удалены')
  
  db.prepare('DELETE FROM Dislike').run()
  console.log('✅ Дизлайки удалены')
  
  db.prepare('DELETE FROM User').run()
  console.log('✅ Пользователи удалены')
  
  console.log('\n✨ Все данные пользователей успешно удалены!')
} catch (error) {
  console.error('❌ Ошибка при очистке данных:', error)
} finally {
  db.close()
}

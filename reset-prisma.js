const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Очистка Prisma клиента...');

const prismaPath = path.join(__dirname, 'node_modules', '.prisma');
if (fs.existsSync(prismaPath)) {
  fs.rmSync(prismaPath, { recursive: true, force: true });
  console.log('✅ .prisma удалён');
}

console.log('🔄 Генерация Prisma клиента...');
execSync('npx prisma generate', { stdio: 'inherit' });

console.log('✅ Готово! Теперь можно запустить seed');

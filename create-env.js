const fs = require('fs');

const envContent = `DATABASE_URL="file:./prisma/dev.db"
ADMIN_PASSWORD="admin123"`;

fs.writeFileSync('.env', envContent);
console.log('✅ .env файл создан успешно!');

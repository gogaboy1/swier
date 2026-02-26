# Настройка Supabase для Production

## 1. Создайте проект в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите **"New Project"**
3. Заполните данные:
   - **Name**: swier
   - **Database Password**: (придумайте надёжный пароль и сохраните его)
   - **Region**: выберите ближайший регион (например, Frankfurt для России)
4. Нажмите **"Create new project"**
5. Дождитесь создания проекта (2-3 минуты)

## 2. Получите строку подключения к базе данных

1. В боковом меню выберите **Settings** → **Database**
2. Прокрутите до раздела **"Connection string"**
3. Выберите вкладку **"URI"**
4. Скопируйте строку подключения (она выглядит так):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
5. Замените `[YOUR-PASSWORD]` на пароль, который вы указали при создании проекта

## 3. Настройте переменные окружения в Vercel

1. Откройте ваш проект в [Vercel](https://vercel.com)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте переменную:
   - **Name**: `DATABASE_URL`
   - **Value**: (вставьте строку подключения из шага 2)
   - **Environment**: Production, Preview, Development
4. Нажмите **Save**

## 4. Примените миграцию базы данных

После деплоя новой версии кода на Vercel, база данных автоматически создаст все необходимые таблицы при первом запуске.

Если нужно применить миграцию вручную:

```bash
npx prisma migrate deploy
```

## 5. Локальная разработка

Для локальной разработки создайте файл `.env.local`:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
ADMIN_PASSWORD=Plantsvszombies123
JWT_SECRET=your-secret-key-change-this-to-random-string
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Затем примените миграцию:

```bash
npx prisma generate
npx prisma db push
```

## 6. Проверка

После настройки:
1. Откройте https://swier.ru/auth/signup
2. Попробуйте создать аккаунт
3. Если всё работает - регистрация пройдёт успешно!

## Troubleshooting

### Ошибка подключения к базе данных
- Проверьте, что пароль в `DATABASE_URL` правильный
- Убедитесь, что проект Supabase активен (не в режиме паузы)

### Таблицы не создаются
Выполните:
```bash
npx prisma db push
```

### Нужно сбросить базу данных
⚠️ **Внимание**: это удалит все данные!
```bash
npx prisma migrate reset
```

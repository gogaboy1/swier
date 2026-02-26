# Startup Swipe - Tinder for Startups

A mobile-first web application for discovering and connecting with startups from Russia and Worldwide. Swipe right to like, swipe left to skip!

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gogaboy1/swier&env=JWT_SECRET,ADMIN_PASSWORD,NEXT_PUBLIC_APP_URL&envDescription=Required%20environment%20variables&envLink=https://github.com/gogaboy1/swier/blob/master/env.example&project-name=swier&repository-name=swier)

Click the button above to deploy to Vercel in one click!

## Features

- **Swipe Interface**: Real Tinder-style swipe gestures using react-tinder-card
- **Geography Filters**: Browse startups from Russia or Worldwide
- **Favorites**: Save and manage your liked startups
- **Startup Submission**: Submit your own startup for review
- **Admin Panel**: Moderate and approve submitted startups
- **Anonymous Users**: No registration required - uses localStorage for user tracking
- **Contact Links**: Direct links to Telegram, WhatsApp, Email, and Website

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS (mobile-first design)
- **Database**: SQLite + Prisma ORM
- **Swipe Component**: react-tinder-card
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:

Create a `.env` file in the root directory (or use the existing one) and add:
```
ADMIN_PASSWORD=your_secure_password_here
```

4. Initialize the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. (Optional) Seed the database with sample data:
```bash
npm run seed
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### For Users

1. **Home Page**: Swipe through startups filtered by Russia or Worldwide
   - Swipe right or click the heart button to like
   - Swipe left or click the X button to skip
   - Tap on a card to view full details

2. **Favorites**: View all startups you've liked
   - Remove startups from favorites
   - View full details of any startup

3. **Submit**: Submit your own startup
   - Fill in all required fields
   - Add contact information (Telegram, Email, WhatsApp, Website)
   - Submission goes to moderation queue

### For Admins

1. Navigate to `/admin`
2. Login with the password set in `.env` (ADMIN_PASSWORD)
3. Review pending submissions
4. Approve or reject startups
5. Manage all startups in the system

## Project Structure

```
startswipe/
├── app/
│   ├── api/              # API routes
│   │   ├── startups/     # Startup CRUD
│   │   ├── like/         # Like functionality
│   │   ├── dislike/      # Dislike functionality
│   │   ├── favorites/    # User favorites
│   │   ├── submit/       # Startup submission
│   │   └── admin/        # Admin endpoints
│   ├── startup/[id]/     # Startup detail page
│   ├── favorites/        # Favorites page
│   ├── submit/           # Submit page
│   ├── admin/            # Admin panel
│   └── page.tsx          # Home page (swipe interface)
├── components/
│   ├── SwipeCard.tsx     # Individual startup card
│   ├── SwipeStack.tsx    # Swipe stack container
│   └── Navigation.tsx    # Bottom navigation
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── userKey.ts        # Anonymous user tracking
│   ├── contacts.ts       # Contact normalization
│   └── auth.ts           # Admin authentication
├── prisma/
│   └── schema.prisma     # Database schema
└── README.md
```

## Database Schema

- **Startup**: Main startup entity with all details
- **Like**: User likes (tracked by anonymous userKey)
- **Dislike**: User dislikes (tracked by anonymous userKey)

## Contact Normalization

The app automatically normalizes contact information:

- **Telegram**: Converts `@username` or `username` to `https://t.me/username`
- **WhatsApp**: Extracts digits only and creates `https://wa.me/digits`
- **Email**: Creates `mailto:` links

## Environment Variables

- `ADMIN_PASSWORD`: Password for admin panel access (required)
- `DATABASE_URL`: SQLite database URL (auto-configured in prisma.config.ts)

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (database GUI)
npx prisma studio
```

## License

MIT

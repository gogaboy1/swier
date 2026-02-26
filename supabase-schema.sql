-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    avatar TEXT,
    bio TEXT,
    instagram TEXT,
    telegram TEXT,
    location TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Startup table
CREATE TABLE IF NOT EXISTS "Startup" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    geo TEXT NOT NULL,
    stage TEXT NOT NULL,
    "investmentAmount" TEXT NOT NULL,
    "businessModel" TEXT NOT NULL,
    "teamSize" TEXT NOT NULL,
    website TEXT,
    email TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved BOOLEAN DEFAULT false
);

-- Add userId column to existing Like table
ALTER TABLE "Like" ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- Add userId column to existing Dislike table  
ALTER TABLE "Dislike" ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- Create Comment table
CREATE TABLE IF NOT EXISTS "Comment" (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY ("startupId") REFERENCES "Startup"(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Like_userId_idx" ON "Like"("userId");
CREATE INDEX IF NOT EXISTS "Like_startupId_idx" ON "Like"("startupId");
CREATE INDEX IF NOT EXISTS "Dislike_userId_idx" ON "Dislike"("userId");
CREATE INDEX IF NOT EXISTS "Dislike_startupId_idx" ON "Dislike"("startupId");
CREATE INDEX IF NOT EXISTS "Comment_userId_idx" ON "Comment"("userId");
CREATE INDEX IF NOT EXISTS "Comment_startupId_idx" ON "Comment"("startupId");

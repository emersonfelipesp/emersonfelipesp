-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PageView" (
    "path" TEXT NOT NULL PRIMARY KEY,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GitHubStatsCache" (
    "fullName" TEXT NOT NULL PRIMARY KEY,
    "stars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "language" TEXT,
    "description" TEXT,
    "latestRelease" TEXT,
    "fetchedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Sample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL
);

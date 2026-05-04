import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function makeClient(): PrismaClient {
  if (process.env.TURSO_URL) {
    const { createClient } = require("@libsql/client");
    const { PrismaLibSQL } = require("@prisma/adapter-libsql");
    const libsql = createClient({
      url: process.env.TURSO_URL,
      authToken: process.env.TURSO_TOKEN ?? "",
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }

  const path = require("node:path");
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const filename = url.startsWith("file:")
    ? path.resolve(process.cwd(), url.replace(/^file:/, ""))
    : url;
  const adapter = new PrismaBetterSqlite3({ url: filename });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

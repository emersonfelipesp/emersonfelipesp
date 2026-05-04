import path from "node:path";

const DEFAULT_SQLITE_URL = "file:./dev.db";

export function resolveSqliteFilename(
  url = process.env.DATABASE_URL ?? DEFAULT_SQLITE_URL,
): string {
  if (!url.startsWith("file:")) return url;

  const filePath = url.slice("file:".length);
  if (path.isAbsolute(filePath)) return filePath;
  return path.resolve(/*turbopackIgnore: true*/ process.cwd(), filePath);
}

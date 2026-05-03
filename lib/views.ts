import { db } from "./db";

export async function incrementView(path: string): Promise<number> {
  if (!path) return 0;
  try {
    const row = await db.pageView.upsert({
      where: { path },
      update: { count: { increment: 1 } },
      create: { path, count: 1 },
    });
    return row.count;
  } catch {
    return 0;
  }
}

export async function readView(path: string): Promise<number> {
  if (!path) return 0;
  try {
    const row = await db.pageView.findUnique({ where: { path } });
    return row?.count ?? 0;
  } catch {
    return 0;
  }
}

import { db } from "./db";

export async function incrementView(path: string): Promise<number> {
  const row = await db.pageView.upsert({
    where: { path },
    update: { count: { increment: 1 } },
    create: { path, count: 1 },
  });
  return row.count;
}

export async function readView(path: string): Promise<number> {
  const row = await db.pageView.findUnique({ where: { path } });
  return row?.count ?? 0;
}

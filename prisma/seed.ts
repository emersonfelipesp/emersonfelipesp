import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { resolveSqliteFilename } from "../lib/database-url";

const filename = resolveSqliteFilename();

const db = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: filename }),
});

async function main() {
  await db.sample.upsert({
    where: { id: "scaffold" },
    update: { label: "scaffold" },
    create: { id: "scaffold", label: "scaffold" },
  });

  for (const route of [
    "/",
    "/netbox-proxbox",
    "/proxbox-api",
    "/netbox-sdk",
    "/proxmox-sdk",
  ]) {
    await db.pageView.upsert({
      where: { path: route },
      update: {},
      create: { path: route, count: 0 },
    });
  }

  console.log("seed: ok");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

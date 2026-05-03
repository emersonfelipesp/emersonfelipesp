import "dotenv/config";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const filename = url.startsWith("file:")
  ? path.resolve(process.cwd(), url.replace(/^file:/, ""))
  : url;

const db = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: filename }),
});

async function main() {
  await db.sample.upsert({
    where: { id: "scaffold" },
    update: { label: "scaffold" },
    create: { id: "scaffold", label: "scaffold" },
  });

  for (const path of ["/", "/netbox-proxbox", "/netbox-sdk", "/proxmox-sdk"]) {
    await db.pageView.upsert({
      where: { path },
      update: {},
      create: { path, count: 0 },
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

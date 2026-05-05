import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const METADATA_PATH = path.join(
  process.cwd(),
  "public/netbox-sdk-fixtures/netbox-sdk-metadata.json",
);

const metadataSchema = z.object({
  release: z.string(),
  python: z.string(),
  netbox: z.array(z.string()).min(1),
});

export type NetboxSdkMeta = {
  netbox: string;
  python: string;
  latestRelease: string;
};

export async function getNetboxSdkMeta(): Promise<NetboxSdkMeta | null> {
  try {
    const raw = await readFile(METADATA_PATH, "utf8");
    const data = metadataSchema.parse(JSON.parse(raw));
    return {
      netbox: data.netbox.join(" / "),
      python: data.python,
      latestRelease: `v${data.release}`,
    };
  } catch (err) {
    console.error("[netbox-sdk-meta] read failed:", err);
    return null;
  }
}

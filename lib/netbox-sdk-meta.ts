import { z } from "zod";

const METADATA_URL =
  "https://raw.githubusercontent.com/emersonfelipesp/netbox-sdk/main/metadata.json";

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
    const res = await fetch(METADATA_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`metadata.json HTTP ${res.status}`);
    const data = metadataSchema.parse(await res.json());
    return {
      netbox: data.netbox.join(" / "),
      python: data.python,
      latestRelease: `v${data.release}`,
    };
  } catch (err) {
    console.error("[netbox-sdk-meta] fetch failed:", err);
    return null;
  }
}

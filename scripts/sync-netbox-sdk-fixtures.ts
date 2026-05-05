import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_REPO = path.resolve(__dirname, "../../netbox-sdk");
const DEST_DIR = path.resolve(__dirname, "../public/netbox-sdk-fixtures");

const COPIES: ReadonlyArray<readonly [string, string]> = [
  ["docs/generated/raw/029-cli-demo-profile-nbx-demo-init-help.json", "demo-init-help.json"],
  ["docs/generated/raw/037-tui-main-browser-nbx-demo-tui-help.json", "demo-tui-help.json"],
  ["docs/assets/screenshots/tui-main-netbox-dark.svg", "tui-main-netbox-dark.svg"],
  ["docs/assets/screenshots/tui-main-netbox-light.svg", "tui-main-netbox-light.svg"],
];

const DEVICES_LIST_FIXTURE = "demo-devices-list.json";

function fixturesAlreadyOnDisk(): boolean {
  if (!existsSync(DEST_DIR)) return false;
  const present = new Set(readdirSync(DEST_DIR));
  return (
    COPIES.every(([, dst]) => present.has(dst)) &&
    present.has(DEVICES_LIST_FIXTURE) &&
    present.has("demo-init-flow.json") &&
    present.has("manifest.json")
  );
}

if (!existsSync(SOURCE_REPO)) {
  if (fixturesAlreadyOnDisk()) {
    console.warn(`[sync-netbox-sdk-fixtures] netbox-sdk not found at ${SOURCE_REPO}; using checked-in fixtures.`);
    process.exit(0);
  }
  console.error(`[sync-netbox-sdk-fixtures] FATAL: netbox-sdk missing at ${SOURCE_REPO} and no checked-in fixtures present.`);
  process.exit(1);
}

mkdirSync(DEST_DIR, { recursive: true });

for (const [src, dst] of COPIES) {
  const from = path.join(SOURCE_REPO, src);
  const to = path.join(DEST_DIR, dst);
  if (!existsSync(from)) {
    console.error(`[sync-netbox-sdk-fixtures] FATAL: missing source ${from}`);
    process.exit(1);
  }
  copyFileSync(from, to);
}

const captureStarted = Date.now();
let devicesStdout: string;
try {
  devicesStdout = execSync("uv run nbx demo dcim devices list", {
    cwd: SOURCE_REPO,
    encoding: "utf8",
    timeout: 30_000,
    maxBuffer: 4 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch (err) {
  const e = err as { status?: number; stderr?: Buffer | string; message?: string };
  const stderr = typeof e.stderr === "string" ? e.stderr : e.stderr?.toString() ?? "";
  console.error(
    `[sync-netbox-sdk-fixtures] FATAL: 'uv run nbx demo dcim devices list' failed (status=${e.status ?? "?"}): ${e.message ?? ""}\n${stderr}`,
  );
  process.exit(1);
}
const devicesElapsed = (Date.now() - captureStarted) / 1000;
const devicesCapture = {
  surface: "cli",
  section: "Dynamic Commands",
  title: "nbx dcim devices list",
  argv: ["dcim", "devices", "list"],
  argv_base: ["dcim", "devices", "list"],
  exit_code: 0,
  elapsed_seconds: Math.round(devicesElapsed * 1000) / 1000,
  stdout_full: devicesStdout,
  truncated: false,
  stdout_json: null,
  stdout_yaml: null,
  stdout_markdown: null,
};
writeFileSync(
  path.join(DEST_DIR, DEVICES_LIST_FIXTURE),
  JSON.stringify(devicesCapture, null, 2) + "\n",
);

const demoPy = readFileSync(path.join(SOURCE_REPO, "netbox_cli/demo.py"), "utf8");

function findPromptLabel(re: RegExp): string {
  const m = demoPy.match(re);
  if (!m) {
    console.error(`[sync-netbox-sdk-fixtures] FATAL: could not extract prompt via ${re}`);
    process.exit(1);
  }
  return m[1];
}

function findEcho(re: RegExp): string {
  const m = demoPy.match(re);
  if (!m) {
    console.error(`[sync-netbox-sdk-fixtures] FATAL: could not extract echo via ${re}`);
    process.exit(1);
  }
  return m[1];
}

const usernameLabel = findPromptLabel(/typer\.prompt\("([^"]*demo username[^"]*)"\)/);
const passwordLabel = findPromptLabel(/typer\.prompt\(\s*"([^"]*demo password[^"]*)"\s*,\s*hide_input=True\s*\)/);
const okLine = findEcho(/typer\.echo\("(Demo configuration saved\.[^"]*)"\)/);

const flow = {
  prompts: [
    { label: usernameLabel, hidden: false, answer: "demo-user" },
    { label: passwordLabel, hidden: true, answer: "********" },
  ],
  ok: okLine,
};
writeFileSync(path.join(DEST_DIR, "demo-init-flow.json"), JSON.stringify(flow, null, 2) + "\n");

let sourceCommit = "unknown";
try {
  sourceCommit = execSync("git rev-parse HEAD", { cwd: SOURCE_REPO }).toString().trim();
} catch {
  // leave as "unknown"
}

const manifest = {
  syncedAt: new Date().toISOString(),
  sourceCommit,
  sourceRepo: SOURCE_REPO,
  files: [...COPIES.map(([, dst]) => dst), DEVICES_LIST_FIXTURE, "demo-init-flow.json"],
};
writeFileSync(path.join(DEST_DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

console.log(`[sync-netbox-sdk-fixtures] synced ${manifest.files.length} fixtures from ${sourceCommit.slice(0, 7)}.`);

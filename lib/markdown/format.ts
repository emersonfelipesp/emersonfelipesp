export const SITE_URL = "https://emersonfelipesp.com";

export function absolute(path: string): string {
  return `${SITE_URL}${path}`;
}

export function rawMarkdownAbsolute(path: string): string {
  return absolute(path === "/" ? "/md" : `/md${path}`);
}

export function themedMarkdownAbsolute(path: string): string {
  return absolute(
    path === "/" ? "/?content=markdown" : `${path}?content=markdown`,
  );
}

export function normalizePath(pathname: string): string {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] ?? "/";
  const withSlash = withoutQuery.startsWith("/")
    ? withoutQuery
    : `/${withoutQuery}`;
  const trimmed =
    withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : withSlash;
  return trimmed || "/";
}

export function decodeSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function tableCell(value: string | number | null | undefined): string {
  return String(value ?? "n/a")
    .replace(/\n+/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

export function clean(value: string): string {
  return value.replace(/\r\n/g, "\n").trim();
}

export function list(items: readonly string[]): string {
  if (items.length === 0) return "";
  return items.map((item) => `- ${item}`).join("\n");
}

export function paragraphs(items: readonly string[]): string {
  return items.map((item) => clean(item)).join("\n\n");
}

export function section(title: string, body: string | null | undefined): string {
  const content = body?.trim();
  if (!content) return "";
  return `## ${title}\n\n${content}`;
}

export function fenced(code: string, label = ""): string {
  return ["```" + label, code.trim(), "```"].join("\n");
}

export function formatDate(iso: string | null): string {
  if (!iso) return "n/a";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "n/a";
  return date.toISOString().slice(0, 10);
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "n/a";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "n/a";
  return `${date.toISOString().replace("T", " ").slice(0, 16)} UTC`;
}

export function formatBody(body: string | readonly string[]): string {
  return typeof body === "string" ? clean(body) : list(body);
}

export function renderTable(
  headers: readonly string[],
  rows: readonly (readonly (string | number | null | undefined)[])[],
): string {
  if (!rows.length) return "";
  return [
    `| ${headers.map(tableCell).join(" |")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(tableCell).join(" | ")} |`),
  ].join("\n");
}

export function finalize(parts: readonly (string | null | undefined)[]): string {
  const cleaned: string[] = [];

  for (const part of parts) {
    const content = part?.trim();
    if (content) cleaned.push(content);
  }

  return `${cleaned.join("\n\n")}\n`;
}

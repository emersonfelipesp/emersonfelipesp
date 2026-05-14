import { notFound } from "next/navigation";
import { getMarkdownForPath } from "@/lib/markdown";

type SearchParamsRecord = Record<string, string | string[] | undefined>;

export type PageSearchParams = Promise<SearchParamsRecord>;

async function wantsThemedMarkdown(
  searchParams?: PageSearchParams,
): Promise<boolean> {
  const params = searchParams ? await searchParams : {};
  const value = params.content;
  return Array.isArray(value) ? value.includes("markdown") : value === "markdown";
}

export async function renderThemedMarkdownIfRequested(
  searchParams: PageSearchParams | undefined,
  path: string,
): Promise<React.JSX.Element | null> {
  if (!(await wantsThemedMarkdown(searchParams))) return null;
  const markdown = await getMarkdownForPath(path);
  if (!markdown) notFound();

  return (
    <article className="py-8">
      <pre
        data-testid="themed-markdown"
        className="min-h-[60vh] overflow-x-auto whitespace-pre-wrap break-words border border-border bg-surface p-4 font-mono text-sm leading-6 text-fg shadow-sm sm:p-6"
      >
        {markdown}
      </pre>
    </article>
  );
}

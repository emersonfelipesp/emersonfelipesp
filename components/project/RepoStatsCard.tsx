import { getRepoStats } from "@/lib/github";

type Props = {
  fullName: string;
};

export async function RepoStatsCard({ fullName }: Props) {
  const stats = await getRepoStats(fullName);
  return (
    <div className="border border-border bg-surface-2 p-4 text-xs">
      <div className="mb-2 text-muted">$ gh repo view {fullName} --json</div>
      <dl className="grid grid-cols-2 gap-y-1 sm:grid-cols-4">
        <Cell label="stars" value={String(stats.stars)} accent />
        <Cell label="forks" value={String(stats.forks)} />
        <Cell label="lang" value={stats.language ?? "—"} />
        <Cell label="release" value={stats.latestRelease ?? "—"} accent />
      </dl>
      <p className="mt-2 text-[10px] text-muted">
        {stats.cached ? "↻ cached" : "✓ fresh"} · sourced from
        api.github.com/repos/{fullName}
      </p>
    </div>
  );
}

function Cell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <dt className="text-muted">{label}</dt>
      <dd className={accent ? "text-accent" : "text-fg"}>{value}</dd>
    </div>
  );
}

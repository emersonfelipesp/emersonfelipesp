type Props = {
  fullName: string;
  stars: number;
  forks: number;
  language?: string | null;
  latestRelease?: string | null;
};

export function RepoStatsCard({ fullName, stars, forks, language, latestRelease }: Props) {
  return (
    <div className="border border-border bg-surface-2 p-4 text-xs">
      <div className="mb-2 text-muted">$ gh repo view {fullName} --json</div>
      <dl className="grid grid-cols-2 gap-y-1 sm:grid-cols-4">
        <Cell label="stars" value={String(stars)} accent />
        <Cell label="forks" value={String(forks)} />
        <Cell label="lang" value={language ?? "—"} />
        <Cell label="release" value={latestRelease ?? "—"} accent />
      </dl>
      <p className="mt-2 text-xs text-muted">
        static · from public/github-data
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

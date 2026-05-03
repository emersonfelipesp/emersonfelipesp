type Badge = { label: string; value?: string };

type Props = {
  badges: Badge[];
};

export function BadgeRow({ badges }: Props) {
  const visible = badges.filter((b): b is { label: string; value: string } => b.value != null);
  if (visible.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {visible.map((b) => (
        <span
          key={b.label}
          className="border border-border bg-surface-2 px-2 py-0.5"
        >
          <span className="text-muted">{b.label}=</span>
          <span className="text-accent">{b.value}</span>
        </span>
      ))}
    </div>
  );
}

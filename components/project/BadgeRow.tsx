type Badge = { label: string; value: string };

type Props = {
  badges: Badge[];
};

export function BadgeRow({ badges }: Props) {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {badges.map((b) => (
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

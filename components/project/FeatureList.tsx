type Props = {
  items: readonly string[];
};

export function FeatureList({ items }: Props) {
  return (
    <ul className="space-y-1.5 text-sm">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="select-none text-accent">├─</span>
          <span className="text-fg/90">{item}</span>
        </li>
      ))}
    </ul>
  );
}

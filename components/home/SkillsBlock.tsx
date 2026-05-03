import { skills } from "@/content/profile";

export function SkillsBlock() {
  return (
    <div className="border border-border bg-surface p-5">
      <p className="mb-3 text-xs text-muted">$ cat ~/.config/skills.toml</p>
      <ul className="space-y-2 text-sm">
        {skills.map((s) => (
          <li key={s.group}>
            <span className="text-accent-2">[{s.group}]</span>
            <span className="text-muted"> = </span>
            <span className="text-fg/90">[{s.items.join(", ")}]</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

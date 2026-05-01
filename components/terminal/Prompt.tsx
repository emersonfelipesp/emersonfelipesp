type Props = {
  user?: string;
  host?: string;
  cwd?: string;
};

export function Prompt({
  user = "emerson",
  host = "netdevops",
  cwd = "~",
}: Props) {
  return (
    <span className="select-none">
      <span className="text-accent">{user}</span>
      <span className="text-muted">@</span>
      <span className="text-accent-2">{host}</span>
      <span className="text-muted">:</span>
      <span className="text-fg">{cwd}</span>
      <span className="text-muted">$ </span>
    </span>
  );
}

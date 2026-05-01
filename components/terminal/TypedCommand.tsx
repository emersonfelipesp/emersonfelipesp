import { Prompt } from "./Prompt";
import { BlinkingCursor } from "./BlinkingCursor";

type Props = {
  command: string;
  cwd?: string;
  cursor?: boolean;
};

export function TypedCommand({ command, cwd, cursor = false }: Props) {
  return (
    <p className="font-mono text-sm leading-relaxed">
      <Prompt cwd={cwd} />
      <span className="text-fg">{command}</span>
      {cursor ? <BlinkingCursor /> : null}
    </p>
  );
}

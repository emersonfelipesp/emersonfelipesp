import { AsciiBanner } from "@/components/terminal/AsciiBanner";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { OutputBlock } from "@/components/terminal/OutputBlock";

type Props = {
  banner: string;
  name: string;
  slug: string;
  tagline: string;
  description: readonly string[];
};

export function ProjectHero({
  banner,
  name,
  slug,
  tagline,
  description,
}: Props) {
  return (
    <header className="space-y-4">
      <AsciiBanner art={banner} />
      <TypedCommand command={`./describe.sh ${slug}`} cwd={`~/${slug}`} />
      <OutputBlock>
        <h1 className="text-base font-normal text-accent">{name}</h1>
        <p className="mt-1 text-base text-accent-2">{tagline}</p>
        <div className="mt-2 space-y-2 text-sm text-fg/90">
          {description.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </OutputBlock>
    </header>
  );
}

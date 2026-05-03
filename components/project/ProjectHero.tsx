import { AsciiBanner } from "@/components/terminal/AsciiBanner";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { OutputBlock } from "@/components/terminal/OutputBlock";

type Props = {
  banner: string;
  slug: string;
  tagline: string;
  description: readonly string[];
};

export function ProjectHero({ banner, slug, tagline, description }: Props) {
  return (
    <header className="space-y-4">
      <AsciiBanner art={banner} />
      <TypedCommand command={`./describe.sh ${slug}`} cwd={`~/${slug}`} />
      <OutputBlock>
        <p className="text-base text-accent">{tagline}</p>
        <div className="mt-2 space-y-2 text-sm text-fg/90">
          {description.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </OutputBlock>
    </header>
  );
}

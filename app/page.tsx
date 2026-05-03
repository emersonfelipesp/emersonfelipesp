import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { OutputBlock } from "@/components/terminal/OutputBlock";
import { AsciiBanner } from "@/components/terminal/AsciiBanner";
import { ProfileCard } from "@/components/home/ProfileCard";
import { SkillsBlock } from "@/components/home/SkillsBlock";
import { FeaturedProjectsGrid } from "@/components/home/FeaturedProjectsGrid";
import { ContactForm } from "@/components/home/ContactForm";
import { SectionHeading } from "@/components/project/SectionHeading";
import { SectionNav } from "@/components/nav/SectionNav";
import { profile, profileBanner, homeSections } from "@/content/profile";
import { incrementView, readView } from "@/lib/views";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let views = 0;
  try {
    views = await incrementView("/");
  } catch {
    views = await readView("/").catch(() => 0);
  }

  return (
    <div data-palette="mixed" className="space-y-8">
      <SectionNav sections={homeSections} />

      <TerminalWindow title="~/home">
        <AsciiBanner art={profileBanner} />
        <div className="mt-4 space-y-2">
          <TypedCommand command="whoami" cwd="~" />
          <OutputBlock>
            <p className="text-accent">{profile.name}</p>
            <p className="text-fg/90">{profile.role}</p>
          </OutputBlock>

          <TypedCommand command="cat ~/about.txt" cwd="~" />
          <OutputBlock>
            {profile.bio.map((p, i) => (
              <p key={i} className="mb-2 last:mb-0">
                {p}
              </p>
            ))}
            <p className="mt-3 text-accent-2">// {profile.motto}</p>
          </OutputBlock>
        </div>
      </TerminalWindow>

      <section className="space-y-3">
        <SectionHeading id="whoami">whoami</SectionHeading>
        <TypedCommand command="id emerson" />
        <ProfileCard />
      </section>

      <section className="space-y-3">
        <SectionHeading id="projects">projects</SectionHeading>
        <TypedCommand command="./list-projects --featured" />
        <FeaturedProjectsGrid />
      </section>

      <section className="space-y-3">
        <SectionHeading id="skills">skills</SectionHeading>
        <TypedCommand command="cat ~/.config/skills.toml" />
        <SkillsBlock />
      </section>

      <section className="space-y-3">
        <SectionHeading id="contact">contact</SectionHeading>
        <TypedCommand command="echo $ > /var/mail/emerson  # send me a message" />
        <ContactForm />
      </section>

      <p className="text-right text-[10px] text-muted">
        $ wc -l /var/log/visits ~/  →{" "}
        <span className="text-accent">{views}</span> visits to ~/home
      </p>
    </div>
  );
}

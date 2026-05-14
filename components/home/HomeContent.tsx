"use client";

import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { OutputBlock } from "@/components/terminal/OutputBlock";
import { AsciiBanner } from "@/components/terminal/AsciiBanner";
import { ProfileCard } from "@/components/home/ProfileCard";
import { SkillsBlock } from "@/components/home/SkillsBlock";
import { FeaturedProjectsGrid } from "@/components/home/FeaturedProjectsGrid";
import { ProjectsArchitecture } from "@/components/home/ProjectsArchitecture";
import { ContactForm } from "@/components/home/ContactForm";
import { ViewBeacon } from "@/components/home/ViewBeacon";
import { SectionHeading } from "@/components/project/SectionHeading";
import { SectionNav } from "@/components/nav/SectionNav";
import { SideTOC } from "@/components/nav/SideTOC";
import { homeSections } from "@/content/profile";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getProfile, profileBanner } from "@/lib/i18n/profile";

export function HomeContent() {
  const { lang, t } = useLanguage();
  const profile = getProfile(lang);
  const sections = t.home.sections;

  return (
    <div data-palette="mixed" className="space-y-8">
      <ViewBeacon path="/" />
      <SectionNav sections={homeSections} />
      <SideTOC sections={homeSections} />

      <TerminalWindow title="~/home">
        <AsciiBanner art={profileBanner} />
        <div className="mt-4 space-y-2">
          <TypedCommand command="whoami" cwd="~" />
          <OutputBlock>
            <h1 className="font-normal text-accent">{profile.name}</h1>
            <p className="text-fg/90">{profile.role}</p>
          </OutputBlock>

          <TypedCommand command="cat ~/about.txt" cwd="~" />
          <OutputBlock>
            {profile.bio.map((p) => (
              <p key={p} className="mb-2 last:mb-0">
                {p}
              </p>
            ))}
            <p className="mt-3 text-accent-2">
              {"// "}
              {profile.motto}
            </p>
          </OutputBlock>
        </div>
      </TerminalWindow>

      <section className="space-y-3">
        <SectionHeading id="whoami">{sections.whoami}</SectionHeading>
        <TypedCommand command="id emerson" />
        <ProfileCard />
      </section>

      <section className="space-y-3">
        <SectionHeading id="projects">{sections.projects}</SectionHeading>
        <TypedCommand command="./list-projects --featured" />
        <FeaturedProjectsGrid />
        <TypedCommand command="./show --architecture" />
        <ProjectsArchitecture />
      </section>

      <section className="space-y-3">
        <SectionHeading id="skills">{sections.skills}</SectionHeading>
        <TypedCommand command="cat ~/.config/skills.toml" />
        <SkillsBlock />
      </section>

      <section className="space-y-3">
        <SectionHeading id="contact">{sections.contact}</SectionHeading>
        <TypedCommand command="echo $ > /var/mail/emerson  # send me a message" />
        <ContactForm />
      </section>
    </div>
  );
}

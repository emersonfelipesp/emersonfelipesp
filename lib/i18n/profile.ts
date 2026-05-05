import { profile, skills, featured, socials, profileBanner, companyHref } from "@/content/profile";
import type { Lang } from "./languages";

type LocalizedProfile = {
  name: string;
  handle: string;
  role: string;
  location: string;
  company: string;
  communities: readonly string[];
  email: string;
  bio: readonly string[];
  motto: string;
};

const PROFILE_PT_BR: LocalizedProfile = {
  name: profile.name,
  handle: profile.handle,
  role: "Desenvolvedor de Software & Engenheiro de Automação de Redes",
  location: "Cotia, São Paulo, Brasil",
  company: profile.company,
  communities: profile.communities,
  email: profile.email,
  bio: [
    "Sou apaixonado por programação desde a infância. Quando descobri redes, encontrei a combinação perfeita: Automação de Redes.",
    "Foco em adquirir conhecimento profundo em redes de Provedores de Serviço (MPLS, BGP) enquanto automatizo tudo o que for possível.",
    "Adoro processos, fluxos de trabalho, construir APIs e ver sistemas se comunicando. Mas, no fim, é tudo sobre resolver problemas.",
    "Atualmente gerenciando o ASN 265234 e o ASN 268881.",
  ],
  motto: "Automatizando redes, um commit por vez.",
};

const PROFILE_EN: LocalizedProfile = {
  name: profile.name,
  handle: profile.handle,
  role: profile.role,
  location: profile.location,
  company: profile.company,
  communities: profile.communities,
  email: profile.email,
  bio: profile.bio,
  motto: profile.motto,
};

export function getProfile(lang: Lang): LocalizedProfile {
  return lang === "pt-br" ? PROFILE_PT_BR : PROFILE_EN;
}

const FEATURED_TAGLINES_PT_BR: Record<string, string> = {
  "netbox-proxbox": "Plugin do NetBox que sincroniza a infraestrutura do Proxmox com o NetBox.",
  "netbox-sdk": "Toolkit moderno para o NetBox: SDK + CLI + TUI.",
  "proxmox-sdk": "SDK FastAPI orientado a schema para a API do Proxmox.",
};

export function getFeatured(lang: Lang) {
  if (lang === "en") return featured;
  return featured.map((p) => ({
    ...p,
    tagline: FEATURED_TAGLINES_PT_BR[p.slug] ?? p.tagline,
  }));
}

export function getSkills() {
  return skills;
}

export { socials, profileBanner, companyHref };

export type SocialLink = {
  label: string;
  href: string;
};

export type Skill = {
  group: string;
  items: string[];
};

export type FeaturedProject = {
  slug: string;
  name: string;
  href: string;
  tagline: string;
  badge: string;
};

export const profile = {
  name: "Emerson Felipe",
  handle: "emersonfelipesp",
  role: "Software Developer & Network Automation Engineer",
  location: "Cotia, São Paulo, Brazil",
  company: "@N-Multifibra",
  communities: ["@netbox-community", "@netdevopsbr"],
  email: "emersonfelipe.2003@gmail.com",
  bio: [
    "I've been passionate about programming since childhood. When I discovered networking, I found the perfect combination: Network Automation.",
    "I'm focused on gaining deep knowledge of Service Provider networks (MPLS, BGP) while automating everything possible.",
    "I love processes, workflows, building APIs, and seeing systems communicate. But in the end, it's all about solving problems.",
  ],
  motto: "Automating networks, one commit at a time.",
} as const;

export const socials: SocialLink[] = [
  { label: "github", href: "https://github.com/emersonfelipesp" },
  { label: "linkedin", href: "https://www.linkedin.com/in/emersonfelipesp/" },
  { label: "email", href: "mailto:emersonfelipe.2003@gmail.com" },
  { label: "telegram", href: "https://t.me/emersonfelipesp" },
  { label: "instagram", href: "https://www.instagram.com/emersonfelipesp/" },
];

export const skills: Skill[] = [
  {
    group: "languages",
    items: ["Python", "JavaScript", "TypeScript", "Go", "HTML", "CSS"],
  },
  {
    group: "frameworks",
    items: ["Django", "FastAPI", "Next.js", "Bootstrap", "Jinja2"],
  },
  {
    group: "databases",
    items: ["PostgreSQL", "MongoDB", "SQLite"],
  },
  {
    group: "platforms",
    items: ["NetBox", "Proxmox", "Docker", "Zabbix", "Grafana", "Linux"],
  },
  {
    group: "vendors",
    items: ["Cisco", "Huawei", "Mikrotik", "Dell", "A10 Networks"],
  },
  {
    group: "domains",
    items: [
      "DCIM/IPAM",
      "BGP",
      "MPLS L2VPN",
      "GPON",
      "RPKI",
      "Network Automation",
    ],
  },
];

export const featured: FeaturedProject[] = [
  {
    slug: "netbox-proxbox",
    name: "netbox-proxbox",
    href: "/netbox-proxbox",
    tagline: "NetBox plugin syncing Proxmox infra into NetBox.",
    badge: "[ flagship · 539+ ★ ]",
  },
  {
    slug: "netbox-sdk",
    name: "netbox-sdk",
    href: "/netbox-sdk",
    tagline: "Modern NetBox toolkit: SDK + CLI + TUI.",
    badge: "[ python · async ]",
  },
  {
    slug: "proxmox-sdk",
    name: "proxmox-sdk",
    href: "/proxmox-sdk",
    tagline: "Schema-driven FastAPI SDK for the Proxmox API.",
    badge: "[ fastapi · openapi ]",
  },
];

export const profileBanner = String.raw`
  ___                                    _____    _ _
 | __|_ __  ___ _ _ ___ ___ _ _    ___  |  ___|__| (_)_ __  ___
 | _|| '  \/ -_) '_(_-</ _ \ ' \  |___| | |_ / -_) | | '_ \/ -_)
 |___|_|_|_\___|_| /__/\___/_||_|       |_|  \___|_|_| .__/\___|
                                                     |_|
       n e t d e v o p s   ·   o p e n   s o u r c e   ·   2 0 2 6
`;

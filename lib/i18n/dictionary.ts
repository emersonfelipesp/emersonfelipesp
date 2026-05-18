import type { Lang } from "./languages";

export type Dictionary = {
  nav: {
    home: string;
    netboxProxbox: string;
    proxboxApi: string;
    netboxSdk: string;
    proxmoxSdk: string;
    sponsor: string;
    sponsorButtonLabel: string;
    sponsorButtonAria: string;
    languageLabel: string;
    languageAria: (lang: string) => string;
    contentLabel: string;
    contentHuman: string;
    contentMarkdown: string;
    contentRaw: string;
    contentAria: string;
    contentSwitchAria: (view: string) => string;
    viewLabel: string;
    viewAria: (view: string) => string;
    routePickerLabel: string;
    routePickerAria: (current: string) => string;
    sectionPickerLabel: string;
    sectionPickerAria: (current: string) => string;
  };
  footer: {
    tagline: string;
  };
  project: {
    sections: {
      overview: string;
      features: string;
      stack: string;
      install: string;
      configure: string;
      integrations: string;
      screenshots: string;
      repo: string;
      links: string;
    };
    actions: {
      github: string;
      pypi: string;
      docker: string;
      stars: (project: string) => string;
      releases: (project: string) => string;
    };
    releases: {
      heading: string;
      all: string;
      latest: string;
      prerelease: string;
      stable: string;
      published: string;
      created: string;
      target: string;
      author: string;
      assets: string;
      downloads: string;
      sourceCode: string;
      zip: string;
      tar: string;
      synced: string;
      openOnGitHub: string;
      backToProject: string;
      backToReleases: string;
      viewRelease: string;
      noReleases: string;
      noNotes: string;
      noAssets: string;
      releaseCount: (count: number) => string;
    };
    proxboxApi: {
      intro: string;
      transport: string;
      direction: string;
      viewProject: string;
      architecture: {
        heading: string;
        caption: string;
        nodes: {
          netboxProxbox: string;
          proxboxApi: string;
          netboxSdk: string;
          proxmoxSdk: string;
          netboxRest: string;
          proxmoxRest: string;
        };
        edges: {
          pluginToApiTransport: string;
          pluginToApiAuth: string;
          apiToNetboxLabel: string;
          apiToNetboxBullets: readonly string[];
          apiToProxmoxLabel: string;
          apiToProxmoxBullets: readonly string[];
          sdkToRest: string;
        };
      };
    };
    proxbox: {
      quickInstallNote: string;
      quickInstallTocLabel: string;
      configureIntro: string;
      installPathGit: string;
      installPathDocker: string;
      installPathBackend: string;
      configureEndpoints: string;
      configureSettings: string;
      screenshotsDivider: string;
      repoDivider: string;
    };
    developer: {
      heading: string;
      sections: {
        intro: string;
        architecture: string;
        integrations: string;
        contributing: string;
        ci: string;
        e2e: string;
        links: string;
      };
      tabs: {
        showcase: string;
        developer: string;
        roadmap: string;
      };
      integrations: {
        target: string;
        protocol: string;
        library: string;
      };
      contributing: {
        devInstall: string;
        checks: string;
        codeStyle: string;
        issues: string;
      };
      ci: {
        workflows: string;
        name: string;
        trigger: string;
        purpose: string;
        notes: string;
      };
      e2e: {
        framework: string;
        commands: string;
        coverage: string;
        ci: string;
      };
    };
  };
  roadmap: {
    intro: string;
    empty: string;
    synced: string;
    legend: {
      open: string;
      closed: string;
      edges: string;
    };
    view: {
      diagram: string;
      timeline: string;
    };
    viewToggle: {
      aria: string;
    };
    diagram: {
      openIssuesLabel: string;
      edgesLabel: string;
      arrowsHint: string;
      closedNote: string;
      expand: string;
      close: string;
      zoomIn: string;
      zoomOut: string;
      reset: string;
      overlayAria: string;
    };
    phase: {
      shipped: string;
      label: string;
      roots: string;
    };
    timeline: {
      expandShipped: string;
      collapseShipped: string;
    };
    milestoneDue: string;
    milestoneToggle: {
      showPast: string;
      hidePast: string;
    };
  };
  notFound: {
    title: string;
    statusLine: string;
    description: string;
    pathLabel: string;
    suggestionsHeading: string;
    suggestions: {
      home: string;
      netboxProxbox: string;
      proxboxApi: string;
      netboxSdk: string;
      proxmoxSdk: string;
      llms: string;
    };
    actions: {
      home: string;
      contact: string;
    };
  };
  sponsor: {
    title: string;
    command: string;
    intro: string;
    why: string;
    impact: string;
    thanks: string;
    cardCaption: string;
    cardTitle: string;
    alternativesCaption: string;
    buyMeACoffeeLabel: string;
    buyMeACoffeeAria: string;
    patreonLabel: string;
    patreonAria: string;
  };
  home: {
    sections: {
      whoami: string;
      projects: string;
      skills: string;
      contact: string;
    };
    profile: {
      name: string;
      handle: string;
      role: string;
      location: string;
      company: string;
      communities: string;
      email: string;
      socialHeader: string;
    };
    skills: {
      title: string;
      groups: {
        languages: string;
        frameworks: string;
        databases: string;
        platforms: string;
        vendors: string;
        domains: string;
      };
      moreShort: string;
      lessShort: string;
      expandAria: (label: string, count: number) => string;
      collapseAria: (label: string, count: number) => string;
    };
    projects: {
      title: string;
      viewProject: string;
    };
    architecture: {
      heading: string;
      caption: string;
      edges: {
        plugin: string;
        httpSseWs: string;
        rest: string;
        base: string;
      };
      nodes: {
        netbox: string;
        netboxProxbox: string;
        netboxCeph: string;
        netboxPbs: string;
        netboxPdm: string;
        netboxPacker: string;
        proxboxApi: string;
        netboxSdk: string;
        netboxRest: string;
        proxmoxSdk: string;
        proxmoxVe: string;
        proxmoxRest: string;
        proxmoxCeph: string;
        proxmoxPbs: string;
        proxmoxPdm: string;
        hashicorpPacker: string;
      };
    };
    contact: {
      title: string;
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      send: string;
      sending: string;
      success: string;
      errorGeneric: string;
      errorValidation: string;
    };
  };
  community: {
    heading: string;
    intro: string;
    proxmoxForum: string;
    redditProxmox: string;
    redditNetbox: string;
    upvotes: string;
    replies: string;
    comments: string;
    postedBy: string;
    readOriginal: string;
    fetchError: string;
  };
};

const en: Dictionary = {
  nav: {
    home: "~/home",
    netboxProxbox: "~/netbox-proxbox",
    proxboxApi: "~/proxbox-api",
    netboxSdk: "~/netbox-sdk",
    proxmoxSdk: "~/proxmox-sdk",
    sponsor: "~/sponsor",
    sponsorButtonLabel: "♥ sponsor",
    sponsorButtonAria: "Sponsor emersonfelipesp on GitHub",
    languageLabel: "--lang=",
    languageAria: (lang) => `Language: ${lang}`,
    contentLabel: "--content=",
    contentHuman: "human",
    contentMarkdown: "markdown",
    contentRaw: "raw",
    contentAria: "Content view",
    contentSwitchAria: (view) => `Switch to ${view} view`,
    viewLabel: "--view=",
    viewAria: (view) => `Project view: ${view}`,
    routePickerLabel: "Route",
    routePickerAria: (current) => `Route: ${current}`,
    sectionPickerLabel: "Section",
    sectionPickerAria: (current) => `Section: ${current}`,
  },
  footer: {
    tagline:
      'echo "built with next.js + tailwind + prisma · 100% open source · feedback welcome"',
  },
  project: {
    sections: {
      overview: "overview",
      features: "features",
      stack: "stack",
      install: "install",
      configure: "configure",
      integrations: "integrations",
      screenshots: "screenshots",
      repo: "repo",
      links: "links",
    },
    actions: {
      github: "View source on GitHub",
      pypi: "View package on PyPI",
      docker: "View image on Docker Hub",
      stars: (project) => `Star ${project} on GitHub`,
      releases: (project) => `Releases of ${project}`,
    },
    releases: {
      heading: "releases",
      all: "all releases",
      latest: "latest",
      prerelease: "pre-release",
      stable: "stable",
      published: "published",
      created: "created",
      target: "target",
      author: "author",
      assets: "assets",
      downloads: "downloads",
      sourceCode: "source code",
      zip: "zip",
      tar: "tar.gz",
      synced: "synced",
      openOnGitHub: "open on GitHub",
      backToProject: "back to project",
      backToReleases: "back to releases",
      viewRelease: "view release",
      noReleases: "no releases in the current snapshot",
      noNotes: "this release has no notes",
      noAssets: "no binary assets attached",
      releaseCount: (count) => `${count} release${count === 1 ? "" : "s"}`,
    },
    proxboxApi: {
      intro:
        "proxbox-api is the only place where the netbox-proxbox NetBox plugin, the netbox-sdk REST client and the proxmox-sdk Proxmox VE SDK meet.",
      transport: "transport",
      direction: "direction",
      viewProject: "view project",
      architecture: {
        heading: "// integration map — transports, auth & concurrency",
        caption: "hover any node for details",
        nodes: {
          netboxProxbox:
            "Django plugin inside NetBox. Stores three endpoint objects (Proxmox, NetBox, FastAPI) and dispatches every Full Update / per-VM sync to proxbox-api.",
          proxboxApi:
            "FastAPI orchestrator on :8000. Bcrypt-hashed X-Proxbox-API-Key auth, brute-force lockout, Fernet-encrypted credentials at rest. Owns the SSE + WebSocket sync streams.",
          netboxSdk:
            "Async Python SDK for NetBox REST. Used by proxbox-api as the write target — DCIM, IPAM and Virtualization writes go through here. Cached GET layer (60s TTL) shared across the workflow.",
          proxmoxSdk:
            "Schema-driven async SDK mirroring the Proxmox VE 8.1 API as 646 typed endpoints. Read-only client used inside the SSE-driven sync workflow; mock mode enables offline integration tests.",
          netboxRest:
            "NetBox REST API (4.5.x / 4.6.x) — the data target where Proxmox infrastructure ends up.",
          proxmoxRest:
            "Proxmox VE 7.x / 8.x REST API — read-only data source for clusters, nodes, storage, VMs, containers, snapshots and backups.",
        },
        edges: {
          pluginToApiTransport: "HTTP REST · SSE · WebSocket",
          pluginToApiAuth: "auth: X-Proxbox-API-Key",
          apiToNetboxLabel: "write target",
          apiToNetboxBullets: [
            "async · cached GET 60s TTL",
            "PROXBOX_NETBOX_MAX_CONCURRENT",
          ],
          apiToProxmoxLabel: "read source",
          apiToProxmoxBullets: [
            "async · mock | real · read-only",
            "PROXBOX_VM_SYNC_MAX_CONCURRENCY",
          ],
          sdkToRest: "REST",
        },
      },
    },
    proxbox: {
      quickInstallNote: "quick install (PyPI):",
      quickInstallTocLabel: "quick install (PyPI)",
      configureIntro:
        "Configuration is UI-driven — three NetBox endpoint objects + a singleton plugin-settings record.",
      installPathGit: "path A — git / source into a NetBox venv (recommended)",
      installPathDocker: "path B — netbox-docker",
      installPathBackend: "path C — proxbox-api backend (required)",
      configureEndpoints: "endpoints — wire Proxmox, NetBox, and the FastAPI backend",
      configureSettings: "plugin settings & sync overwrite flags",
      screenshotsDivider: "// screenshots",
      repoDivider: "// repo",
    },
    developer: {
      heading: "developer guide",
      sections: {
        intro: "intro",
        architecture: "architecture",
        integrations: "integrations",
        contributing: "contributing",
        ci: "ci",
        e2e: "e2e",
        links: "links",
      },
      tabs: {
        showcase: "showcase",
        developer: "developer",
        roadmap: "roadmap",
      },
      integrations: {
        target: "target",
        protocol: "protocol",
        library: "library",
      },
      contributing: {
        devInstall: "dev install",
        checks: "pre-PR checks",
        codeStyle: "code style",
        issues: "issue tracker",
      },
      ci: {
        workflows: "workflows",
        name: "workflow",
        trigger: "trigger",
        purpose: "purpose",
        notes: "notes",
      },
      e2e: {
        framework: "framework",
        commands: "commands",
        coverage: "coverage",
        ci: "ci workflow",
      },
    },
  },
  roadmap: {
    intro:
      "Top-down dependency graph and phased timeline of every netbox-proxbox issue, derived from GitHub Issue Dependencies. Pre-built by CI; click any node to open the issue on GitHub.",
    empty:
      "no roadmap snapshot committed yet — run `pnpm github:roadmap` or wait for the next sync.",
    synced: "synced {when}",
    legend: {
      open: "open",
      closed: "closed",
      edges: "dependency edges",
    },
    view: {
      diagram: "diagram",
      timeline: "timeline",
    },
    viewToggle: {
      aria: "Roadmap view",
    },
    diagram: {
      openIssuesLabel: "open issues",
      edgesLabel: "dependency edges",
      arrowsHint: "arrows point from blocker to blocked task",
      closedNote:
        "closed issues appear in the timeline view as the shipped prelude",
      expand: "expand",
      close: "close",
      zoomIn: "zoom in",
      zoomOut: "zoom out",
      reset: "reset zoom",
      overlayAria: "Roadmap diagram fullscreen viewer",
    },
    phase: {
      shipped: "shipped",
      label: "phase {n}",
      roots: "start anywhere — no blockers",
    },
    timeline: {
      expandShipped: "{n} more shipped",
      collapseShipped: "collapse shipped",
    },
    milestoneDue: "due {date}",
    milestoneToggle: {
      showPast: "+ {n} past",
      hidePast: "hide past",
    },
  },
  notFound: {
    title: "page not found",
    statusLine: "404 — segment unresolved",
    description:
      "the requested path did not match any showcase, developer guide, roadmap, release page, or markdown route on this site.",
    pathLabel: "path",
    suggestionsHeading: "ls /",
    suggestions: {
      home: "/ — homepage, profile, featured projects",
      netboxProxbox: "/netbox-proxbox — netbox plugin for proxmox sync",
      proxboxApi: "/proxbox-api — fastapi backend behind netbox-proxbox",
      netboxSdk: "/netbox-sdk — python sdk + nbx cli + textual tui for netbox",
      proxmoxSdk: "/proxmox-sdk — schema-driven sdk + cli + tui for proxmox",
      llms: "/llms.txt — machine-readable index of every public page",
    },
    actions: {
      home: "cd ~",
      contact: "mail emerson",
    },
  },
  sponsor: {
    title: "sponsor",
    command: "cat ~/sponsor.md",
    intro:
      "I build NetBox, Proxmox and NetDevOps tooling in the open — netbox-proxbox, proxbox-api, netbox-sdk, proxmox-sdk and friends. Sponsorships keep that work flowing.",
    why: "If a project here saved you a weekend, a sponsorship is the quickest way to say thanks and keep new features, releases and docs landing.",
    impact:
      "Funds go straight into shipping releases, answering issues, and growing the open-source surface around NetBox + Proxmox.",
    thanks: "Either way — sponsor or not — thanks for stopping by.",
    cardCaption: "// pick any tier on GitHub Sponsors",
    cardTitle: "Sponsor emersonfelipesp",
    alternativesCaption: "// prefer a one-off tip or recurring support elsewhere?",
    buyMeACoffeeLabel: "buy me a coffee",
    buyMeACoffeeAria: "Buy emersonfelipesp a coffee on Buy Me a Coffee",
    patreonLabel: "back me on patreon",
    patreonAria: "Support emersonfelipesp on Patreon",
  },
  home: {
    sections: {
      whoami: "whoami",
      projects: "projects",
      skills: "skills",
      contact: "contact",
    },
    profile: {
      name: "name",
      handle: "handle",
      role: "role",
      location: "location",
      company: "company",
      communities: "communities",
      email: "email",
      socialHeader: "$ ls ~/.social/",
    },
    skills: {
      title: "skills",
      groups: {
        languages: "languages",
        frameworks: "frameworks",
        databases: "databases",
        platforms: "platforms",
        vendors: "vendors",
        domains: "domains",
      },
      moreShort: "more",
      lessShort: "less",
      expandAria: (label, count) => `Show ${count} more in ${label}`,
      collapseAria: (label, count) => `Hide ${count} more in ${label}`,
    },
    projects: {
      title: "featured projects",
      viewProject: "view project",
    },
    architecture: {
      heading: "// how my projects fit together",
      caption: "hover any node for details",
      edges: {
        plugin: "plugin",
        httpSseWs: "HTTP / SSE / WS",
        rest: "REST",
        base: "base",
      },
      nodes: {
        netbox: "Open-source source-of-truth platform for network infrastructure (DCIM / IPAM / virtualization).",
        netboxProxbox: "NetBox plugin that surfaces Proxmox infra (clusters, nodes, VMs, backups) inside NetBox and triggers syncs.",
        netboxCeph: "NetBox plugin that syncs Proxmox Ceph storage pool and health data into NetBox.",
        netboxPbs: "NetBox plugin that surfaces Proxmox Backup Server job history and datastore status in NetBox.",
        netboxPdm: "NetBox plugin that integrates Proxmox Datacenter Manager inventory and cross-cluster views into NetBox.",
        netboxPacker: "NetBox plugin that tracks HashiCorp Packer build metadata and provisioned image records in NetBox.",
        proxboxApi: "FastAPI backend that orchestrates the NetBox ↔ Proxmox sync workflow over HTTP, SSE, and WebSocket.",
        netboxSdk: "Python async SDK + CLI (nbx) + Textual TUI for the NetBox REST API. Used by proxbox-api to read/write NetBox.",
        netboxRest: "NetBox's REST API — the data target where Proxmox infrastructure ends up.",
        proxmoxSdk: "Schema-driven FastAPI SDK for the Proxmox VE API: 646 generated endpoints, dual mock/real modes, CLI + TUI.",
        proxmoxVe: "Proxmox Virtual Environment — the hypervisor platform exposing the REST API consumed by proxmox-sdk.",
        proxmoxRest: "Proxmox VE's REST API — the data source for clusters, nodes, VMs, storage, and backups.",
        proxmoxCeph: "Proxmox Ceph REST API — distributed storage cluster integrated directly with Proxmox VE nodes.",
        proxmoxPbs: "Proxmox Backup Server REST API — deduplicating backup service for VMs, containers, and hosts.",
        proxmoxPdm: "Proxmox Datacenter Manager REST API — centralized multi-cluster inventory and task orchestration.",
        hashicorpPacker: "HashiCorp Packer API — image-build pipeline producing Proxmox VM templates and cloud images.",
      },
    },
    contact: {
      title: "contact",
      name: "from",
      namePlaceholder: "your name",
      email: "reply-to",
      emailPlaceholder: "you@example.com",
      message: "message",
      messagePlaceholder: "ping...",
      send: "send",
      sending: "sending...",
      success: "message stored locally",
      errorGeneric: "could not send message. please try again.",
      errorValidation: "please check the fields and try again.",
    },
  },
  community: {
    heading: "community",
    intro: "Live community threads fetched from the Proxmox Forum and Reddit.",
    proxmoxForum: "Proxmox Forum",
    redditProxmox: "r/Proxmox",
    redditNetbox: "r/Netbox",
    upvotes: "upvotes",
    replies: "replies",
    comments: "comments",
    postedBy: "posted by",
    readOriginal: "read original post",
    fetchError: "could not fetch post content",
  },
};

const ptBr: Dictionary = {
  nav: {
    home: "~/inicio",
    netboxProxbox: "~/netbox-proxbox",
    proxboxApi: "~/proxbox-api",
    netboxSdk: "~/netbox-sdk",
    proxmoxSdk: "~/proxmox-sdk",
    sponsor: "~/sponsor",
    sponsorButtonLabel: "♥ apoiar",
    sponsorButtonAria: "Apoiar emersonfelipesp no GitHub",
    languageLabel: "--idioma=",
    languageAria: (lang) => `Idioma: ${lang}`,
    contentLabel: "--conteudo=",
    contentHuman: "humano",
    contentMarkdown: "markdown",
    contentRaw: "raw",
    contentAria: "Visualização do conteúdo",
    contentSwitchAria: (view) => `Alternar para visualização ${view}`,
    viewLabel: "--visao=",
    viewAria: (view) => `Visão do projeto: ${view}`,
    routePickerLabel: "Rota",
    routePickerAria: (current) => `Rota: ${current}`,
    sectionPickerLabel: "Seção",
    sectionPickerAria: (current) => `Seção: ${current}`,
  },
  footer: {
    tagline:
      'echo "feito com next.js + tailwind + prisma · 100% código aberto · feedback é bem-vindo"',
  },
  project: {
    sections: {
      overview: "visão geral",
      features: "recursos",
      stack: "tecnologias",
      install: "instalação",
      configure: "configuração",
      integrations: "integrações",
      screenshots: "capturas de tela",
      repo: "repositório",
      links: "links",
    },
    actions: {
      github: "Ver código-fonte no GitHub",
      pypi: "Ver pacote no PyPI",
      docker: "Ver imagem no Docker Hub",
      stars: (project) => `Dar estrela em ${project} no GitHub`,
      releases: (project) => `Versões de ${project}`,
    },
    releases: {
      heading: "versões",
      all: "todas as versões",
      latest: "mais recente",
      prerelease: "pré-release",
      stable: "estável",
      published: "publicado",
      created: "criado",
      target: "alvo",
      author: "autor",
      assets: "artefatos",
      downloads: "downloads",
      sourceCode: "código-fonte",
      zip: "zip",
      tar: "tar.gz",
      synced: "sincronizado",
      openOnGitHub: "abrir no GitHub",
      backToProject: "voltar ao projeto",
      backToReleases: "voltar às versões",
      viewRelease: "ver versão",
      noReleases: "nenhuma versão no snapshot atual",
      noNotes: "esta versão não tem notas",
      noAssets: "nenhum artefato binário anexado",
      releaseCount: (count) => `${count} vers${count === 1 ? "ão" : "ões"}`,
    },
    proxboxApi: {
      intro:
        "O proxbox-api é o único lugar onde o plugin netbox-proxbox (NetBox), o cliente REST netbox-sdk e o SDK proxmox-sdk para Proxmox VE se encontram.",
      transport: "transporte",
      direction: "direção",
      viewProject: "ver projeto",
      architecture: {
        heading: "// mapa de integrações — transportes, auth e concorrência",
        caption: "passe o cursor sobre qualquer nó para ver detalhes",
        nodes: {
          netboxProxbox:
            "Plugin Django dentro do NetBox. Armazena três objetos de endpoint (Proxmox, NetBox, FastAPI) e despacha cada Full Update / sincronização por VM para o proxbox-api.",
          proxboxApi:
            "Orquestrador FastAPI na :8000. Auth via X-Proxbox-API-Key com hash bcrypt, lockout contra força bruta e credenciais cifradas em repouso (Fernet). É dono dos streams SSE + WebSocket.",
          netboxSdk:
            "SDK Python assíncrono para a REST do NetBox. Usado pelo proxbox-api como destino de escrita — gravações em DCIM, IPAM e Virtualization passam por aqui. Camada de cache em GET (60s) compartilhada pelo workflow.",
          proxmoxSdk:
            "SDK assíncrono orientado a schema espelhando a API do Proxmox VE 8.1 como 646 endpoints tipados. Cliente somente leitura usado no workflow de sincronização via SSE; modo mock habilita testes de integração offline.",
          netboxRest:
            "API REST do NetBox (4.5.x / 4.6.x) — o destino onde a infraestrutura do Proxmox é registrada.",
          proxmoxRest:
            "API REST do Proxmox VE 7.x / 8.x — fonte somente leitura de clusters, nós, storage, VMs, contêineres, snapshots e backups.",
        },
        edges: {
          pluginToApiTransport: "HTTP REST · SSE · WebSocket",
          pluginToApiAuth: "auth: X-Proxbox-API-Key",
          apiToNetboxLabel: "destino de escrita",
          apiToNetboxBullets: [
            "async · GET cacheado por 60s",
            "PROXBOX_NETBOX_MAX_CONCURRENT",
          ],
          apiToProxmoxLabel: "fonte de leitura",
          apiToProxmoxBullets: [
            "async · mock | real · somente leitura",
            "PROXBOX_VM_SYNC_MAX_CONCURRENCY",
          ],
          sdkToRest: "REST",
        },
      },
    },
    proxbox: {
      quickInstallNote: "instalação rápida (PyPI):",
      quickInstallTocLabel: "instalação rápida (PyPI)",
      configureIntro:
        "A configuração é feita pela interface — três objetos de endpoint no NetBox + um registro singleton de configurações do plugin.",
      installPathGit: "caminho A — git / fonte em um venv do NetBox (recomendado)",
      installPathDocker: "caminho B — netbox-docker",
      installPathBackend: "caminho C — backend proxbox-api (obrigatório)",
      configureEndpoints:
        "endpoints — interligando Proxmox, NetBox e o backend FastAPI",
      configureSettings:
        "configurações do plugin e flags de sobrescrita de sincronização",
      screenshotsDivider: "// capturas",
      repoDivider: "// repositório",
    },
    developer: {
      heading: "guia do desenvolvedor",
      sections: {
        intro: "introdução",
        architecture: "arquitetura",
        integrations: "integrações",
        contributing: "contribuição",
        ci: "ci",
        e2e: "testes e2e",
        links: "links",
      },
      tabs: {
        showcase: "vitrine",
        developer: "desenvolvedor",
        roadmap: "roteiro",
      },
      integrations: {
        target: "alvo",
        protocol: "protocolo",
        library: "biblioteca",
      },
      contributing: {
        devInstall: "instalação de dev",
        checks: "checagens antes do PR",
        codeStyle: "estilo de código",
        issues: "rastreador de issues",
      },
      ci: {
        workflows: "workflows",
        name: "workflow",
        trigger: "gatilho",
        purpose: "finalidade",
        notes: "notas",
      },
      e2e: {
        framework: "framework",
        commands: "comandos",
        coverage: "cobertura",
        ci: "workflow de CI",
      },
    },
  },
  roadmap: {
    intro:
      "Grafo de dependências top-down e linha do tempo em fases de cada issue do netbox-proxbox, gerado a partir do GitHub Issue Dependencies. Pré-construído via CI; clique em qualquer nó para abrir a issue no GitHub.",
    empty:
      "nenhum snapshot de roteiro ainda — rode `pnpm github:roadmap` ou aguarde a próxima sincronização.",
    synced: "sincronizado em {when}",
    legend: {
      open: "abertas",
      closed: "fechadas",
      edges: "dependências",
    },
    view: {
      diagram: "diagrama",
      timeline: "linha do tempo",
    },
    viewToggle: {
      aria: "Visualização do roteiro",
    },
    diagram: {
      openIssuesLabel: "issues abertas",
      edgesLabel: "dependências",
      arrowsHint: "as setas apontam do bloqueador para a tarefa bloqueada",
      closedNote:
        "as issues fechadas aparecem na linha do tempo como prelúdio entregue",
      expand: "expandir",
      close: "fechar",
      zoomIn: "aproximar",
      zoomOut: "afastar",
      reset: "redefinir zoom",
      overlayAria: "Visualizador em tela cheia do diagrama do roteiro",
    },
    phase: {
      shipped: "entregue",
      label: "fase {n}",
      roots: "comece por qualquer um — sem bloqueios",
    },
    timeline: {
      expandShipped: "+{n} já entregues",
      collapseShipped: "recolher entregues",
    },
    milestoneDue: "previsto para {date}",
    milestoneToggle: {
      showPast: "+{n} entregues",
      hidePast: "ocultar entregues",
    },
  },
  notFound: {
    title: "página não encontrada",
    statusLine: "404 — segmento não resolvido",
    description:
      "o caminho solicitado não corresponde a nenhuma página de showcase, guia de desenvolvedor, roadmap, release ou rota markdown deste site.",
    pathLabel: "caminho",
    suggestionsHeading: "ls /",
    suggestions: {
      home: "/ — página inicial, perfil, projetos em destaque",
      netboxProxbox: "/netbox-proxbox — plugin do netbox para sincronizar o proxmox",
      proxboxApi: "/proxbox-api — backend fastapi por trás do netbox-proxbox",
      netboxSdk: "/netbox-sdk — sdk python + cli nbx + tui textual para o netbox",
      proxmoxSdk: "/proxmox-sdk — sdk + cli + tui orientado a schema para o proxmox",
      llms: "/llms.txt — índice legível por máquina de todas as páginas públicas",
    },
    actions: {
      home: "cd ~",
      contact: "mail emerson",
    },
  },
  sponsor: {
    title: "apoiar",
    command: "cat ~/apoiar.md",
    intro:
      "Construo ferramentas para NetBox, Proxmox e NetDevOps em código aberto — netbox-proxbox, proxbox-api, netbox-sdk, proxmox-sdk e companhia. Apoios mantêm esse trabalho fluindo.",
    why: "Se algum desses projetos te poupou um fim de semana, apoiar é o jeito mais rápido de dizer obrigado e manter novas funcionalidades, releases e docs saindo.",
    impact:
      "O apoio vai direto para entregar releases, responder issues e expandir o ecossistema open source ao redor de NetBox + Proxmox.",
    thanks: "De qualquer forma — apoiando ou não — obrigado por passar por aqui.",
    cardCaption: "// escolha qualquer faixa no GitHub Sponsors",
    cardTitle: "Apoiar emersonfelipesp",
    alternativesCaption: "// prefere uma contribuição única ou apoio recorrente em outra plataforma?",
    buyMeACoffeeLabel: "me pague um café",
    buyMeACoffeeAria: "Pague um café para emersonfelipesp no Buy Me a Coffee",
    patreonLabel: "me apoie no patreon",
    patreonAria: "Apoie emersonfelipesp no Patreon",
  },
  home: {
    sections: {
      whoami: "quemsou",
      projects: "projetos",
      skills: "habilidades",
      contact: "contato",
    },
    profile: {
      name: "nome",
      handle: "usuário",
      role: "função",
      location: "localização",
      company: "empresa",
      communities: "comunidades",
      email: "e-mail",
      socialHeader: "$ ls ~/.redes-sociais/",
    },
    skills: {
      title: "habilidades",
      groups: {
        languages: "linguagens",
        frameworks: "frameworks",
        databases: "bancos de dados",
        platforms: "plataformas",
        vendors: "fabricantes",
        domains: "domínios",
      },
      moreShort: "mais",
      lessShort: "menos",
      expandAria: (label, count) => `Mostrar mais ${count} em ${label}`,
      collapseAria: (label, count) => `Ocultar mais ${count} em ${label}`,
    },
    projects: {
      title: "projetos em destaque",
      viewProject: "ver projeto",
    },
    architecture: {
      heading: "// como meus projetos se conectam",
      caption: "passe o mouse em qualquer nó para detalhes",
      edges: {
        plugin: "plugin",
        httpSseWs: "HTTP / SSE / WS",
        rest: "REST",
        base: "base",
      },
      nodes: {
        netbox: "Plataforma open-source de fonte da verdade para infraestrutura de rede (DCIM / IPAM / virtualização).",
        netboxProxbox: "Plugin do NetBox que expõe a infraestrutura do Proxmox (clusters, nós, VMs, backups) dentro do NetBox e dispara sincronizações.",
        netboxCeph: "Plugin do NetBox que sincroniza pools de armazenamento e dados de saúde do Proxmox Ceph no NetBox.",
        netboxPbs: "Plugin do NetBox que exibe o histórico de jobs e o status dos datastores do Proxmox Backup Server no NetBox.",
        netboxPdm: "Plugin do NetBox que integra o inventário do Proxmox Datacenter Manager e visões cross-cluster no NetBox.",
        netboxPacker: "Plugin do NetBox que registra metadados de builds do HashiCorp Packer e imagens provisionadas no NetBox.",
        proxboxApi: "Backend FastAPI que orquestra o fluxo de sincronização NetBox ↔ Proxmox via HTTP, SSE e WebSocket.",
        netboxSdk: "SDK Python assíncrono + CLI (nbx) + TUI Textual para a API REST do NetBox. Usado pelo proxbox-api para ler e gravar no NetBox.",
        netboxRest: "API REST do NetBox — o destino onde a infraestrutura do Proxmox é registrada.",
        proxmoxSdk: "SDK FastAPI orientado a schema para a API do Proxmox VE: 646 endpoints gerados, modos mock/real, CLI + TUI.",
        proxmoxVe: "Proxmox Virtual Environment — a plataforma hypervisor que expõe a API REST consumida pelo proxmox-sdk.",
        proxmoxRest: "API REST do Proxmox VE — a fonte de dados de clusters, nós, VMs, storage e backups.",
        proxmoxCeph: "API REST do Proxmox Ceph — cluster de armazenamento distribuído integrado diretamente aos nós do Proxmox VE.",
        proxmoxPbs: "API REST do Proxmox Backup Server — serviço de backup com deduplicação para VMs, contêineres e hosts.",
        proxmoxPdm: "API REST do Proxmox Datacenter Manager — inventário centralizado de múltiplos clusters e orquestração de tarefas.",
        hashicorpPacker: "API do HashiCorp Packer — pipeline de build de imagens que gera templates de VM para Proxmox e imagens cloud.",
      },
    },
    contact: {
      title: "contato",
      name: "de",
      namePlaceholder: "seu nome",
      email: "responder-para",
      emailPlaceholder: "voce@exemplo.com",
      message: "mensagem",
      messagePlaceholder: "ping...",
      send: "enviar",
      sending: "enviando...",
      success: "mensagem salva localmente",
      errorGeneric: "não foi possível enviar a mensagem. tente novamente.",
      errorValidation: "verifique os campos e tente novamente.",
    },
  },
  community: {
    heading: "comunidade",
    intro: "Threads da comunidade carregadas do Fórum Proxmox e do Reddit.",
    proxmoxForum: "Fórum Proxmox",
    redditProxmox: "r/Proxmox",
    redditNetbox: "r/Netbox",
    upvotes: "votos positivos",
    replies: "respostas",
    comments: "comentários",
    postedBy: "por",
    readOriginal: "ver post original",
    fetchError: "não foi possível carregar o conteúdo do post",
  },
};

export const DICTIONARIES: Record<Lang, Dictionary> = {
  en,
  "pt-br": ptBr,
};

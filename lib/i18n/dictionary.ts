import type { Lang } from "./languages";

export type Dictionary = {
  nav: {
    home: string;
    netboxProxbox: string;
    netboxSdk: string;
    proxmoxSdk: string;
    languageLabel: string;
    languageAria: (lang: string) => string;
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
      screenshots: string;
      repo: string;
      links: string;
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
      };
      nodes: {
        netbox: string;
        netboxProxbox: string;
        proxboxApi: string;
        netboxSdk: string;
        netboxRest: string;
        proxmoxSdk: string;
        proxmoxRest: string;
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
};

const en: Dictionary = {
  nav: {
    home: "~/home",
    netboxProxbox: "~/netbox-proxbox",
    netboxSdk: "~/netbox-sdk",
    proxmoxSdk: "~/proxmox-sdk",
    languageLabel: "--lang=",
    languageAria: (lang) => `Language: ${lang}`,
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
      screenshots: "screenshots",
      repo: "repo",
      links: "links",
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
      },
      nodes: {
        netbox: "Open-source source-of-truth platform for network infrastructure (DCIM / IPAM / virtualization).",
        netboxProxbox: "NetBox plugin that surfaces Proxmox infra (clusters, nodes, VMs, backups) inside NetBox and triggers syncs.",
        proxboxApi: "FastAPI backend that orchestrates the NetBox ↔ Proxmox sync workflow over HTTP, SSE, and WebSocket.",
        netboxSdk: "Python async SDK + CLI (nbx) + Textual TUI for the NetBox REST API. Used by proxbox-api to read/write NetBox.",
        netboxRest: "NetBox's REST API — the data target where Proxmox infrastructure ends up.",
        proxmoxSdk: "Schema-driven FastAPI SDK for the Proxmox VE API: 646 generated endpoints, dual mock/real modes, CLI + TUI.",
        proxmoxRest: "Proxmox VE's REST API — the data source for clusters, nodes, VMs, storage, and backups.",
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
};

const ptBr: Dictionary = {
  nav: {
    home: "~/inicio",
    netboxProxbox: "~/netbox-proxbox",
    netboxSdk: "~/netbox-sdk",
    proxmoxSdk: "~/proxmox-sdk",
    languageLabel: "--idioma=",
    languageAria: (lang) => `Idioma: ${lang}`,
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
      screenshots: "capturas de tela",
      repo: "repositório",
      links: "links",
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
      },
      nodes: {
        netbox: "Plataforma open-source de fonte da verdade para infraestrutura de rede (DCIM / IPAM / virtualização).",
        netboxProxbox: "Plugin do NetBox que expõe a infraestrutura do Proxmox (clusters, nós, VMs, backups) dentro do NetBox e dispara sincronizações.",
        proxboxApi: "Backend FastAPI que orquestra o fluxo de sincronização NetBox ↔ Proxmox via HTTP, SSE e WebSocket.",
        netboxSdk: "SDK Python assíncrono + CLI (nbx) + TUI Textual para a API REST do NetBox. Usado pelo proxbox-api para ler e gravar no NetBox.",
        netboxRest: "API REST do NetBox — o destino onde a infraestrutura do Proxmox é registrada.",
        proxmoxSdk: "SDK FastAPI orientado a schema para a API do Proxmox VE: 646 endpoints gerados, modos mock/real, CLI + TUI.",
        proxmoxRest: "API REST do Proxmox VE — a fonte de dados de clusters, nós, VMs, storage e backups.",
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
};

export const DICTIONARIES: Record<Lang, Dictionary> = {
  en,
  "pt-br": ptBr,
};

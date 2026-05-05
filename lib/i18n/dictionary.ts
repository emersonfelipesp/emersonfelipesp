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

import { proxmoxSdk } from "@/content/proxmox-sdk";

export const PROXMOX_SDK_PT_BR = {
  tagline:
    "SDK FastAPI orientado a schema para a API do Proxmox — gerado, modo duplo, OpenAPI primeiro.",
  description: [
    "O proxmox-sdk é um pacote FastAPI que espelha a API do Proxmox VE como uma superfície OpenAPI totalmente tipada, com 646 endpoints gerados a partir do Proxmox VE 8.1.",
    "Funciona em dois modos prontos para uso: modo mock (padrão), com dados gerados automaticamente para CRUD, permitindo desenvolver sem um cluster real, e modo real, que faz proxy de requisições validadas para um host Proxmox em produção.",
  ],
  features: [
    "646 endpoints pré-gerados do Proxmox VE 8.1 com schema OpenAPI completo",
    "Modo duplo: mock (padrão) para desenvolvimento, real para produção",
    "Dados de mock gerados automaticamente com operações CRUD em memória",
    "Proxy real da API com validação de requisição/resposta",
    "Geração de código: rastreia o Proxmox API Viewer para OpenAPI",
    "Suporte multi-versão, com 'latest' apontando para o viewer oficial",
    "Swagger UI gerado pelo FastAPI em /docs",
    "Extras opcionais de CLI / TUI",
  ],
  stack: proxmoxSdk.stack,
  install: {
    primary: proxmoxSdk.install.primary,
    note: "Depois, acesse /docs no app em execução para ver a OpenAPI / Swagger ao vivo.",
  },
};

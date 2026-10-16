import { proxmoxSdk } from "@/content/proxmox-sdk";

export const PROXMOX_SDK_PT_BR = {
  tagline:
    "SDK FastAPI orientado a schema para a API do Proxmox — gerado, modo duplo, OpenAPI primeiro.",
  description: [
    "O proxmox-sdk é um pacote FastAPI que espelha a API do Proxmox VE como uma superfície OpenAPI totalmente tipada, com 675 operações em 444 endpoints gerados a partir do Proxmox VE 9.2.",
    "Funciona em dois modos prontos para uso: modo mock (padrão), com dados gerados automaticamente para CRUD, permitindo desenvolver sem um cluster real, e modo real, que faz proxy de requisições validadas para um host Proxmox em produção.",
    "Além do servidor, traz SDK Python assíncrono e síncrono standalone (ProxmoxSDK / SyncProxmoxSDK), autenticação por token de API e senha/ticket, sessão aiohttp fornecida pelo chamador, clientes tipados para Ceph / PBS / PDM e um workflow semanal que detecta mudanças no schema upstream.",
  ],
  features: [
    "675 operações do Proxmox VE 9.2 em 444 endpoints com schema OpenAPI completo",
    "Leituras JSON limitadas e recusa de redirects nos transportes HTTPS e CLI",
    "Certificação ao vivo no Proxmox VE 9.2.20, incluindo HA, SDN, CRS e ciclo de vida de tokens",
    "Modo duplo: mock (padrão) para desenvolvimento, real para produção",
    "Sincronização automática semanal do schema — detecta mudanças na API e abre um PR automaticamente",
    "Matriz de CI multi-versão: latest, 9.2 e 9.1.11 testados em cada commit",
    "Isolamento de estado mock por versão (PROXMOX_MOCK_STATE_NAMESPACE) — seguro para execuções paralelas",
    "Tags Docker por serviço: latest-pve, latest-pbs (Backup Server), latest-pdm (Datacenter Manager)",
    "Dados de mock gerados automaticamente com operações CRUD em memória",
    "Proxy real da API com validação de requisição/resposta",
    "Geração de código: rastreia o Proxmox API Viewer para OpenAPI",
    "Swagger UI gerado pelo FastAPI em /docs",
    "Extras opcionais de CLI / TUI com troca de visualização por módulo",
  ],
  stack: proxmoxSdk.stack,
  install: {
    primary: proxmoxSdk.install.primary,
    note: "Depois, acesse /docs no app em execução para ver a OpenAPI / Swagger ao vivo.",
  },
};

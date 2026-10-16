import { proxboxApi } from "@/content/proxbox-api";

export const PROXBOX_API_PT_BR = {
  tagline:
    "Orquestrador FastAPI que conecta o Proxmox VE e o NetBox para a suíte Proxbox.",
  description: [
    "O proxbox-api é o serviço FastAPI que dá vida à pilha Proxbox. É o motor por trás de cada Full Update que você dispara dentro do plugin netbox-proxbox no NetBox.",
    "Expõe endpoints REST, Server-Sent Events e WebSocket para que o plugin descubra, sincronize e acompanhe ao vivo o progresso de clusters, nós, VMs, contêineres, storage, snapshots e backups.",
    "Internamente apoia-se em dois SDKs: o netbox-sdk fala com a API REST do NetBox como destino de escrita, e o proxmox-sdk fala com o Proxmox VE como fonte de leitura. O proxbox-api é o único lugar onde os dois mundos se reconciliam.",
    "Sua fronteira de segurança mantém hosts de saída no escopo da requisição até o commit, verifica a host key SSH antes da autenticação e coordena trocas da chave de criptografia entre workers.",
  ],
  features: [
    "Orquestrador FastAPI com Swagger UI em /docs",
    "Streams de sincronização em REST + Server-Sent Events + WebSocket",
    "Autenticação por API key com hash bcrypt (X-Proxbox-API-Key) e bloqueio contra força bruta",
    "Janela one-shot de bootstrap em /auth/register-key, apoiada por histórico durável de chaves",
    "Troca coordenada da chave Fernet e escrita de credenciais entre workers",
    "Allow lists SSRF por requisição; apenas endpoints commitados viram autoridades compartilhadas",
    "Verificação da host key SSH antes da autenticação, com fallback limitado de endereços",
    "SQLModel + SQLite para armazenamento de endpoints e chaves",
    "Propriedade de devices com escopo por endpoint e conflitos HTTP 409",
    "Conclusão WebSocket correlacionada por execução e stage runners limitados no Full Update",
  ],
  stack: [
    "Python 3.12–3.13 / FastAPI 0.143.0 + uvicorn",
    "SQLModel 0.0.38 + aiosqlite",
    "Pydantic 2.13",
    "bcrypt + cryptography (Fernet)",
    "netbox-sdk 0.0.13 (apenas cliente REST do NetBox)",
    "proxmox-sdk 0.0.15 (SDK do Proxmox VE)",
    "UI administrativa em Next.js (nextjs-ui/)",
  ],
  install: {
    primary: proxboxApi.install.primary,
    note: "Em seguida execute com -p 8800:8000. O plugin netbox-proxbox alcança esta URL pelo objeto FastAPI Endpoint.",
  },
  integrations: [
    {
      ...proxboxApi.integrations[0],
      title: "netbox-proxbox · plugin do NetBox",
      role: "consumidor (frontend)",
      transport: "HTTP / SSE / WebSocket",
      direction: "netbox-proxbox → proxbox-api",
      body: [
        "O netbox-proxbox é um plugin Django que vive dentro do NetBox e nunca conversa diretamente com o Proxmox. Cada cluster, nó e VM que aparece no NetBox chegou lá porque o plugin pediu ao proxbox-api que buscasse a informação.",
        "O plugin armazena três objetos de endpoint (Proxmox, NetBox, FastAPI) e despacha as requisições de sincronização para o endpoint FastAPI (este serviço). O progresso volta por Server-Sent Events e o visualizador de logs ao vivo é alimentado por um WebSocket vindo do proxbox-api.",
      ],
      bullets: [
        "Dispara Full Update / por VM / por endpoint via REST",
        "Transmite o progresso para a UI do plugin via SSE (barras em tempo real)",
        "Empurra o buffer de logs do proxbox-api de volta ao plugin via WebSocket",
        "Respeita as flags de sobrescrita por endpoint configuradas na UI do plugin",
        "Autentica com a chave X-Proxbox-API-Key configurada no objeto FastAPI Endpoint",
      ],
    },
    {
      ...proxboxApi.integrations[1],
      title: "netbox-sdk · SDK REST do NetBox",
      role: "downstream — destino de escrita",
      transport: "HTTP (API REST do NetBox)",
      direction: "proxbox-api → netbox-sdk → REST do NetBox",
      body: [
        "O netbox-sdk é o toolkit Python assíncrono para a API REST do NetBox. O proxbox-api o utiliza como o lado de escrita de cada sincronização — clusters viram cluster groups no NetBox, nós viram devices, VMs viram virtual machines, e interfaces de rede e atribuições de IP são reconciliadas no lugar.",
        "Reusar o netbox-sdk significa que o proxbox-api herda pooling de sessão, respostas tipadas, política de retry e knobs de concorrência (PROXBOX_NETBOX_MAX_CONCURRENT, PROXBOX_NETBOX_GET_CACHE_TTL) sem reinventar a camada HTTP.",
      ],
      bullets: [
        "Dependência REST fixada: netbox-sdk 0.0.13",
        "Origem única das sessões NetBox em proxbox_api/session/",
        "Conduz cada escrita em DCIM, IPAM e Virtualization solicitada pelo plugin",
        "Camada de cache em GET (60s por padrão) compartilhada pelo workflow de sincronização",
        "Compatível com NetBox 4.5.8 a 4.7.x — o GA 4.7.0 é verificado",
      ],
    },
    {
      ...proxboxApi.integrations[2],
      title: "proxmox-sdk · SDK do Proxmox VE",
      role: "downstream — fonte de leitura",
      transport: "HTTP (API REST do Proxmox VE)",
      direction: "proxbox-api → proxmox-sdk → Proxmox VE",
      body: [
        "O proxmox-sdk é o SDK orientado a schema que expõe 675 operações do Proxmox VE 9.2 em 444 endpoints. O proxbox-api o usa como o lado de leitura de cada sincronização — clusters, nós, storage, VMs, contêineres, snapshots e backups são todos consultados por ele.",
        "Como o proxmox-sdk traz um modo mock pronto, o proxbox-api pode ser desenvolvido e testado de ponta a ponta contra um cluster Proxmox falso, com o mesmo schema que o proxy de produção valida.",
      ],
      bullets: [
        "Dependência fixada: proxmox-sdk 0.0.15",
        "A sincronização de inventário é somente leitura no Proxmox",
        "As superfícies de escrita são separadas e protegidas: allow_writes é verificado por endpoint, rotas com atribuição de ator exigem X-Proxbox-Actor e ações disparadas pelo plugin exigem run_proxmox_action com escopo no endpoint",
        "Cliente assíncrono usado dentro do workflow de sincronização baseado em SSE",
        "O modo mock viabiliza testes de integração offline com schemas realistas",
        "Concorrência limitada por PROXBOX_VM_SYNC_MAX_CONCURRENCY",
      ],
    },
  ],
};

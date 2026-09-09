export const NETBOX_RPC_PT_BR = {
  tagline:
    "Plugin do NetBox que cataloga procedimentos remotos auditados, despacha via netbox-rpc-backend e registra cada execução no NetBox.",
  description: [
    "O netbox-rpc é o bounded context Remote Command Policy dentro do NetBox. Possui catálogo de procedimentos, gates de aprovação/destrutivo, ledger de auditoria de execução e dispatch de backend — não drivers SSH ou implementações de protocolo. Esses ficam no netbox-rpc-backend.",
    "Toda operação de host que viraria script ad-hoc vira RPCProcedure seed com schema de params, entrada na allowlist de serviço Linux quando aplicável e histórico de execução visível. Operadores e automação compartilham o mesmo RBAC NetBox.",
  ],
  features: [
    "Catálogo RPCProcedure com comandos versionados, classes de efeito e gates opcionais de aprovação/destrutivo",
    "Ledger append-only RPCExecutionEvent com projection fold — estados terminais não voltam",
    "Registro RPCBackend seleciona netbox-rpc-backend sem embutir drivers no plugin",
    "Material de credencial via reveal do netbox-openbao quando o procedimento precisa de SSH",
    "Integrações companion: monitoramento proxbox, verify packer, Samba fileserver, deploy proxy NGINX",
    "Operações de host OpenBao como procedimentos auditados — nunca shell cru de outros plugins",
    "nms rpc / nbx usam a mesma REST API e permissões que a UI",
  ],
  howItWorks: {
    title: "como funciona",
    paragraphs: [
      "Operador ou API cria RPCExecution contra RPCProcedure habilitado e objeto alvo no NetBox. O handler verifica permissão execute, normaliza params e enfileira job RQ.",
      "O job seleciona linha RPCBackend, encaminha comando normalizado ao netbox-rpc-backend e appenda eventos tipados conforme progresso. Sucesso, falha e cancelamento ficam na projeção e em ObjectChange quando aplicável.",
      "Quando SSH é necessário, o backend pede reveal de credenciais atribuídas via netbox-openbao. Metadados ficam no NetBox; segredos nunca entram em params ou GET.",
    ],
    splitTable: {
      headers: ["Owned by netbox-rpc", "Owned by executor"],
      rows: [
        ["policy e schema de params", "seleção de driver SSH/CLI"],
        ["gates aprovação/destrutivo", "montagem argv fixo"],
        ["ledger de auditoria", "conectividade e timeouts"],
        ["RBAC execute/cancel", "callback reveal openbao"],
        ["metadados RPCBackend", "captura stdout/stderr redigida"],
      ],
    },
  },
  security: {
    title: "modelo de segurança",
    bullets: [
      "Input do caller nunca chega a shell — params estruturados mapeiam para templates argv fixos",
      "Procedimentos destrutivos exigem aprovação explícita",
      "Eventos de execução são append-only com hash de payload",
      "Exceções de backend são limitadas e redigidas",
      "Permissões reveal ficam no netbox-openbao; RPC referencia assignments por ID",
    ],
  },
  ecosystem: {
    title: "ecossistema",
    items: [
      {
        description:
          "Executor FastAPI sobre SSH/CLI. netbox-rpc seleciona linha de backend; drivers não vão no plugin NetBox.",
      },
      {
        description:
          "Guarda material SSH/API no OpenBao KV v2. Backends RPC fazem reveal na execução com audit POST-only.",
      },
      {
        description:
          "Sidecar opcional para AppRoles fora do host NetBox. RPC e openbao compartilham o caminho broker.",
      },
      {
        description:
          "Enfileira monitoramento systemd e procedimentos SSH Proxmox via netbox-rpc quando habilitado.",
      },
      {
        description:
          "Verify de template, Samba e deploy NGINX declaram procedimentos companion — veja a página de integrações.",
      },
    ],
  },
  apiExamples: {
    title: "api",
    intro:
      "Liste procedimentos, crie execuções e consulte status em /api/plugins/rpc/. Runs com gate de aprovação expõem action approve separada.",
    snippets: [
      { label: "listar procedimentos habilitados" },
      { label: "enfileirar execução" },
    ],
  },
  stack: [
    "Plugin NetBox (Django / Python 3.12+)",
    "PostgreSQL 15+ para catálogo e ledger",
    "Redis 6+ e NetBox RQ para dispatch async",
    "Executor netbox-rpc-backend (FastAPI)",
  ],
  install: {
    note: "Requer netbox-rpc-backend acessível e linhas RPCBackend seed. Plugins companion adicionam famílias opcionais.",
  },
};


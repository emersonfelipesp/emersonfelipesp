export const NETBOX_RPC_INTEGRATIONS_PT_BR = {
  sections: {
    overview: "visão geral",
    dispatch: "trilho dispatch",
    credentials: "trilho credencial",
    integrations: "mapa plugins",
    boundary: "fronteira",
    workflow: "fluxo operador",
  },
  tagline:
    "Como netbox-rpc cataloga procedimentos auditados, despacha via netbox-rpc-backend e encontra plugins companion nos mesmos objetos NetBox.",
  intro: [
    "netbox-rpc não embute drivers SSH nem clientes OpenBao para credenciais de guest. Possui policy, auditoria e seleção de backend no NetBox. netbox-rpc-backend faz conectividade; netbox-openbao revela material quando necessário.",
    "Plugins companion integram declarando seeds RPCProcedure e chamando a mesma API de execução — sem imports Python entre plugins.",
    "Cada lane fica visível no NetBox: catálogo de procedimentos, histórico RPCExecution e ObjectChange.",
  ],
  principles: {
    title: "princípios de design",
    bullets: [
      "Policy no NetBox, execução nos backends — netbox-rpc é o contrato, não a camada de driver.",
      "Apenas params estruturados — nada passa por eval ou interpolação shell.",
      "Credenciais via reveal openbao na execução — material nunca em GET.",
      "Companions enfileiram procedimentos; não fazem SSH direto quando netbox-rpc está instalado.",
      "Procedimentos destrutivos exigem intenção humana.",
    ],
  },
  integrationsTable: {
    title: "integrações companion",
    headers: ["Plugin", "Integração", "Procedimentos típicos"],
    rows: [
      [
        "netbox-proxbox",
        "Monitoramento de serviços, leituras SSH Proxmox",
        "refresh systemd, probes read-only",
      ],
      [
        "netbox-openbao",
        "Operações de host vault",
        "health, seal, reload de policy",
      ],
      [
        "netbox-packer",
        "Verificação pós-bake",
        "checks SSH em templates",
      ],
      [
        "netbox-fileserver",
        "Validação Samba",
        "listagem e permissões",
      ],
      [
        "netbox-proxy",
        "Deploy NGINX",
        "test e reload de config",
      ],
      [
        "netbox-openbao-broker",
        "Caminho vault",
        "mTLS entre NetBox e OpenBao",
      ],
    ],
  },
  boundary: {
    title: "o que fica fora do netbox-rpc",
    paragraphs: [
      "Sync de inventário — discovery proxbox, writes OpenBao, builds Packer — roda em lane própria. RPC executa só depois que o alvo existe no NetBox.",
      "netbox-rpc-backend é serviço FastAPI separado registrado como linha RPCBackend.",
      "SSH de guest deve fluir: assign openbao → queue RPC → backend reveal → SSH.",
    ],
  },
  workflow: {
    title: "sequência típica do operador",
    steps: [
      "Confirme RPCBackend apontando para netbox-rpc-backend e procedimentos habilitados.",
      "Atribua credenciais SSH via netbox-openbao quando a família precisar.",
      "Crie RPCExecution pela UI, nms rpc ou trigger companion.",
      "Aprove se necessário; acompanhe eventos até succeeded ou failed.",
      "Inspecione stdout/stderr e ObjectChange para auditoria.",
    ],
  },
  diagrams: {
    dispatch: {
      heading: "Lane 1 — dispatch de procedimento",
      caption: "passe o mouse nos nós",
      nodes: {
        operator:
          "Operador, nms rpc, nbx ou companion — cria RPCExecution com slug e ID do alvo.",
        netboxRpc:
          "netbox-rpc valida RBAC, normaliza params, enfileira RQ, appenda eventos.",
        rpcBackend:
          "netbox-rpc-backend recebe comando HTTPS, escolhe driver, conecta ao host.",
        target:
          "Device, VM, endpoint Proxmox ou service — deve existir no NetBox.",
      },
      edges: {
        submit: "POST /api/plugins/rpc/executions/",
        enqueue: "worker RQ + event append",
        forward: "HTTPS RPCBackend",
        execute: "driver SSH / CLI",
      },
    },
    credentials: {
      heading: "Lane 2 — resolução de credencial",
      caption: "reveal só na execução",
      nodes: {
        execution:
          "RPCExecution em running — backend conhece assignment ID, não bytes secretos.",
        openbaoPlugin:
          "netbox-openbao services.py — POST reveal com permissão e reason opcional.",
        broker:
          "netbox-openbao-broker (opcional) — AppRole; NetBox usa cert mTLS.",
        openbaoKv:
          "OpenBao KV v2 — material retornado uma vez ao backend.",
        sshTarget:
          "Sessão SSH — material nunca em params ou GET de RPCExecution.",
      },
      edges: {
        need: "procedimento precisa SSH",
        reveal: "POST reveal",
        vault: "leitura KV v2",
        connect: "auth SSH",
      },
    },
    map: {
      heading: "Lane 3 — mapa cross-plugin",
      caption: "objetos NetBox compartilhados",
      nodes: {
        proxbox:
          "netbox-proxbox — inventário + monitoramento RPC em ProxmoxEndpoint.",
        openbao:
          "netbox-openbao — assignments; ops de host vault como RPC.",
        packer: "netbox-packer — verify pós-bake.",
        fileserver: "netbox-fileserver — validação Samba.",
        proxy: "netbox-proxy — deploy NGINX.",
        rpcCore:
          "netbox-rpc — catálogo e histórico únicos para todas as lanes.",
      },
      edges: {
        inventory: "cria objetos alvo",
        assign: "CredentialAssignment",
        queue: "enfileira RPCExecution",
        audit: "ledger append-only",
      },
    },
  },
  seeAlso: {
    label: "veja também",
    netboxRpc: "showcase netbox-rpc",
    netboxOpenbao: "netbox-openbao — armazenamento de segredos",
    proxmoxSecrets: "Segredos VM Proxmox — proxbox + openbao",
  },
};


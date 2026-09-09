export const PROXBOX_OPENBAO_SECRETS_PT_BR = {
  tagline:
    "Como a sincronização de inventário do netbox-proxbox e o armazenamento de segredos do netbox-openbao trabalham juntos — sem misturar credenciais no pipeline de sync.",
  intro: [
    "O netbox-proxbox mantém VMs QEMU e containers LXC do Proxmox modelados no NetBox — clusters, nós, interfaces, endereços e metadados opcionais de serviço ssh. Esse caminho de sync é somente leitura contra o Proxmox e nunca transporta senhas de login ou chaves privadas.",
    "O netbox-openbao associa credenciais SSH aos mesmos objetos VirtualMachine e virtualization.VM depois que eles existem. O material secreto vive apenas no OpenBao KV v2; o NetBox guarda usuários, fingerprints, assignments e auditoria — o mesmo split de dispositivos no restante do ambiente.",
    "Os dois plugins não se chamam diretamente. Eles se encontram em objetos NetBox compartilhados: o proxbox cria a linha da VM e o contexto de rede; o openbao vincula credenciais a essa linha (e a um ipam.Service quando serviços são modelados).",
  ],
  principles: {
    title: "princípios de design",
    bullets: [
      "Sync de inventário e armazenamento de segredos são trilhos separados — falha de job proxbox não deve rotacionar ou vazar credenciais, e um reveal não dispara chamada à API Proxmox.",
      "Proxbox nunca escreve no OpenBao; netbox-openbao nunca consulta a API Proxmox para descoberta de VMs.",
      "Quick-add SSH na página da VM é o handoff usual: proxbox fornece o objeto; o operador (ou automação com RBAC NetBox) grava o material de login em uma transação atômica.",
      "Com netbox-nms instalado, quick-add por senha espelha em DeviceCredential e SSH DeviceService para RPC/NMS resolver o mesmo segredo sem segundo passo manual.",
    ],
  },
  boundary: {
    title: "o que fica fora do sync proxbox",
    paragraphs: [
      "Credenciais de guest Proxmox — senhas cloud-init, segredos do agente QEMU, senhas root LXC no hypervisor — não fazem parte do contrato de descoberta proxbox. Mesmo quando proxbox cria ou atualiza um ipam.Service ssh com tcp/22, essa linha descreve reachability, não o segredo de login.",
      "Guardar o login SSH cabe ao netbox-openbao (ou outro fluxo de credencial) depois que a VM existe no NetBox. Automação deve resolver material via POST /api/plugins/openbao/credentials/{id}/reveal/ com permissão reveal_credential, não raspando config Proxmox ou esperando payloads de sync com segredos.",
    ],
  },
  workflow: {
    title: "sequência típica do operador",
    steps: [
      "Executar sync proxbox (manual, agendado ou via proxbox-api) para a VM ou container aparecer no cluster e nó corretos com interfaces e IPs.",
      "Abrir a VirtualMachine no NetBox e usar Add SSH access (quick-add) para criar ipam.Service (quando modelado), Credential e CredentialAssignment em uma transação.",
      "Opcional: confirmar chave pública ou metadados de usuário na linha da credencial; material permanece write-only no GET.",
      "Operadores ou automação nbx fazem POST reveal quando precisam da senha ou chave privada para SSH — auditado, Cache-Control: no-store, separado de export de inventário.",
    ],
  },
  sections: {
    overview: "visão geral",
    inventory: "sync inventário",
    credentials: "gravação credencial",
    reveal: "reveal e acesso",
    boundary: "fronteira",
    workflow: "fluxo operador",
  },
  diagrams: {
    inventory: {
      heading: "Trilho 1 — sync de inventário (sem segredos)",
      caption: "Passe o mouse nos nós para detalhes",
      noSecrets: "sem senhas · sem chaves · sem tokens",
      nodes: {
        proxmox:
          "Proxmox VE — hypervisor com VMs QEMU e containers LXC. Fonte de inventário; credenciais de guest no host não entram no sync.",
        proxboxApi:
          "proxbox-api orquestra jobs de sync read-only via proxmox-sdk. HTTP/SSE/WebSocket — nunca grava material secreto.",
        netboxProxbox:
          "Plugin netbox-proxbox mapeia clusters, nós, VMs, interfaces e IPs para modelos NetBox DCIM/virtualization.",
        netboxPg:
          "PostgreSQL NetBox — VirtualMachine, VMInterface, IPAddress, ipam.Service (ex.: ssh tcp/22 como metadado de reachability).",
      },
      edges: {
        toApi: "REST read-only",
        toPlugin: "sync jobs",
        toDb: "netbox-sdk · REST write",
      },
    },
    credentials: {
      heading: "Trilho 2 — gravar credencial SSH na VM",
      caption: "Quick-add ou API após o objeto existir",
      nodes: {
        operator:
          "Operador ou automação com add_credential — botão Add SSH access na página Device/VM.",
        openbaoPlugin:
          "netbox-openbao · services.py — valida RBAC, store_credential(), compensação em rollback.",
        netboxMeta:
          "NetBox — Credential (metadados), CredentialAssignment, ipam.Service ssh:22 quando assignable_models inclui service.",
        openbaoKv:
          "OpenBao KV v2 — ssh-password ou ssh-keypair; AppRole ou broker mTLS.",
        nmsOptional:
          "netbox-nms (opcional) — espelha senha em DeviceCredential + SSH DeviceService para RPC.",
      },
      edges: {
        submit: "POST · transação atômica",
        meta: "metadados indexados",
        secret: "material write-only",
        mirror: "mirror opcional",
      },
    },
    reveal: {
      heading: "Trilho 3 — reveal e acesso SSH",
      caption: "Material só sai via POST reveal auditado",
      nodes: {
        consumer:
          "Operador, nbx CLI, ou NMS RPC — precisa de login SSH para a VM/container.",
        revealApi:
          "POST /api/plugins/openbao/credentials/{id}/reveal/ — permissão reveal_credential, JSON-only, no-store.",
        openbaoRead:
          "OpenBao read via AppRole ou netbox-openbao-broker — sem texto de policy nos erros.",
        target:
          "VirtualMachine ou container — sessão SSH usando IP/interface do inventário proxbox.",
      },
      edges: {
        request: "POST reveal",
        vault: "KV v2 read",
        ssh: "SSH · fora do NetBox",
      },
    },
  },
  seeAlso: {
    label: "ver também",
    netboxOpenbao: "netbox-openbao — showcase do plugin de credenciais",
    netboxProxbox: "netbox-proxbox — sync Proxmox → NetBox",
  },
} as const;

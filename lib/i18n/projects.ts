import { netboxSdk } from "@/content/netbox-sdk";
import { proxmoxSdk } from "@/content/proxmox-sdk";
import { netboxProxbox } from "@/content/netbox-proxbox";
import { proxboxApi } from "@/content/proxbox-api";
import { netboxPbs } from "@/content/netbox-pbs";
import { netboxPdm } from "@/content/netbox-pdm";
import { netboxCeph } from "@/content/netbox-ceph";
import { netboxPacker } from "@/content/netbox-packer";
import type { ComparisonContent, ProjectContent, SectionLink } from "@/content/types";
import { DICTIONARIES } from "./dictionary";
import type { Lang } from "./languages";
import { NETBOX_SDK_PT_BR } from "./projects/netbox-sdk";
import { PROXMOX_SDK_PT_BR } from "./projects/proxmox-sdk";
import { PROXBOX_API_PT_BR } from "./projects/proxbox-api";
import { PROXMOX_SDK_COMPARISON_PT_BR } from "./projects/proxmox-sdk-comparison";
import { NETBOX_SDK_COMPARISON_PT_BR } from "./projects/netbox-sdk-comparison";

function localizeSections<T extends SectionLink>(
  sections: readonly T[],
  lang: Lang,
): T[] {
  const labels = DICTIONARIES[lang].project.sections;
  return sections.map((s) => {
    const key = s.id as keyof typeof labels;
    return labels[key] ? { ...s, label: labels[key] } : { ...s };
  });
}

type ProxboxConfigStep =
  (typeof netboxProxbox.configuration.endpoints)[number];

const NETBOX_PROXBOX_PT_BR = {
  tagline:
    "Plugin do NetBox que sincroniza a infraestrutura do Proxmox para dentro do NetBox via um backend FastAPI.",
  description: [
    "O netbox-proxbox mantém seu DCIM em sincronia com clusters Proxmox reais, transmitindo clusters, nós, VMs, contêineres, storage, snapshots e backups direto para o NetBox.",
    "Combina um plugin para o NetBox (Django) com um serviço FastAPI dedicado chamado proxbox-api, que faz o trabalho pesado e envia o progresso ao vivo via Server-Sent Events.",
  ],
  features: [
    "Sincronização automática: clusters, nós, VMs, contêineres, storage, snapshots, backups",
    "Progresso em tempo real via streaming Server-Sent Events (SSE)",
    "Flags de sincronização granulares por VM e por endpoint",
    "Visualizador ao vivo dos logs do backend obtidos do proxbox-api",
    "Configuração de endpoints via importação/exportação CSV / JSON / YAML",
    "Descoberta somente leitura — nunca altera recursos no Proxmox",
    "Rastreamento de interfaces de rede e atribuições de IP dentro do NetBox",
  ],
  stack: [
    "Plugin do NetBox (Django / Python 3.12+)",
    "proxbox-api (backend FastAPI)",
    "Server-Sent Events para streaming",
    "MkDocs Material para documentação",
  ],
  install: {
    primary: netboxProxbox.install.primary,
    note: "Mais o backend proxbox-api (imagem Docker ou standalone). Veja a documentação.",
  },
  installation: {
    git: localizeSteps(netboxProxbox.installation.git, [
      {
        title: "Clone o repositório no diretório de plugins do NetBox",
        body: "No host do NetBox, coloque o código do plugin ao lado do próprio NetBox.",
      },
      {
        title: "Ative o virtualenv do NetBox",
        body: "Toda instalação do NetBox traz seu próprio venv — use-o para que o plugin se conecte às dependências exatas do NetBox.",
      },
      {
        title: "Instale o plugin em modo editável",
        body: "Instalação editável significa que futuros `git pull` aplicam o novo código sem precisar reinstalar.",
      },
      {
        title: "Habilite o plugin na configuração do NetBox",
        body: "Edite `/opt/netbox/netbox/netbox/configuration.py` e adicione `\"netbox_proxbox\"` à lista `PLUGINS`.",
      },
      {
        title: "Execute as migrações de banco de dados",
        body: "Cria as tabelas do plugin (endpoints, configurações do plugin, histórico de sincronização).",
      },
      {
        title: "Colete os assets estáticos",
        body: "Necessário para que o CSS/JS do plugin sejam servidos pelo NetBox.",
      },
      {
        title: "Reinicie os serviços do NetBox",
        body: "Faz o NetBox carregar o novo plugin e disponibilizá-lo em Plugins → Proxbox.",
      },
      {
        title: "Verifique",
        body: "Abra a interface web do NetBox e vá em Plugins → Proxbox. A página inicial deve carregar com três listas de endpoints vazias — isso indica que a instalação está saudável.",
      },
    ]),
    docker: localizeSteps(netboxProxbox.installation.docker, [
      {
        title: "Adicione o plugin ao plugin_requirements.txt",
        body: "No netbox-community/netbox-docker, os requisitos de plugin ficam ao lado do arquivo do compose.",
      },
      {
        title: "Habilite o plugin em configuration/plugins.py",
        body: "Espelha o fluxo do venv, mas dentro do diretório de configuração do docker.",
      },
      {
        title: "Reconstrua e suba o NetBox",
        body: "O build baixa o plugin do PyPI para a imagem; up -d sobe NetBox + workers.",
      },
      {
        title: "Execute as migrações dentro do contêiner",
        body: "O mesmo `manage.py migrate` da instalação em venv, só que executado pelo contêiner em execução.",
      },
      {
        title: "Verifique",
        body: "Acesse NetBox → Plugins → Proxbox. Se a página renderizar, está pronto para adicionar endpoints.",
      },
    ]),
    backend: localizeSteps(netboxProxbox.installation.backend, [
      {
        title: "Baixe a imagem Docker do proxbox-api",
        body: "O backend é o serviço FastAPI que de fato conversa com o Proxmox e envia o progresso em streaming para o plugin.",
      },
      {
        title: "Execute o backend na porta 8800",
        body: "Mapeie o host 8800 → contêiner 8000. O plugin alcança essa URL pelo objeto de endpoint FastAPI que você criará a seguir.",
      },
      {
        title: "Verifique a saúde",
        body: "Um 200 OK em /health significa que o backend está no ar. Precisa de TLS ou de uma instalação fora do Docker? Veja a documentação oficial do backend.",
      },
    ]),
  },
  configuration: {
    endpoints: localizeConfig(netboxProxbox.configuration.endpoints, [
      {
        title: "Crie o endpoint da API do Proxmox",
        body: [
          "No NetBox, vá em Plugins → Proxbox → Proxmox Endpoints → Adicionar.",
          "Preencha o host ou VIP do Proxmox, a porta (geralmente 8006) e usuário/senha ou um token de API. Ative ou desative a verificação TLS conforme seu ambiente.",
        ],
      },
      {
        title: "Crie o endpoint da API do NetBox",
        body: [
          "Plugins → Proxbox → NetBox Endpoints → Adicionar.",
          "Aponte para o mesmo NetBox que você está configurando (sim, o NetBox aponta para si mesmo), na porta 443 e com um token de API do NetBox que tenha permissão de escrita em DCIM/Virtualization.",
        ],
      },
      {
        title: "Crie o endpoint da ProxBox API (FastAPI)",
        body: [
          "Plugins → Proxbox → FastAPI Endpoints → Adicionar.",
          "Hostname ou IP do serviço proxbox-api, porta 8800 (ou a que você mapeou). Esta é a ponte que executa a sincronização real e devolve o progresso por SSE.",
        ],
      },
      {
        title: "Execute um Full Update",
        body: 'Na página inicial de Plugins → Proxbox, clique em "Full Update". A página transmite o progresso ao vivo via SSE conforme clusters, nós, VMs, contêineres, storage, snapshots e backups aparecem no NetBox.',
      },
    ]),
    settings: localizeConfig(netboxProxbox.configuration.settings, [
      {
        title: "Ajuste as configurações do plugin",
        body: [
          "Plugins → Proxbox → Plugin Settings expõe um objeto singleton de configurações.",
          "Parâmetros úteis: nomeação de interfaces do guest agent, concorrência de fetch no Proxmox, filtro de IPv6 link-local, política de concorrência e retry no NetBox, tamanho de lote em massa, paralelismo de sincronização de VMs.",
        ],
      },
      {
        title: "Configure a proteção contra SSRF",
        body: "Mesma página de configurações. Ative ou desative a proteção SSRF e libere IPs ou CIDRs privados específicos. Mantenha o padrão, a menos que você aponte os endpoints intencionalmente para endereços link-local ou privados.",
      },
      {
        title: "Defina as flags de sobrescrita da sincronização",
        body: [
          "Cada flag `overwrite_*` é configurável globalmente nas configurações do plugin ou por endpoint, na aba Settings de cada endpoint do Proxmox.",
          "Flags por endpoint usam três estados: Usar padrão do plugin / Sempre sobrescrever / Nunca sobrescrever. Isso permite tratar um cluster como autoritativo enquanto consolida dados de outro.",
        ],
      },
    ]),
  },
  screenshots: [
    {
      id: "overview",
      title: "Página inicial do plugin & dashboard",
      items: [
        {
          src: "/netbox-proxbox/screenshots/home.png",
          alt: "Página inicial do plugin Proxbox dentro do NetBox",
          caption:
            "Página inicial do plugin — cartões de status dos endpoints e ações rápidas de sincronização.",
        },
        {
          src: "/netbox-proxbox/screenshots/dashboard.png",
          alt: "Dashboard operacional do Proxbox",
          caption:
            "Dashboard operacional — resumos de cluster e nós em um único lugar.",
        },
      ],
    },
    {
      id: "endpoints",
      title: "Configuração de endpoints",
      items: [
        {
          src: "/netbox-proxbox/screenshots/proxmox-endpoints.png",
          alt: "Lista de endpoints da API do Proxmox configurados",
          caption: "Endpoints da API do Proxmox — todos os clusters que o Proxbox alcança.",
        },
        {
          src: "/netbox-proxbox/screenshots/proxmox-endpoint-detail.png",
          alt: "Detalhe de um endpoint do Proxmox",
          caption:
            "Detalhe do endpoint Proxmox — credenciais, TLS, modo de acesso.",
        },
        {
          src: "/netbox-proxbox/screenshots/proxmox-endpoint-settings.png",
          alt: "Configurações de sincronização por endpoint do Proxmox",
          caption:
            "Configurações de sincronização por endpoint — flags de sobrescrita em três estados.",
        },
        {
          src: "/netbox-proxbox/screenshots/fastapi-endpoints.png",
          alt: "Lista de endpoints FastAPI / proxbox-api",
          caption:
            "Endpoints FastAPI — o backend proxbox-api com quem o Proxbox conversa.",
        },
        {
          src: "/netbox-proxbox/screenshots/fastapi-endpoint-detail.png",
          alt: "Detalhe de um endpoint FastAPI",
          caption: "Detalhe do endpoint FastAPI — host, porta, verificação TLS.",
        },
        {
          src: "/netbox-proxbox/screenshots/netbox-endpoints.png",
          alt: "Lista de endpoints do NetBox (auto-referência)",
          caption: "Endpoints do NetBox — o destino de escrita auto-referenciado.",
        },
        {
          src: "/netbox-proxbox/screenshots/netbox-endpoint-detail.png",
          alt: "Detalhe de um endpoint do NetBox",
          caption: "Detalhe do endpoint NetBox — token e URL base da API.",
        },
      ],
    },
    {
      id: "infrastructure",
      title: "Clusters, nós, storage",
      items: [
        {
          src: "/netbox-proxbox/screenshots/clusters.png",
          alt: "Clusters do Proxmox sincronizados no NetBox",
          caption: "Clusters — todos os clusters Proxmox refletidos no NetBox.",
        },
        {
          src: "/netbox-proxbox/screenshots/nodes.png",
          alt: "Nós Proxmox por cluster",
          caption: "Nós — equipamentos que compõem cada cluster Proxmox.",
        },
        {
          src: "/netbox-proxbox/screenshots/storage.png",
          alt: "Pools de storage do Proxmox",
          caption: "Storage — pools descobertos no Proxmox.",
        },
        {
          src: "/netbox-proxbox/screenshots/storage-detail.png",
          alt: "Detalhe de um pool de storage",
          caption:
            "Detalhe de storage — tipo, capacidade, classes de conteúdo.",
        },
      ],
    },
    {
      id: "vms-containers",
      title: "Máquinas virtuais & contêineres LXC",
      items: [
        {
          src: "/netbox-proxbox/screenshots/virtual-machines.png",
          alt: "Todas as VMs do Proxmox sincronizadas no NetBox",
          caption:
            "Máquinas virtuais — inventário completo entre todos os clusters.",
        },
        {
          src: "/netbox-proxbox/screenshots/virtual-machine-detail.png",
          alt: "Página de detalhes de uma máquina virtual",
          caption:
            "Detalhe da VM — aba de configuração do Proxmox além dos campos nativos do NetBox.",
        },
        {
          src: "/netbox-proxbox/screenshots/lxc-containers.png",
          alt: "Contêineres LXC gerenciados pelo Proxmox",
          caption: "Contêineres LXC — descobertos junto com convidados KVM.",
        },
        {
          src: "/netbox-proxbox/screenshots/lxc-container-detail.png",
          alt: "Detalhe de um contêiner LXC",
          caption: "Detalhe do contêiner — configuração, rede, snapshots.",
        },
      ],
    },
    {
      id: "backups",
      title: "Backups, snapshots, replicações",
      items: [
        {
          src: "/netbox-proxbox/screenshots/backups.png",
          alt: "Jobs de backup de VM descobertos a partir do storage",
          caption:
            "Backups — arquivos vzdump descobertos em cada storage.",
        },
        {
          src: "/netbox-proxbox/screenshots/backup-detail.png",
          alt: "Detalhe de um backup",
          caption: "Detalhe do backup — convidado, tamanho, modo, timestamp.",
        },
        {
          src: "/netbox-proxbox/screenshots/snapshots.png",
          alt: "Snapshots de VMs e contêineres",
          caption: "Snapshots — entre VMs e contêineres.",
        },
        {
          src: "/netbox-proxbox/screenshots/snapshot-detail.png",
          alt: "Detalhe de um snapshot",
          caption: "Detalhe do snapshot — pai, RAM, descrição.",
        },
        {
          src: "/netbox-proxbox/screenshots/backup-routines.png",
          alt: "Definições de rotinas de backup",
          caption: "Rotinas de backup — agendamentos vzdump e destinos.",
        },
        {
          src: "/netbox-proxbox/screenshots/backup-routine-detail.png",
          alt: "Detalhe de uma rotina de backup",
          caption:
            "Detalhe da rotina de backup — seleção, retenção, mailto.",
        },
        {
          src: "/netbox-proxbox/screenshots/replications.png",
          alt: "Status e configuração de jobs de replicação",
          caption:
            "Replicações — jobs e status de replicação do Proxmox.",
        },
      ],
    },
    {
      id: "tasks",
      title: "Histórico de tarefas",
      items: [
        {
          src: "/netbox-proxbox/screenshots/task-history.png",
          alt: "Histórico de tarefas de VM",
          caption: "Histórico de tarefas — jobs do Proxmox visíveis dentro do NetBox.",
        },
        {
          src: "/netbox-proxbox/screenshots/task-history-detail.png",
          alt: "Detalhe de uma tarefa",
          caption: "Detalhe da tarefa — status, log de saída, duração.",
        },
      ],
    },
  ],
};

function localizeSteps<T extends { title: string; body: string }>(
  base: readonly T[],
  ptBr: readonly { title: string; body: string }[],
): T[] {
  return base.map((step, i) => ({
    ...step,
    title: ptBr[i]?.title ?? step.title,
    body: ptBr[i]?.body ?? step.body,
  })) as T[];
}

function localizeConfig(
  base: readonly ProxboxConfigStep[],
  ptBr: readonly { title: string; body: string | string[] }[],
): ProxboxConfigStep[] {
  return base.map((step, i) => {
    const next = ptBr[i];
    if (!next) return { ...step };
    if (typeof step.body === "string") {
      return {
        ...step,
        title: next.title,
        body: typeof next.body === "string" ? next.body : step.body,
      };
    }
    return {
      ...step,
      title: next.title,
      body: Array.isArray(next.body) ? next.body : step.body,
    };
  });
}

export function getNetboxSdk(lang: Lang): ProjectContent {
  if (lang === "en") return netboxSdk;
  return {
    ...netboxSdk,
    tagline: NETBOX_SDK_PT_BR.tagline,
    description: NETBOX_SDK_PT_BR.description,
    features: NETBOX_SDK_PT_BR.features,
    install: NETBOX_SDK_PT_BR.install,
    sections: localizeSections(netboxSdk.sections, lang),
  };
}

export function getProxmoxSdk(lang: Lang): ProjectContent {
  if (lang === "en") return proxmoxSdk;
  return {
    ...proxmoxSdk,
    tagline: PROXMOX_SDK_PT_BR.tagline,
    description: PROXMOX_SDK_PT_BR.description,
    features: PROXMOX_SDK_PT_BR.features,
    install: PROXMOX_SDK_PT_BR.install,
    sections: localizeSections(proxmoxSdk.sections, lang),
  };
}

export type ProxboxApiContent = typeof proxboxApi;

export function getProxboxApi(lang: Lang): ProxboxApiContent {
  if (lang === "en") return proxboxApi;
  return {
    ...proxboxApi,
    tagline: PROXBOX_API_PT_BR.tagline,
    description: PROXBOX_API_PT_BR.description,
    features: PROXBOX_API_PT_BR.features,
    stack: PROXBOX_API_PT_BR.stack,
    install: { ...proxboxApi.install, ...PROXBOX_API_PT_BR.install },
    sections: localizeSections(
      proxboxApi.sections,
      lang,
    ) as typeof proxboxApi.sections,
    integrations: PROXBOX_API_PT_BR.integrations as typeof proxboxApi.integrations,
  };
}

export type NetboxProxboxContent = typeof netboxProxbox;

export function getNetboxProxbox(lang: Lang): NetboxProxboxContent {
  if (lang === "en") return netboxProxbox;
  return {
    ...netboxProxbox,
    tagline: NETBOX_PROXBOX_PT_BR.tagline,
    description: NETBOX_PROXBOX_PT_BR.description,
    features: NETBOX_PROXBOX_PT_BR.features,
    stack: NETBOX_PROXBOX_PT_BR.stack,
    install: { ...netboxProxbox.install, ...NETBOX_PROXBOX_PT_BR.install },
    sections: localizeSections(
      netboxProxbox.sections,
      lang,
    ) as typeof netboxProxbox.sections,
    installation: NETBOX_PROXBOX_PT_BR.installation,
    configuration: NETBOX_PROXBOX_PT_BR.configuration,
    screenshots: NETBOX_PROXBOX_PT_BR.screenshots,
  };
}

export type NetboxPbsContent = typeof netboxPbs;

export function getNetboxPbs(lang: Lang) {
  if (lang === "en") return netboxPbs;
  return { ...netboxPbs, sections: localizeSections(netboxPbs.sections, lang) };
}

export type NetboxPdmContent = typeof netboxPdm;

export function getNetboxPdm(lang: Lang) {
  if (lang === "en") return netboxPdm;
  return { ...netboxPdm, sections: localizeSections(netboxPdm.sections, lang) };
}

export type NetboxCephContent = typeof netboxCeph;

export function getNetboxCeph(lang: Lang) {
  if (lang === "en") return netboxCeph;
  return { ...netboxCeph, sections: localizeSections(netboxCeph.sections, lang) };
}

export type NetboxPackerContent = typeof netboxPacker;

export function getNetboxPacker(lang: Lang) {
  if (lang === "en") return netboxPacker;
  return { ...netboxPacker, sections: localizeSections(netboxPacker.sections, lang) };
}

export function getProxmoxerComparison(
  lang: Lang,
  base: ComparisonContent,
): ComparisonContent {
  if (lang === "en") return base;
  return {
    ...base,
    tagline: PROXMOX_SDK_COMPARISON_PT_BR.tagline,
    sections: PROXMOX_SDK_COMPARISON_PT_BR.sections,
    intro: PROXMOX_SDK_COMPARISON_PT_BR.intro,
    libraryA: PROXMOX_SDK_COMPARISON_PT_BR.libraryA,
    libraryB: PROXMOX_SDK_COMPARISON_PT_BR.libraryB,
    verdict: PROXMOX_SDK_COMPARISON_PT_BR.verdict,
  };
}

export function getNetboxSdkComparison(
  lang: Lang,
  base: ComparisonContent,
): ComparisonContent {
  if (lang === "en") return base;
  return {
    ...base,
    tagline: NETBOX_SDK_COMPARISON_PT_BR.tagline,
    sections: NETBOX_SDK_COMPARISON_PT_BR.sections,
    intro: NETBOX_SDK_COMPARISON_PT_BR.intro,
    libraryA: NETBOX_SDK_COMPARISON_PT_BR.libraryA,
    libraryB: NETBOX_SDK_COMPARISON_PT_BR.libraryB,
    verdict: NETBOX_SDK_COMPARISON_PT_BR.verdict,
  };
}

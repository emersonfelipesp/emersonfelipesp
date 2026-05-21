import type { ArticleContent } from "@/content/types";

export const PROXMOX_SDK_PVE92_PT_BR: Pick<
  ArticleContent,
  "tagline" | "intro" | "highlights" | "sections"
> = {
  tagline:
    "Proxmox VE 9.2 traz 13 novos caminhos de API — modelos de CPU personalizados, controles BGP SDN, identidade de storage. proxmox-sdk v0.0.6 cobre todos eles.",
  sections: [
    { id: "overview", label: "visão geral" },
    { id: "custom-cpu-models", label: "cpu models personalizados" },
    { id: "sdn-prefix-lists", label: "sdn prefix lists" },
    { id: "sdn-route-maps", label: "sdn route maps" },
    { id: "storage-identity", label: "identidade de storage" },
    { id: "other-highlights", label: "outros destaques" },
  ],
  intro: [
    "Proxmox VE 9.2, lançado em 21 de maio de 2026, adiciona 13 novos caminhos REST sobre os 431 presentes na versão 9.1.11. As adições concentram-se em três áreas: gerenciamento de modelos de CPU personalizados em todo o cluster, objetos de política BGP no SDN (prefix lists e route maps) e um endpoint de identidade de storage por nó.",
    "proxmox-sdk v0.0.6 atualizou seu schema gerado para o Proxmox VE 9.2, totalizando 675 operações em 449 caminhos. Cada novo endpoint está disponível no modo mock por padrão — respostas CRUD geradas automaticamente, sem cluster. O modo real encaminha requisições validadas para um nó PVE 9.2 real.",
  ],
  highlights: [
    {
      id: "overview",
      heading: "O que mudou na superfície da API",
      body: [
        "PVE 9.2 adiciona exatamente 13 novos caminhos em relação à versão 9.1.11, sem remoções. As adições são contidas: gerenciamento de QEMU no cluster (tipos de CPU personalizados), objetos de política BGP no SDN (prefix lists, route maps) e um endpoint de identidade de storage em nós.",
        "proxmox-sdk mantém o schema 9.1.11 ao lado do 9.2. A matrix de CI testa ambas as versões a cada commit, e o namespace de estado do mock (`PROXMOX_MOCK_STATE_NAMESPACE`) isola o CRUD em memória para que execuções paralelas de testes em versões diferentes do schema nunca compartilhem estado.",
        "O SDK não detecta automaticamente a versão do PVE de um host conectado. O código da sua aplicação é responsável por rotear requisições para a versão de schema correta ao operar no modo real contra uma frota com versões mistas.",
      ],
    },
    {
      id: "custom-cpu-models",
      heading: "Modelos de CPU personalizados em todo o cluster",
      body: [
        "PVE 9.2 introduz cinco novos caminhos em `/cluster/qemu/` que permitem aos administradores definir tipos de CPU personalizados em todo o cluster, em vez de por VM. Os tipos personalizados herdam de um modelo de CPU base (ex.: `Westmere`, `Haswell`) e permitem substituições aditivas de flags via uma string de flags.",
        "Com proxmox-sdk você pode gerenciar esses modelos no modo mock sem um cluster. Substitua a URL base por um nó PVE 9.2 real e as mesmas chamadas se aplicam.",
      ],
      code: {
        lang: "python",
        label: "/cluster/qemu/custom-cpu-models",
        content: `import asyncio
from proxmox_sdk.sdk import ProxmoxSDK

sdk = ProxmoxSDK()  # mock mode (default)

async def main() -> None:
    # List all custom CPU models in the cluster
    models = await sdk.get("/cluster/qemu/custom-cpu-models")
    print(models)

    # Create a new custom CPU model
    await sdk.post(
        "/cluster/qemu/custom-cpu-models",
        json={
            "name": "westmere-aes",
            "base": "Westmere",
            "flags": "+aes;+pcmuldq",
        },
    )

    # Read, update, delete by cputype name
    detail = await sdk.get("/cluster/qemu/custom-cpu-models/westmere-aes")
    await sdk.put(
        "/cluster/qemu/custom-cpu-models/westmere-aes",
        json={"flags": "+aes;+pcmuldq;+sse4.2"},
    )
    await sdk.delete("/cluster/qemu/custom-cpu-models/westmere-aes")

asyncio.run(main())`,
      },
    },
    {
      id: "sdn-prefix-lists",
      heading: "Prefix lists SDN para política BGP",
      body: [
        "PVE 9.2 estende a camada SDN com CRUD de prefix-lists: uma prefix-list nomeada contém entradas de sequência ordenadas, cada uma combinando um prefixo de rede com uma ação de permit/deny. As prefix-lists são então referenciadas por route maps para construir políticas de import/export BGP.",
        "A superfície da API segue uma hierarquia de dois níveis: `/cluster/sdn/prefix-lists` para objetos de lista, `/cluster/sdn/prefix-lists/{id}/entries` para entradas por sequência.",
      ],
      code: {
        lang: "python",
        label: "/cluster/sdn/prefix-lists",
        content: `import asyncio
from proxmox_sdk.sdk import ProxmoxSDK

sdk = ProxmoxSDK()

async def main() -> None:
    # Create a prefix list
    await sdk.post(
        "/cluster/sdn/prefix-lists",
        json={"id": "pl-loopbacks", "digest": None},
    )

    # Add a sequence entry
    await sdk.post(
        "/cluster/sdn/prefix-lists/pl-loopbacks/entries",
        json={
            "seq": 10,
            "network": "10.0.0.0/24",
            "action": "permit",
        },
    )

    # Read back entries
    entries = await sdk.get("/cluster/sdn/prefix-lists/pl-loopbacks/entries")
    print(entries)

    # Update a specific entry by sequence number
    await sdk.put(
        "/cluster/sdn/prefix-lists/pl-loopbacks/entries/10",
        json={"network": "10.0.0.0/24", "action": "deny"},
    )

asyncio.run(main())`,
      },
    },
    {
      id: "sdn-route-maps",
      heading: "Route maps SDN para import/export BGP",
      body: [
        "Route maps consomem prefix-lists e as aplicam a políticas de vizinhos BGP. PVE 9.2 adiciona `/cluster/sdn/route-maps` para listar route maps nomeados, e uma hierarquia de dois níveis `/cluster/sdn/route-maps/entries/{route-map-id}/entry/{order}` para cláusulas individuais de match/set.",
        "As entradas de route map suportam condições de match (prefix-list correspondente, interface correspondente) e ações de set (preferência local, community, métrica). A combinação de prefix-lists e route maps oferece controle completo de política BGP através da API REST do Proxmox.",
      ],
      code: {
        lang: "python",
        label: "/cluster/sdn/route-maps",
        content: `import asyncio
from proxmox_sdk.sdk import ProxmoxSDK

sdk = ProxmoxSDK()

async def main() -> None:
    # List all route maps
    route_maps = await sdk.get("/cluster/sdn/route-maps")
    print(route_maps)

    # Create a route map entry
    await sdk.post(
        "/cluster/sdn/route-maps/entries",
        json={"name": "rm-import-loopbacks"},
    )

    # Add an ordered clause to the route map
    await sdk.put(
        "/cluster/sdn/route-maps/entries/rm-import-loopbacks/entry/10",
        json={
            "action": "permit",
            "match-ip-address": "pl-loopbacks",
            "set-local-preference": 200,
        },
    )

    # Read back the clause
    clause = await sdk.get(
        "/cluster/sdn/route-maps/entries/rm-import-loopbacks/entry/10"
    )
    print(clause)

asyncio.run(main())`,
      },
    },
    {
      id: "storage-identity",
      heading: "Identidade de storage por nó",
      body: [
        "PVE 9.2 adiciona GET `/nodes/{node}/storage/{storage}/identity` — um endpoint somente leitura que retorna metadados de identidade para um backend de storage específico em um determinado nó. Útil para pipelines de auditoria que precisam correlacionar registros de storage do Proxmox com identificadores de storage físico ou em nuvem sem iterar a lista completa de storage.",
      ],
      code: {
        lang: "python",
        label: "/nodes/{node}/storage/{storage}/identity",
        content: `import asyncio
from proxmox_sdk.sdk import ProxmoxSDK

sdk = ProxmoxSDK()

async def main() -> None:
    # Retrieve identity metadata for a storage backend on a node
    identity = await sdk.get("/nodes/pve-node1/storage/local-lvm/identity")
    print(identity)

asyncio.run(main())`,
      },
    },
    {
      id: "other-highlights",
      heading: "Outros destaques do PVE 9.2",
      body: [
        "Balanceamento de Carga Dinâmico (Cluster Resource Scheduler) — o CRS agora inclui um modo DLB automático que migra VMs em execução entre nós em resposta à pressão de CPU e memória em tempo real, e não apenas na inicialização. As configurações existentes de cluster_ha_scheduler e migrated são preservadas durante o upgrade.",
        "Melhorias no WireGuard e BGP do SDN — além dos novos endpoints da API, PVE 9.2 traz integração FRR atualizada com negociação de peer BGP mais estável e tratamento aprimorado de zonas WireGuard para topologias SDN multi-site.",
        "Disarm / Arm de grupos HA — administradores agora podem desarmar um grupo HA para pausar o fencing e a recuperação automáticos durante manutenções planejadas, e rearmá-lo sem reiniciar o gerenciador HA. Anteriormente isso exigia remover temporariamente os nós do grupo.",
        "QEMU 11.0 — a versão incluída do QEMU avança para 11.0, trazendo melhorias no virtio-fs e estabilidade atualizada do vhost-user net para workloads de alto throughput.",
        "Ceph Tentacle 20.2.1 estável — Ceph Tentacle é agora a versão padrão do Ceph nos repositórios do PVE 9.2. Clusters PVE 9.1 rodando Pacific ou Quincy podem fazer upgrade seguindo o guia de upgrade do Ceph para Proxmox.",
        "LXC 7.0 — as ferramentas LXC userspace embarcadas avançam para 7.0, com suporte aprimorado ao cgroup v2 e melhores padrões de isolamento de contêineres não privilegiados.",
      ],
    },
  ],
};

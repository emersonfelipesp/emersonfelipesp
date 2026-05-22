import type { ArticleContent } from "./types";
import { PROJECTS } from "@/lib/project-registry";
import { proxmoxSdk } from "./proxmox-sdk";

const project = PROJECTS["proxmox-sdk"];

export const proxmoxPve92: ArticleContent = {
  slug: project.slug,
  name: project.name,
  fullName: project.fullName,
  palette: project.palette,
  published: "2026-05-21",
  tagline:
    "Proxmox VE 9.2 ships 13 new API paths — custom CPU models, SDN BGP controls, storage identity. proxmox-sdk v0.0.6 covers all of them.",
  banner: proxmoxSdk.banner,
  sections: [
    { id: "overview", label: "overview" },
    { id: "custom-cpu-models", label: "custom cpu models" },
    { id: "sdn-prefix-lists", label: "sdn prefix lists" },
    { id: "sdn-route-maps", label: "sdn route maps" },
    { id: "storage-identity", label: "storage identity" },
    { id: "other-highlights", label: "other highlights" },
  ],
  intro: [
    "Proxmox VE 9.2, released on May 21 2026, adds 13 new REST API paths on top of the 431 present in 9.1.11. The additions cluster around three areas: cluster-wide custom CPU model management, SDN BGP policy objects (prefix lists and route maps), and a per-node storage identity endpoint.",
    "proxmox-sdk v0.0.6 updated its generated schema to Proxmox VE 9.2, bringing the total to 675 operations across 449 paths. Every new endpoint is available in mock mode out of the box — auto-generated CRUD responses, no cluster required. Real mode forwards validated requests to a live PVE 9.2 node.",
  ],
  highlights: [
    {
      id: "overview",
      heading: "What changed in the API surface",
      body: [
        "PVE 9.2 adds exactly 13 new paths over 9.1.11, with zero removals. The additions are contained: cluster QEMU management (custom CPU types), SDN BGP policy objects (prefix lists, route maps), and a per-storage identity endpoint on nodes.",
        "proxmox-sdk retains the 9.1.11 schema alongside 9.2. The CI matrix tests both versions on every commit, and the mock state namespace (`PROXMOX_MOCK_STATE_NAMESPACE`) isolates in-memory CRUD so parallel test runs on different schema versions never share state.",
        "The SDK does not auto-detect the PVE version of a connected host. Your application code is responsible for routing requests to the right schema version when operating in real mode against a mixed-version fleet.",
      ],
    },
    {
      id: "custom-cpu-models",
      heading: "Cluster-wide custom CPU models",
      body: [
        "PVE 9.2 introduces five new paths under `/cluster/qemu/` that let administrators define custom CPU types cluster-wide, rather than per-VM. Custom types inherit from a base CPU model (e.g. `Westmere`, `Haswell`) and allow additive flag overrides via a flags string.",
        "With proxmox-sdk you can manage these in mock mode without a cluster. Swap the base URL for a real PVE 9.2 node and the same calls apply.",
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
      heading: "SDN prefix lists for BGP policy",
      body: [
        "PVE 9.2 extends the SDN layer with prefix-list CRUD: a named prefix-list contains ordered sequence entries, each pairing a network prefix with a permit/deny action. Prefix lists are then referenced by route maps to build BGP import/export policies.",
        "The API surface follows a two-level hierarchy: `/cluster/sdn/prefix-lists` for list objects, `/cluster/sdn/prefix-lists/{id}/entries` for per-sequence entries.",
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
      heading: "SDN route maps for BGP import/export",
      body: [
        "Route maps consume prefix lists and apply them to BGP neighbor policies. PVE 9.2 adds `/cluster/sdn/route-maps` for listing named route maps, and a two-level `/cluster/sdn/route-maps/entries/{route-map-id}/entry/{order}` hierarchy for individual match/set clauses.",
        "Route map entries support match conditions (matched prefix list, matched interface) and set actions (local preference, community, metric). The combination of prefix lists and route maps gives administrators full BGP policy control through the Proxmox REST API.",
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
      heading: "Per-node storage identity",
      body: [
        "PVE 9.2 adds GET `/nodes/{node}/storage/{storage}/identity` — a read-only endpoint that returns identity metadata for a specific storage backend on a given node. Useful for audit pipelines that need to correlate Proxmox storage records with physical or cloud storage identifiers without iterating the full storage list.",
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
      heading: "Other PVE 9.2 highlights",
      body: [
        "Dynamic Load Balancing (Cluster Resource Scheduler) — CRS now includes an automatic DLB mode that migrates running VMs across nodes in response to real-time CPU and memory pressure, not just at startup. Existing cluster_ha_scheduler and migrated settings are preserved during upgrade.",
        "SDN WireGuard and BGP improvements — beyond the new API endpoints, PVE 9.2 ships updated FRR integration with more stable BGP peer negotiation and improved WireGuard zone handling for multi-site SDN topologies.",
        "HA group Disarm / Arm — administrators can now disarm an HA group to pause automatic fencing and recovery during planned maintenance, then re-arm without restarting the HA manager. Previously this required temporarily removing nodes from the group.",
        "QEMU 11.0 — the included QEMU version moves to 11.0, which brings virtio-fs improvements and updated vhost-user net stability for high-throughput workloads.",
        "Ceph Tentacle 20.2.1 stable — Ceph Tentacle (formerly Reef follow-up) is now the default Ceph version in PVE 9.2 repositories. PVE 9.1 clusters running Pacific or Quincy can upgrade in place following the Proxmox Ceph upgrade guide.",
        "LXC 7.0 — the bundled LXC userspace tools move to 7.0, with improved cgroup v2 support and better container isolation defaults for unprivileged containers.",
      ],
    },
  ],
  links: {
    repo: project.repoUrl,
    docs: "https://emersonfelipesp.com/proxmox-sdk/docs/",
    pve92: "https://www.proxmox.com/en/news/press-releases/proxmox-virtual-environment-9-2",
  },
};

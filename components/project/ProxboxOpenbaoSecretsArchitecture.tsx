"use client";

import {
  ThreeLineCanvas,
  type DiagramPath,
} from "@/components/diagram/ThreeLineCanvas";
import type { ProxboxOpenbaoSecretsLocalized } from "@/lib/i18n/projects";

type DiagramCopy = ProxboxOpenbaoSecretsLocalized["diagrams"];
type NodeProps = {
  name: string;
  description: string;
  href?: string;
  featured?: boolean;
  highlight?: boolean;
  meta?: string;
};

function line(x1: number, y1: number, x2: number, y2: number): DiagramPath {
  return { points: [[x1, y1], [x2, y2]] };
}

function polyline(points: DiagramPath["points"]): DiagramPath {
  return { points };
}

const VERTICAL_DOWN: readonly DiagramPath[] = [
  line(50, 0, 50, 14),
  polyline([[47, 12], [50, 16], [53, 12]]),
];

const SPLIT_PATHS: readonly DiagramPath[] = [
  line(50, 0, 50, 10),
  line(20, 10, 80, 10),
  line(20, 10, 20, 20),
  line(80, 10, 80, 20),
  polyline([[18, 18], [20, 22], [22, 18]]),
  polyline([[78, 18], [80, 22], [82, 18]]),
];

function DiagramNode({
  name,
  description,
  href,
  featured = false,
  highlight = false,
  meta,
}: NodeProps) {
  const baseClasses =
    "relative inline-flex items-center justify-center border bg-surface px-3 py-1.5 text-sm outline-none whitespace-nowrap transition-[color,background-color,border-color,transform] duration-150 before:absolute before:-inset-1.5 before:content-[''] active:scale-[0.96]";
  const stateClasses = featured
    ? "border-accent bg-accent/10 text-accent hover:bg-accent/20 focus-visible:bg-accent/20"
    : highlight
      ? "border-accent/70 text-accent hover:bg-surface-2 hover:border-accent focus-visible:bg-surface-2 focus-visible:border-accent"
      : "border-border text-fg/90 hover:border-accent hover:text-accent hover:bg-surface-2 focus-visible:border-accent focus-visible:text-accent";

  const tipId = `pobs-tip-${name.replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;

  const inner = (
    <>
      <span className="text-muted">[</span>
      <span className="mx-1">{name}</span>
      {meta ? (
        <span className="ml-1 text-muted/80 text-xs">{meta}</span>
      ) : null}
      <span className="text-muted">]</span>
    </>
  );

  return (
    <span className="group relative inline-flex max-w-full">
      {href ? (
        <a
          href={href}
          className={`${baseClasses} ${stateClasses} cursor-pointer`}
          aria-describedby={tipId}
          aria-label={name}
        >
          {inner}
        </a>
      ) : (
        <button
          type="button"
          className={`${baseClasses} ${stateClasses} cursor-help`}
          aria-describedby={tipId}
          aria-label={name}
        >
          {inner}
        </button>
      )}

      <span
        id={tipId}
        role="tooltip"
        className="pointer-events-none fixed top-4 right-4 left-4 z-50 border border-accent/60 bg-surface-2 px-3 py-2 text-left text-xs leading-relaxed text-fg/90 opacity-0 shadow-[0_0_0_1px_var(--border)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 sm:absolute sm:top-auto sm:right-auto sm:bottom-full sm:left-1/2 sm:z-20 sm:mb-2 sm:w-72 sm:-translate-x-1/2"
      >
        <span className="block text-accent">{name}</span>
        <span className="mt-1 block whitespace-normal">{description}</span>
      </span>
    </span>
  );
}

function VerticalConnector({
  primary,
  secondary,
}: {
  primary?: string;
  secondary?: string;
}) {
  return (
    <div className="flex w-full max-w-md flex-col items-center">
      <ThreeLineCanvas
        viewBox={[100, 18]}
        paths={VERTICAL_DOWN}
        className="h-5 w-full max-w-[8rem] text-muted"
        preserveDrawingBuffer
      />
      {primary ? (
        <span className="text-[10px] uppercase tracking-wider text-muted/90">
          {primary}
        </span>
      ) : null}
      {secondary ? (
        <span className="-mt-0.5 text-[10px] tracking-wider text-muted/70">
          {secondary}
        </span>
      ) : null}
    </div>
  );
}

function SplitConnector({
  leftPrimary,
  leftSecondary,
  rightPrimary,
  rightSecondary,
}: {
  leftPrimary: string;
  leftSecondary?: string;
  rightPrimary: string;
  rightSecondary?: string;
}) {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center">
      <ThreeLineCanvas
        viewBox={[100, 24]}
        paths={SPLIT_PATHS}
        className="h-7 w-full text-muted"
        preserveDrawingBuffer
      />
      <div className="grid w-full grid-cols-2 gap-x-4">
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted/90">
            {leftPrimary}
          </span>
          {leftSecondary ? (
            <span className="text-[10px] tracking-wider text-muted/70">
              {leftSecondary}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted/90">
            {rightPrimary}
          </span>
          {rightSecondary ? (
            <span className="text-[10px] tracking-wider text-muted/70">
              {rightSecondary}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function InventoryDiagram({ d }: { d: DiagramCopy["inventory"] }) {
  return (
    <div
      className="overflow-x-auto border border-border bg-surface p-4 sm:p-6"
      data-testid="proxbox-openbao-inventory-diagram"
    >
      <p className="mb-4 text-xs text-muted">
        {d.heading}{" "}
        <span className="text-muted/70">— {d.caption}</span>
      </p>
      <div className="flex min-w-[52rem] flex-col items-center gap-1">
        <DiagramNode
          name="Proxmox VE"
          meta="QEMU + LXC"
          description={d.nodes.proxmox}
        />
        <VerticalConnector primary={d.edges.toApi} />
        <DiagramNode
          name="proxbox-api"
          meta="FastAPI"
          description={d.nodes.proxboxApi}
          href="/proxbox-api"
          highlight
        />
        <VerticalConnector primary={d.edges.toPlugin} />
        <DiagramNode
          name="netbox-proxbox"
          meta="plugin"
          description={d.nodes.netboxProxbox}
          href="/netbox-proxbox"
          featured
        />
        <VerticalConnector primary={d.edges.toDb} />
        <DiagramNode
          name="NetBox PostgreSQL"
          meta="VM · IP · Service"
          description={d.nodes.netboxPg}
        />
        <p className="mt-3 border border-accent/40 bg-accent/5 px-3 py-2 text-center text-[10px] uppercase tracking-wider text-accent">
          {d.noSecrets}
        </p>
      </div>
    </div>
  );
}

function CredentialDiagram({ d }: { d: DiagramCopy["credentials"] }) {
  return (
    <div
      className="overflow-x-auto border border-border bg-surface p-4 sm:p-6"
      data-testid="proxbox-openbao-credential-diagram"
    >
      <p className="mb-4 text-xs text-muted">
        {d.heading}{" "}
        <span className="text-muted/70">— {d.caption}</span>
      </p>
      <div className="flex min-w-[52rem] flex-col items-center gap-1">
        <DiagramNode
          name="operator / automation"
          meta="quick-add SSH"
          description={d.nodes.operator}
        />
        <VerticalConnector primary={d.edges.submit} />
        <DiagramNode
          name="netbox-openbao"
          meta="services.py"
          description={d.nodes.openbaoPlugin}
          href="/netbox-openbao"
          featured
        />
        <SplitConnector
          leftPrimary={d.edges.meta}
          leftSecondary="NetBox rows"
          rightPrimary={d.edges.brokerPath}
          rightSecondary="optional"
        />
        <div className="grid w-full max-w-2xl grid-cols-2 gap-x-4 gap-y-2 justify-items-center">
          <DiagramNode
            name="NetBox metadata"
            description={d.nodes.netboxMeta}
            highlight
          />
          <DiagramNode
            name="netbox-openbao-broker"
            meta="mTLS · optional"
            description={d.nodes.brokerOptional}
            highlight
          />
        </div>
        <VerticalConnector primary={d.edges.secret} secondary="direct AppRole or via broker" />
        <DiagramNode
          name="OpenBao KV v2"
          meta="ssh-password · keypair"
          description={d.nodes.openbaoKv}
          featured
        />
      </div>
    </div>
  );
}

function RevealDiagram({ d }: { d: DiagramCopy["reveal"] }) {
  return (
    <div
      className="overflow-x-auto border border-border bg-surface p-4 sm:p-6"
      data-testid="proxbox-openbao-reveal-diagram"
    >
      <p className="mb-4 text-xs text-muted">
        {d.heading}{" "}
        <span className="text-muted/70">— {d.caption}</span>
      </p>
      <div className="flex min-w-[48rem] flex-col items-center gap-1">
        <DiagramNode
          name="operator · nbx · netbox-rpc"
          description={d.nodes.consumer}
        />
        <VerticalConnector primary={d.edges.request} />
        <DiagramNode
          name="openbao REST reveal"
          meta="POST only"
          description={d.nodes.revealApi}
          href="/netbox-openbao"
          highlight
        />
        <VerticalConnector primary={d.edges.vault} />
        <DiagramNode
          name="OpenBao / broker"
          description={d.nodes.openbaoRead}
          highlight
        />
        <VerticalConnector primary={d.edges.ssh} />
        <DiagramNode
          name="VirtualMachine / LXC"
          meta="SSH target"
          description={d.nodes.target}
          featured
        />
      </div>
    </div>
  );
}

function StackDiagram({ d }: { d: DiagramCopy["stack"] }) {
  return (
    <div
      className="overflow-x-auto border border-border bg-surface p-4 sm:p-6"
      data-testid="proxbox-openbao-stack-diagram"
    >
      <p className="mb-4 text-xs text-muted">
        {d.heading}{" "}
        <span className="text-muted/70">— {d.caption}</span>
      </p>
      <div className="flex min-w-[56rem] flex-col items-center gap-1">
        <DiagramNode
          name="operator · nbx"
          description={d.nodes.consumer}
        />
        <VerticalConnector primary={d.edges.plugins} />
        <div className="grid w-full max-w-2xl grid-cols-2 gap-x-4 gap-y-2 justify-items-center">
          <DiagramNode
            name="netbox-openbao"
            meta="plugin"
            description={d.nodes.openbaoPlugin}
            href="/netbox-openbao"
            featured
          />
          <DiagramNode
            name="netbox-rpc"
            meta="plugin"
            description={d.nodes.rpcPlugin}
            highlight
          />
        </div>
        <SplitConnector
          leftPrimary={d.edges.toBroker}
          leftSecondary={d.edges.toVault}
          rightPrimary={d.edges.dispatch}
          rightSecondary="catalog"
        />
        <div className="grid w-full max-w-2xl grid-cols-2 gap-x-4 gap-y-2 justify-items-center">
          <DiagramNode
            name="netbox-openbao-broker"
            meta="optional"
            description={d.nodes.broker}
            highlight
          />
          <DiagramNode
            name="netbox-rpc-backend"
            meta="executor"
            description={d.nodes.rpcBackend}
            highlight
          />
        </div>
        <VerticalConnector primary={d.edges.resolve} />
        <DiagramNode
          name="OpenBao KV v2"
          description={d.nodes.openbaoKv}
          featured
        />
        <VerticalConnector primary={d.edges.ssh} />
        <DiagramNode
          name="Device · VirtualMachine"
          meta="SSH target"
          description={d.nodes.target}
          featured
        />
      </div>
    </div>
  );
}

type Props = {
  diagrams: DiagramCopy;
  lane: "inventory" | "credentials" | "reveal" | "stack";
};

export function ProxboxOpenbaoSecretsArchitecture({ diagrams, lane }: Props) {
  if (lane === "inventory") {
    return <InventoryDiagram d={diagrams.inventory} />;
  }
  if (lane === "credentials") {
    return <CredentialDiagram d={diagrams.credentials} />;
  }
  if (lane === "stack") {
    return <StackDiagram d={diagrams.stack} />;
  }
  return <RevealDiagram d={diagrams.reveal} />;
}

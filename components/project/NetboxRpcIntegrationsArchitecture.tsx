"use client";

import {
  ThreeLineCanvas,
  type DiagramPath,
} from "@/components/diagram/ThreeLineCanvas";
import type { NetboxRpcIntegrationsLocalized } from "@/lib/i18n/projects";

type DiagramCopy = NetboxRpcIntegrationsLocalized["diagrams"];
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
  polyline([
    [47, 12],
    [50, 16],
    [53, 12],
  ]),
];

const HUB_PATHS: readonly DiagramPath[] = [
  line(50, 0, 50, 8),
  line(15, 8, 85, 8),
  line(15, 8, 15, 18),
  line(35, 8, 35, 18),
  line(50, 8, 50, 18),
  line(65, 8, 65, 18),
  line(85, 8, 85, 18),
  polyline([
    [13, 16],
    [15, 20],
    [17, 16],
  ]),
  polyline([
    [33, 16],
    [35, 20],
    [37, 16],
  ]),
  polyline([
    [48, 16],
    [50, 20],
    [52, 16],
  ]),
  polyline([
    [63, 16],
    [65, 20],
    [67, 16],
  ]),
  polyline([
    [83, 16],
    [85, 20],
    [87, 16],
  ]),
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

  const tipId = `rpcint-tip-${name.replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;

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

function VerticalConnector({ primary }: { primary?: string }) {
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
    </div>
  );
}

function DispatchDiagram({ d }: { d: DiagramCopy["dispatch"] }) {
  return (
    <div
      className="overflow-x-auto border border-border bg-surface p-4 sm:p-6"
      data-testid="netbox-rpc-dispatch-diagram"
    >
      <p className="mb-4 text-xs text-muted">
        {d.heading}{" "}
        <span className="text-muted/70">— {d.caption}</span>
      </p>
      <div className="flex min-w-[48rem] flex-col items-center gap-1">
        <DiagramNode
          name="operator / companion"
          meta="nms rpc · nbx"
          description={d.nodes.operator}
        />
        <VerticalConnector primary={d.edges.submit} />
        <DiagramNode
          name="netbox-rpc"
          meta="plugin"
          description={d.nodes.netboxRpc}
          href="/netbox-rpc"
          featured
        />
        <VerticalConnector primary={d.edges.enqueue} />
        <DiagramNode
          name="netbox-rpc-backend"
          meta="FastAPI"
          description={d.nodes.rpcBackend}
          highlight
        />
        <VerticalConnector primary={d.edges.forward} />
        <DiagramNode
          name="target host"
          meta="device · VM · endpoint"
          description={d.nodes.target}
        />
        <p className="mt-3 border border-accent/40 bg-accent/5 px-3 py-2 text-center text-[10px] uppercase tracking-wider text-accent">
          {d.edges.execute}
        </p>
      </div>
    </div>
  );
}

function CredentialDiagram({ d }: { d: DiagramCopy["credentials"] }) {
  return (
    <div
      className="overflow-x-auto border border-border bg-surface p-4 sm:p-6"
      data-testid="netbox-rpc-credential-diagram"
    >
      <p className="mb-4 text-xs text-muted">
        {d.heading}{" "}
        <span className="text-muted/70">— {d.caption}</span>
      </p>
      <div className="flex min-w-[48rem] flex-col items-center gap-1">
        <DiagramNode
          name="RPCExecution"
          meta="running"
          description={d.nodes.execution}
        />
        <VerticalConnector primary={d.edges.need} />
        <DiagramNode
          name="netbox-openbao"
          meta="POST reveal"
          description={d.nodes.openbaoPlugin}
          href="/netbox-openbao"
          featured
        />
        <VerticalConnector primary={d.edges.reveal} />
        <DiagramNode
          name="broker / OpenBao"
          description={d.nodes.broker}
          highlight
        />
        <VerticalConnector primary={d.edges.vault} />
        <DiagramNode
          name="OpenBao KV v2"
          description={d.nodes.openbaoKv}
          highlight
        />
        <VerticalConnector primary={d.edges.connect} />
        <DiagramNode
          name="SSH target"
          description={d.nodes.sshTarget}
        />
      </div>
    </div>
  );
}

function MapDiagram({ d }: { d: DiagramCopy["map"] }) {
  return (
    <div
      className="overflow-x-auto border border-border bg-surface p-4 sm:p-6"
      data-testid="netbox-rpc-map-diagram"
    >
      <p className="mb-4 text-xs text-muted">
        {d.heading}{" "}
        <span className="text-muted/70">— {d.caption}</span>
      </p>
      <div className="flex min-w-[56rem] flex-col items-center gap-1">
        <DiagramNode
          name="netbox-rpc"
          meta="catalog + ledger"
          description={d.nodes.rpcCore}
          href="/netbox-rpc"
          featured
        />
        <div className="flex w-full max-w-3xl flex-col items-center">
          <ThreeLineCanvas
            viewBox={[100, 24]}
            paths={HUB_PATHS}
            className="h-8 w-full text-muted"
            preserveDrawingBuffer
          />
        </div>
        <div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 justify-items-center">
          <DiagramNode
            name="netbox-proxbox"
            description={d.nodes.proxbox}
            href="/netbox-proxbox"
            highlight
          />
          <DiagramNode
            name="netbox-openbao"
            description={d.nodes.openbao}
            href="/netbox-openbao"
            highlight
          />
          <DiagramNode
            name="netbox-packer"
            description={d.nodes.packer}
          />
          <DiagramNode
            name="netbox-fileserver"
            description={d.nodes.fileserver}
          />
          <DiagramNode
            name="netbox-proxy"
            description={d.nodes.proxy}
          />
        </div>
        <p className="mt-4 border border-border bg-surface-2 px-3 py-2 text-center text-[10px] uppercase tracking-wider text-muted">
          {d.edges.inventory} · {d.edges.assign} · {d.edges.queue} ·{" "}
          {d.edges.audit}
        </p>
      </div>
    </div>
  );
}

type Props = {
  diagrams: DiagramCopy;
  lane: "dispatch" | "credentials" | "map";
};

export function NetboxRpcIntegrationsArchitecture({ diagrams, lane }: Props) {
  if (lane === "dispatch") {
    return <DispatchDiagram d={diagrams.dispatch} />;
  }
  if (lane === "credentials") {
    return <CredentialDiagram d={diagrams.credentials} />;
  }
  return <MapDiagram d={diagrams.map} />;
}


"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  ThreeLineCanvas,
  type DiagramPath,
} from "@/components/diagram/ThreeLineCanvas";

type NodeProps = {
  name: string;
  description: string;
  href?: string;
  featured?: boolean;
  highlight?: boolean;
  meta?: string;
};

function line(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): DiagramPath {
  return { points: [[x1, y1], [x2, y2]] };
}

function polyline(points: DiagramPath["points"]): DiagramPath {
  return { points };
}

const PLUGIN_TO_API_CONNECTOR_PATHS: readonly DiagramPath[] = [
  line(10, 0, 10, 9),
  line(30, 0, 30, 9),
  line(50, 0, 50, 9),
  line(70, 0, 70, 9),
  line(90, 0, 90, 9),
  line(10, 9, 90, 9),
  line(50, 9, 50, 20),
];

const FORK_CONNECTOR_PATHS: readonly DiagramPath[] = [
  line(50, 0, 50, 9),
  line(25, 9, 75, 9),
  line(25, 9, 25, 20),
  line(75, 9, 75, 20),
  polyline([[23, 18], [25, 22], [27, 18]]),
  polyline([[73, 18], [75, 22], [77, 18]]),
];

const VERTICAL_ARROW_PATHS: readonly DiagramPath[] = [
  line(4, 0, 4, 6),
  polyline([[2, 5], [4, 8], [6, 5]]),
];

function Node({
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

  const tipId = `integ-tip-${name.replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;

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
    <span className="group relative inline-flex">
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

function PluginToApiConnector({
  primary,
  secondary,
}: {
  primary: string;
  secondary: string;
}) {
  return (
    <div
      className="flex w-full flex-col items-center"
      data-testid="proxbox-api-connector-plugin-funnel"
    >
      <ThreeLineCanvas
        viewBox={[100, 20]}
        paths={PLUGIN_TO_API_CONNECTOR_PATHS}
        className="h-6 w-full text-muted"
        preserveDrawingBuffer
      />
      <span className="my-0.5 text-[10px] uppercase tracking-wider text-muted/90">
        {primary}
      </span>
      <span className="-mt-0.5 mb-0.5 text-[10px] tracking-wider text-muted/70">
        {secondary}
      </span>
      <ThreeLineCanvas
        viewBox={[8, 8]}
        paths={VERTICAL_ARROW_PATHS}
        className="h-3 w-3 text-muted"
        preserveDrawingBuffer
      />
    </div>
  );
}

function VerticalEdge({
  primary,
  secondary,
}: {
  primary?: string;
  secondary?: string;
}) {
  return (
    <span className="flex flex-col items-center text-muted leading-none">
      <span aria-hidden>│</span>
      {primary ? (
        <span className="my-0.5 text-[10px] uppercase tracking-wider text-muted/90">
          {primary}
        </span>
      ) : null}
      {secondary ? (
        <span className="-mt-0.5 mb-0.5 text-[10px] tracking-wider text-muted/70">
          {secondary}
        </span>
      ) : null}
      <span aria-hidden>▼</span>
    </span>
  );
}

function ForkConnector({
  leftLabel,
  leftBullets,
  rightLabel,
  rightBullets,
}: {
  leftLabel: string;
  leftBullets: readonly string[];
  rightLabel: string;
  rightBullets: readonly string[];
}) {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center">
      <ThreeLineCanvas
        viewBox={[100, 24]}
        paths={FORK_CONNECTOR_PATHS}
        className="h-7 w-full text-muted"
        preserveDrawingBuffer
      />
      <div className="grid w-full grid-cols-2 gap-x-4 sm:gap-x-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted/90">
            {leftLabel}
          </span>
          {leftBullets.map((b) => (
            <span
              key={b}
              className="text-[10px] tracking-wider text-muted/70"
            >
              {b}
            </span>
          ))}
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted/90">
            {rightLabel}
          </span>
          {rightBullets.map((b) => (
            <span
              key={b}
              className="text-[10px] tracking-wider text-muted/70"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function IntegrationsArchitecture() {
  const { t } = useLanguage();
  const a = t.project.proxboxApi.architecture;

  return (
    <div
      className="overflow-x-auto border border-border bg-surface p-4 sm:p-6"
      data-testid="proxbox-api-integrations-architecture"
    >
      <p className="mb-4 text-xs text-muted">
        {a.heading}{" "}
        <span className="text-muted/70">— {a.caption}</span>
      </p>

      <div className="flex min-w-[88rem] flex-col items-center gap-1">
        <div
          className="grid w-full grid-cols-5 gap-2 justify-items-center"
          data-testid="proxbox-api-plugin-row"
        >
          <Node
            name="netbox-ceph"
            meta="plugin"
            description={a.nodes.netboxCeph}
            href="/netbox-ceph"
            highlight
          />
          <Node
            name="netbox-pbs"
            meta="plugin"
            description={a.nodes.netboxPbs}
            href="/netbox-pbs"
            highlight
          />
          <Node
            name="netbox-proxbox"
            meta="base plugin"
            description={a.nodes.netboxProxbox}
            href="/netbox-proxbox"
            featured
          />
          <Node
            name="netbox-pdm"
            meta="plugin"
            description={a.nodes.netboxPdm}
            href="/netbox-pdm"
            highlight
          />
          <Node
            name="netbox-packer"
            meta="plugin"
            description={a.nodes.netboxPacker}
            href="/netbox-packer"
            highlight
          />
        </div>
        <PluginToApiConnector
          primary={a.edges.pluginToApiTransport}
          secondary={a.edges.pluginToApiAuth}
        />
        <Node
          name="proxbox-api"
          meta=":8000 · FastAPI"
          description={a.nodes.proxboxApi}
          highlight
        />

        <ForkConnector
          leftLabel={a.edges.apiToNetboxLabel}
          leftBullets={a.edges.apiToNetboxBullets}
          rightLabel={a.edges.apiToProxmoxLabel}
          rightBullets={a.edges.apiToProxmoxBullets}
        />

        <div className="grid w-full max-w-2xl grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-0">
          <div className="flex flex-col items-center gap-1">
            <Node
              name="netbox-sdk"
              meta="0.0.7.post6"
              description={a.nodes.netboxSdk}
              href="/netbox-sdk"
              highlight
            />
            <VerticalEdge primary={a.edges.sdkToRest} />
            <Node
              name="netbox · REST API"
              meta="4.5.x / 4.6.x"
              description={a.nodes.netboxRest}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Node
              name="proxmox-sdk"
              meta="0.0.3.post1"
              description={a.nodes.proxmoxSdk}
              href="/proxmox-sdk"
              highlight
            />
            <VerticalEdge primary={a.edges.sdkToRest} />
            <Node
              name="proxmox · REST API"
              meta="7.x / 8.x"
              description={a.nodes.proxmoxRest}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

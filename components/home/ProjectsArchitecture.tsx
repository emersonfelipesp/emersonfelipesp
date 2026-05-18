"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ProxmoxLogo } from "./ProxmoxLogo";

type NodeProps = {
  name: string;
  description: string;
  href?: string;
  highlight?: boolean;
  featured?: boolean;
  logo?: "netbox" | "proxmox";
  trailing?: string;
};

function BrandLogo({ kind }: { kind: "netbox" | "proxmox" }) {
  if (kind === "netbox") {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/netbox-dark-teal.svg"
          alt="NetBox"
          width={86}
          height={24}
          className="block h-6 w-auto dark:hidden"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/netbox-bright-teal.svg"
          alt="NetBox"
          width={86}
          height={24}
          className="hidden h-6 w-auto dark:block"
        />
      </>
    );
  }
  return <ProxmoxLogo className="h-4 w-auto text-fg/90" />;
}

function Node({ name, description, href, highlight = false, featured = false, logo, trailing }: NodeProps) {
  const baseClasses =
    "border text-sm transition-all duration-150 outline-none whitespace-nowrap inline-flex items-center justify-center";
  const sizeClasses = logo
    ? trailing
      ? "h-9 px-2 py-1.5"
      : "h-9 w-28 p-1.5"
    : "px-3 py-1.5";
  const stateClasses = featured
    ? "bg-accent/10 border-accent text-accent hover:bg-accent/20 hover:border-accent focus-visible:bg-accent/20 focus-visible:border-accent"
    : highlight
    ? "bg-surface border-accent/70 text-accent hover:bg-surface-2 hover:border-accent focus-visible:bg-surface-2 focus-visible:border-accent"
    : "bg-surface border-border text-fg/90 hover:border-accent hover:text-accent hover:bg-surface-2 focus-visible:border-accent focus-visible:text-accent";

  const tipId = `tip-${name.replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;

  const inner = logo ? (
    <span className="inline-flex items-center gap-1 leading-none">
      <BrandLogo kind={logo} />
      {trailing ? <span>{trailing}</span> : null}
    </span>
  ) : (
    <span>{name}</span>
  );

  return (
    <span className="group relative inline-flex">
      {href ? (
        <a
          href={href}
          className={`${baseClasses} ${sizeClasses} ${stateClasses} cursor-pointer`}
          aria-describedby={tipId}
          aria-label={name}
        >
          {inner}
        </a>
      ) : (
        <button
          type="button"
          className={`${baseClasses} ${sizeClasses} ${stateClasses} cursor-help`}
          aria-describedby={tipId}
          aria-label={name}
        >
          {inner}
        </button>
      )}

      <span
        id={tipId}
        role="tooltip"
        className="pointer-events-none fixed top-4 right-4 left-4 z-50 border border-accent/60 bg-surface-2 px-3 py-2 text-left text-xs leading-relaxed text-fg/90 opacity-0 shadow-[0_0_0_1px_var(--border)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 sm:absolute sm:top-auto sm:right-auto sm:bottom-full sm:left-1/2 sm:z-20 sm:mb-2 sm:w-64 sm:-translate-x-1/2"
      >
        <span className="block text-accent">{name}</span>
        <span className="mt-1 block whitespace-normal">{description}</span>
      </span>
    </span>
  );
}

function VerticalEdge({ label }: { label?: string }) {
  return (
    <span className="flex flex-col items-center text-muted leading-none">
      <span aria-hidden>│</span>
      {label ? (
        <span className="my-0.5 text-[10px] uppercase tracking-wider text-muted/80">
          {label}
        </span>
      ) : null}
      <span aria-hidden>▼</span>
    </span>
  );
}

/** Fan-out from one source (center) to 5 targets at 10/30/50/70/90 */
function ForkConnector5({ label }: { label?: string }) {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center">
      {label && (
        <span className="mb-0.5 text-[10px] uppercase tracking-wider text-muted/80">
          {label}
        </span>
      )}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        className="h-7 w-full text-muted"
      >
        <g stroke="currentColor" strokeWidth="0.6" fill="none">
          <line x1="50" y1="0" x2="50" y2="9" />
          <line x1="10" y1="9" x2="90" y2="9" />
          <line x1="10" y1="9" x2="10" y2="20" />
          <line x1="30" y1="9" x2="30" y2="20" />
          <line x1="50" y1="9" x2="50" y2="20" />
          <line x1="70" y1="9" x2="70" y2="20" />
          <line x1="90" y1="9" x2="90" y2="20" />
          <polyline points="8,18 10,22 12,18" />
          <polyline points="28,18 30,22 32,18" />
          <polyline points="48,18 50,22 52,18" />
          <polyline points="68,18 70,22 72,18" />
          <polyline points="88,18 90,22 92,18" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Dashed horizontal connector showing the 4 outer plugins (10/30/70/90)
 * depend on netbox-proxbox (50, center) as their base. Arrowheads converge inward at x=50.
 */
function ExtendsConnector({ label }: { label: string }) {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-0.5">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 14"
        preserveAspectRatio="none"
        className="h-4 w-full text-muted/50"
      >
        <g stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2 1.5">
          <line x1="10" y1="0" x2="10" y2="7" />
          <line x1="30" y1="0" x2="30" y2="7" />
          <line x1="70" y1="0" x2="70" y2="7" />
          <line x1="90" y1="0" x2="90" y2="7" />
          <line x1="10" y1="7" x2="90" y2="7" />
          {/* arrowheads converging inward toward netbox-proxbox at x=50 */}
          <polyline points="47,5 50,7 47,9" />
          <polyline points="53,5 50,7 53,9" />
        </g>
      </svg>
      <span className="text-[10px] uppercase tracking-wider text-muted/40">{label}</span>
    </div>
  );
}

/** Fan-in from 5 sources at 10/30/50/70/90 to one target (center) */
function FunnelConnector5({ label }: { label?: string }) {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        className="h-7 w-full text-muted"
      >
        <g stroke="currentColor" strokeWidth="0.6" fill="none">
          <line x1="10" y1="0" x2="10" y2="9" />
          <line x1="30" y1="0" x2="30" y2="9" />
          <line x1="50" y1="0" x2="50" y2="9" />
          <line x1="70" y1="0" x2="70" y2="9" />
          <line x1="90" y1="0" x2="90" y2="9" />
          <line x1="10" y1="9" x2="90" y2="9" />
          <line x1="50" y1="9" x2="50" y2="20" />
          <polyline points="48,18 50,22 52,18" />
        </g>
      </svg>
      {label && (
        <span className="mt-0.5 text-[10px] uppercase tracking-wider text-muted/80">
          {label}
        </span>
      )}
    </div>
  );
}

/** Fork from one source (center) to 2 targets at 25/75 */
function ForkConnector2() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        className="h-7 w-full text-muted"
      >
        <g stroke="currentColor" strokeWidth="0.6" fill="none">
          <line x1="50" y1="0" x2="50" y2="9" />
          <line x1="25" y1="9" x2="75" y2="9" />
          <line x1="25" y1="9" x2="25" y2="20" />
          <line x1="75" y1="9" x2="75" y2="20" />
          <polyline points="23,18 25,22 27,18" />
          <polyline points="73,18 75,22 77,18" />
        </g>
      </svg>
    </div>
  );
}

/** Centered 3-way fork from x=50 to targets at 17/50/83. */
function ForkConnector3() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        className="h-7 w-full text-muted"
      >
        <g stroke="currentColor" strokeWidth="0.6" fill="none">
          <line x1="50" y1="0" x2="50" y2="9" />
          <line x1="17" y1="9" x2="83" y2="9" />
          <line x1="17" y1="9" x2="17" y2="20" />
          <line x1="50" y1="9" x2="50" y2="20" />
          <line x1="83" y1="9" x2="83" y2="20" />
          <polyline points="15,18 17,22 19,18" />
          <polyline points="48,18 50,22 52,18" />
          <polyline points="81,18 83,22 85,18" />
        </g>
      </svg>
    </div>
  );
}

export function ProjectsArchitecture() {
  const { t } = useLanguage();
  const a = t.home.architecture;

  return (
    <div className="border border-border bg-surface p-4 sm:p-6">
      <p className="mb-4 text-xs text-muted">
        {a.heading}{" "}
        <span className="text-muted/70">— {a.caption}</span>
      </p>

      <div className="flex flex-col items-center gap-1">
        {/* Row 1: NetBox */}
        <Node name="netbox" description={a.nodes.netbox} highlight logo="netbox" />

        {/* Fan-out from netbox to all 5 plugins */}
        <ForkConnector5 label={a.edges.plugin} />

        {/* Row 2: 5 NetBox plugins — netbox-proxbox centered as the primary base */}
        <div className="grid w-full max-w-2xl grid-cols-5 gap-2 justify-items-center">
          <Node name="netbox-ceph"    description={a.nodes.netboxCeph}    highlight />
          <Node name="netbox-pbs"     description={a.nodes.netboxPbs}     highlight />
          <Node name="netbox-proxbox" description={a.nodes.netboxProxbox} href="/netbox-proxbox" featured />
          <Node name="netbox-pdm"     description={a.nodes.netboxPdm}     highlight />
          <Node name="netbox-packer"  description={a.nodes.netboxPacker}  highlight />
        </div>

        {/* Dashed connector showing netbox-ceph/pbs/pdm/packer extend netbox-proxbox */}
        <ExtendsConnector label={a.edges.base} />

        {/* Fan-in from all 5 plugins to proxbox-api */}
        <FunnelConnector5 label={a.edges.httpSseWs} />

        {/* Row 3: proxbox-api */}
        <Node name="proxbox-api" description={a.nodes.proxboxApi} highlight />

        {/* Fork to netbox-sdk (left) and proxmox-sdk (right) */}
        <ForkConnector2 />

        {/* Row 4: netbox-sdk (left) | proxmox-sdk → Proxmox VE → service APIs (right) */}
        <div className="grid w-full max-w-2xl grid-cols-2 gap-x-4 items-start sm:gap-x-6">
          <div className="flex flex-col items-center gap-1">
            <Node
              name="netbox-sdk"
              description={a.nodes.netboxSdk}
              href="/netbox-sdk"
              highlight
            />
            <VerticalEdge label={a.edges.rest} />
            <Node
              name="netbox · REST API"
              description={a.nodes.netboxRest}
              logo="netbox"
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Node
              name="proxmox-sdk"
              description={a.nodes.proxmoxSdk}
              href="/proxmox-sdk"
              highlight
            />
            <VerticalEdge />
            <Node name="Proxmox VE" description={a.nodes.proxmoxVe} logo="proxmox" />
            <ForkConnector3 />
            <div className="grid w-full grid-cols-3 gap-2 justify-items-center">
              <Node name="proxmox · ceph" description={a.nodes.proxmoxCeph} logo="proxmox" trailing="· ceph" />
              <Node name="proxmox · PBS"  description={a.nodes.proxmoxPbs}  logo="proxmox" trailing="· PBS" />
              <Node name="proxmox · PDM"  description={a.nodes.proxmoxPdm}  logo="proxmox" trailing="· PDM" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

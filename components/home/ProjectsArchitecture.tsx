"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ProxmoxLogo } from "./ProxmoxLogo";

type NodeProps = {
  name: string;
  description: string;
  href?: string;
  highlight?: boolean;
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

function Node({ name, description, href, highlight = false, logo, trailing }: NodeProps) {
  const baseClasses =
    "border bg-surface text-sm transition-all duration-150 outline-none whitespace-nowrap inline-flex items-center justify-center";
  const sizeClasses = logo ? "h-9 w-28 p-1.5" : "px-3 py-1.5";
  const stateClasses = highlight
    ? "border-accent/70 text-accent hover:bg-surface-2 hover:border-accent focus-visible:bg-surface-2 focus-visible:border-accent"
    : "border-border text-fg/90 hover:border-accent hover:text-accent hover:bg-surface-2 focus-visible:border-accent focus-visible:text-accent";

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
        <Node name="netbox" description={a.nodes.netbox} highlight logo="netbox" />
        <VerticalEdge label={a.edges.plugin} />

        <div className="flex flex-wrap justify-center gap-2 w-full max-w-2xl">
          <Node
            name="netbox-proxbox"
            description={a.nodes.netboxProxbox}
            href="/netbox-proxbox"
            highlight
          />
          <Node name="netbox-ceph"   description={a.nodes.netboxCeph}   highlight />
          <Node name="netbox-pbs"    description={a.nodes.netboxPbs}    highlight />
          <Node name="netbox-pdm"    description={a.nodes.netboxPdm}    highlight />
          <Node name="netbox-packer" description={a.nodes.netboxPacker} highlight />
        </div>

        <VerticalEdge label={a.edges.httpSseWs} />
        <Node name="proxbox-api" description={a.nodes.proxboxApi} highlight />

        <ForkConnector3 />

        <div className="grid w-full max-w-2xl grid-cols-3 gap-x-4 items-start sm:gap-x-6">
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
            <VerticalEdge label={a.edges.rest} />
            <Node
              name="proxmox · REST API"
              description={a.nodes.proxmoxRest}
              logo="proxmox"
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Node name="proxmox · ceph" description={a.nodes.proxmoxCeph} />
            <VerticalEdge />
            <Node name="proxmox · PBS"  description={a.nodes.proxmoxPbs} />
            <VerticalEdge />
            <Node name="proxmox · PDM"  description={a.nodes.proxmoxPdm} />
            <VerticalEdge />
            <Node name="packer"         description={a.nodes.hashicorpPacker} />
          </div>
        </div>
      </div>
    </div>
  );
}

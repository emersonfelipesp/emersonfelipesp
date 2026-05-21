"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  ARCHITECTURE_CONNECTORS,
  createArchitectureDiagram,
  type ArchitectureNode,
} from "@/lib/architecture-diagram";
import Image from "next/image";
import { ThreeLineCanvas } from "@/components/diagram/ThreeLineCanvas";
import { useLayoutEffect, useRef } from "react";
import { ProxmoxLogo } from "./ProxmoxLogo";

type NodeProps = {
  node: ArchitectureNode;
};

function BrandLogo({ kind }: { kind: "netbox" | "proxmox" }) {
  if (kind === "netbox") {
    return (
      <>
        <Image
          src="/logos/netbox-dark-teal.svg"
          alt="NetBox"
          width={86}
          height={24}
          className="block h-6 w-auto dark:hidden"
        />
        <Image
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

function Node({ node }: NodeProps) {
  const { description, href, label, logo, trailing, variant } = node;
  const baseClasses =
    "relative border text-sm transition-colors duration-150 outline-none whitespace-nowrap inline-flex items-center justify-center before:absolute before:-inset-1.5 before:content-['']";
  const sizeClasses = logo
    ? trailing
      ? "h-9 px-2 py-1.5"
      : "h-9 w-28 p-1.5"
    : "px-3 py-1.5";
  const stateClasses = variant === "featured"
    ? "bg-accent/10 border-accent text-accent hover:bg-accent/20 hover:border-accent focus-visible:bg-accent/20 focus-visible:border-accent"
    : variant === "highlight"
    ? "bg-surface border-accent/70 text-accent hover:bg-surface-2 hover:border-accent focus-visible:bg-surface-2 focus-visible:border-accent"
    : "bg-surface border-border text-fg/90 hover:border-accent hover:text-accent hover:bg-surface-2 focus-visible:border-accent focus-visible:text-accent";

  const tipId = `tip-${node.id}`;

  const inner = logo ? (
    <span className="inline-flex items-center gap-1 leading-none">
      <BrandLogo kind={logo} />
      {trailing ? <span>{trailing}</span> : null}
    </span>
  ) : (
    <span>{label}</span>
  );

  return (
    <span className="group relative inline-flex">
      {href ? (
        <a
          href={href}
          className={`${baseClasses} ${sizeClasses} ${stateClasses} cursor-pointer`}
          aria-describedby={tipId}
          aria-label={label}
        >
          {inner}
        </a>
      ) : (
        <button
          type="button"
          className={`${baseClasses} ${sizeClasses} ${stateClasses} cursor-help`}
          aria-describedby={tipId}
          aria-label={label}
        >
          {inner}
        </button>
      )}

      <span
        id={tipId}
        role="tooltip"
        className="pointer-events-none fixed top-4 right-4 left-4 z-50 border border-accent/60 bg-surface-2 px-3 py-2 text-left text-xs leading-relaxed text-fg/90 opacity-0 shadow-[0_0_0_1px_var(--border)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 sm:absolute sm:top-auto sm:right-auto sm:bottom-full sm:left-1/2 sm:z-20 sm:mb-2 sm:w-64 sm:-translate-x-1/2"
      >
        <span className="block text-accent">{label}</span>
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
      <ThreeLineCanvas
        viewBox={[100, 24]}
        paths={ARCHITECTURE_CONNECTORS.pluginFork5}
        className="h-7 w-full text-muted"
        testId="projects-architecture-connector-plugin-fork"
      />
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
      <ThreeLineCanvas
        viewBox={[100, 14]}
        paths={ARCHITECTURE_CONNECTORS.baseExtends}
        className="h-4 w-full text-muted"
        testId="projects-architecture-connector-base-extends"
      />
      <span className="text-[10px] uppercase tracking-wider text-muted/40">{label}</span>
    </div>
  );
}

/** Fan-in from 5 sources at 10/30/50/70/90 to one target (center) */
function FunnelConnector5({ label }: { label?: string }) {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center">
      <ThreeLineCanvas
        viewBox={[100, 24]}
        paths={ARCHITECTURE_CONNECTORS.apiFunnel5}
        className="h-7 w-full text-muted"
        testId="projects-architecture-connector-api-funnel"
      />
      {label && (
        <span className="mt-0.5 text-[10px] uppercase tracking-wider text-muted/80">
          {label}
        </span>
      )}
    </div>
  );
}

/** Fork from one source (center) to the real centers of a 2-column row with gap-x-4/sm:gap-x-6. */
function ForkConnector2() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center">
      <ThreeLineCanvas
        viewBox={[100, 24]}
        paths={ARCHITECTURE_CONNECTORS.sdkFork2}
        className="h-7 w-full text-muted"
        testId="projects-architecture-connector-sdk-fork"
      />
    </div>
  );
}

/**
 * Connector from the Proxmox VE column into the real centers of the 3-column
 * service API row. The join stays on the source column instead of stepping
 * through the diagram center, so the lower branch reads as one continuous fork.
 */
function ForkConnector3FromRight() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center">
      <ThreeLineCanvas
        viewBox={[100, 24]}
        paths={ARCHITECTURE_CONNECTORS.proxmoxServicesFork3}
        className="h-7 w-full text-muted"
        testId="projects-architecture-connector-proxmox-services"
      />
    </div>
  );
}

export function ProjectsArchitecture() {
  const { t } = useLanguage();
  const diagram = createArchitectureDiagram(t.home.architecture);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const userScrolledRef = useRef(false);

  useLayoutEffect(() => {
    const scrollerEl = scrollerRef.current;
    if (!scrollerEl) return;

    let frame: number | null = null;

    function centerScroller() {
      frame = null;
      const scroller = scrollerRef.current;
      if (
        !scroller ||
        userScrolledRef.current ||
        scroller.scrollWidth <= scroller.clientWidth
      ) {
        return;
      }

      scroller.scrollLeft = Math.max(
        0,
        (scroller.scrollWidth - scroller.clientWidth) / 2,
      );
    }

    function scheduleCenter() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(centerScroller);
    }

    scheduleCenter();
    const resizeObserver = new ResizeObserver(scheduleCenter);
    resizeObserver.observe(scrollerEl);
    if (scrollerEl.firstElementChild) {
      resizeObserver.observe(scrollerEl.firstElementChild);
    }
    window.addEventListener("orientationchange", scheduleCenter);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("orientationchange", scheduleCenter);
    };
  }, []);

  function markScrollerInteracted() {
    userScrolledRef.current = true;
  }

  return (
    <div
      ref={scrollerRef}
      data-testid="projects-architecture"
      role="group"
      aria-label={diagram.heading}
      className="overflow-x-auto border border-border bg-surface p-4 sm:p-6"
      onKeyDown={markScrollerInteracted}
      onPointerDown={markScrollerInteracted}
      onTouchStart={markScrollerInteracted}
      onWheel={markScrollerInteracted}
    >
      <p className="mb-4 text-xs text-muted">
        {diagram.heading}{" "}
        <span className="text-muted/70">· {diagram.caption}</span>
      </p>

      <div className="flex min-w-[42rem] flex-col items-center gap-1">
        <Node node={diagram.nodes.netbox} />

        <ForkConnector5 label={diagram.edges.plugin} />

        <div className="grid w-full max-w-2xl grid-cols-5 gap-2 justify-items-center">
          {diagram.pluginNodes.map((plugin) => (
            <Node key={plugin.id} node={plugin} />
          ))}
        </div>

        <ExtendsConnector label={diagram.edges.base} />

        <FunnelConnector5 label={diagram.edges.httpSseWs} />

        <Node node={diagram.nodes.proxboxApi} />

        <ForkConnector2 />

        <div className="grid w-full max-w-2xl grid-cols-2 gap-x-4 items-start sm:gap-x-6">
          <div className="flex flex-col items-center gap-1">
            <Node node={diagram.nodes.netboxSdk} />
            <VerticalEdge label={diagram.edges.rest} />
            <Node node={diagram.nodes.netboxRest} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Node
              node={diagram.nodes.proxmoxSdk}
            />
            <VerticalEdge />
            <Node node={diagram.nodes.proxmoxVe} />
            <VerticalEdge />
          </div>
        </div>

        <ForkConnector3FromRight />
        <div className="grid w-full max-w-2xl grid-cols-3 gap-4 justify-items-center">
          {diagram.serviceApiNodes.map((service) => (
            <Node key={service.id} node={service} />
          ))}
        </div>
      </div>
    </div>
  );
}

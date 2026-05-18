"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import Image from "next/image";
import {
  ThreeLineCanvas,
  type DiagramPath,
  type DiagramPoint,
} from "@/components/diagram/ThreeLineCanvas";
import { useLayoutEffect, useRef } from "react";
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

function line(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  options?: Omit<DiagramPath, "points">,
): DiagramPath {
  return { points: [[x1, y1], [x2, y2]], ...options };
}

function polyline(
  points: readonly DiagramPoint[],
  options?: Omit<DiagramPath, "points">,
): DiagramPath {
  return { points, ...options };
}

const FORK_CONNECTOR_5_PATHS: readonly DiagramPath[] = [
  line(50, 0, 50, 9),
  line(10, 9, 90, 9),
  line(10, 9, 10, 20),
  line(30, 9, 30, 20),
  line(50, 9, 50, 20),
  line(70, 9, 70, 20),
  line(90, 9, 90, 20),
  polyline([[8, 18], [10, 22], [12, 18]]),
  polyline([[28, 18], [30, 22], [32, 18]]),
  polyline([[48, 18], [50, 22], [52, 18]]),
  polyline([[68, 18], [70, 22], [72, 18]]),
  polyline([[88, 18], [90, 22], [92, 18]]),
];

const EXTENDS_CONNECTOR_PATHS: readonly DiagramPath[] = [
  line(10, 0, 10, 7, { dashed: true, opacity: 0.5 }),
  line(30, 0, 30, 7, { dashed: true, opacity: 0.5 }),
  line(70, 0, 70, 7, { dashed: true, opacity: 0.5 }),
  line(90, 0, 90, 7, { dashed: true, opacity: 0.5 }),
  line(10, 7, 90, 7, { dashed: true, opacity: 0.5 }),
  polyline([[47, 5], [50, 7], [47, 9]], { dashed: true, opacity: 0.5 }),
  polyline([[53, 5], [50, 7], [53, 9]], { dashed: true, opacity: 0.5 }),
];

const FUNNEL_CONNECTOR_5_PATHS: readonly DiagramPath[] = [
  line(10, 0, 10, 9),
  line(30, 0, 30, 9),
  line(50, 0, 50, 9),
  line(70, 0, 70, 9),
  line(90, 0, 90, 9),
  line(10, 9, 90, 9),
  line(50, 9, 50, 20),
  polyline([[48, 18], [50, 22], [52, 18]]),
];

const FORK_CONNECTOR_2_PATHS: readonly DiagramPath[] = [
  line(50, 0, 50, 9),
  line(24, 9, 76, 9),
  line(24, 9, 24, 20),
  line(76, 9, 76, 20),
  polyline([[22, 18], [24, 22], [26, 18]]),
  polyline([[74, 18], [76, 22], [78, 18]]),
];

const FORK_CONNECTOR_3_PATHS: readonly DiagramPath[] = [
  line(50, 0, 50, 9),
  line(17, 9, 83, 9),
  line(17, 9, 17, 20),
  line(50, 9, 50, 20),
  line(83, 9, 83, 20),
  polyline([[15, 18], [17, 22], [19, 18]]),
  polyline([[48, 18], [50, 22], [52, 18]]),
  polyline([[81, 18], [83, 22], [85, 18]]),
];

const FORK_CONNECTOR_3_FROM_RIGHT_PATHS: readonly DiagramPath[] = [
  line(76, 0, 76, 9),
  line(16, 9, 84, 9),
  line(16, 9, 16, 20),
  line(50, 9, 50, 20),
  line(84, 9, 84, 20),
  polyline([[14, 18], [16, 22], [18, 18]]),
  polyline([[48, 18], [50, 22], [52, 18]]),
  polyline([[82, 18], [84, 22], [86, 18]]),
];

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

function Node({ name, description, href, highlight = false, featured = false, logo, trailing }: NodeProps) {
  const baseClasses =
    "relative border text-sm transition-colors duration-150 outline-none whitespace-nowrap inline-flex items-center justify-center before:absolute before:-inset-1.5 before:content-['']";
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
      <ThreeLineCanvas
        viewBox={[100, 24]}
        paths={FORK_CONNECTOR_5_PATHS}
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
        paths={EXTENDS_CONNECTOR_PATHS}
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
        paths={FUNNEL_CONNECTOR_5_PATHS}
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
        paths={FORK_CONNECTOR_2_PATHS}
        className="h-7 w-full text-muted"
        testId="projects-architecture-connector-sdk-fork"
      />
    </div>
  );
}

/** Centered 3-way fork from x=50 to targets at 17/50/83. */
function ForkConnector3() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center">
      <ThreeLineCanvas
        viewBox={[100, 24]}
        paths={FORK_CONNECTOR_3_PATHS}
        className="h-7 w-full text-muted"
        testId="projects-architecture-connector-service-fork"
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
        paths={FORK_CONNECTOR_3_FROM_RIGHT_PATHS}
        className="h-7 w-full text-muted"
        testId="projects-architecture-connector-proxmox-services"
      />
    </div>
  );
}

export function ProjectsArchitecture() {
  const { t } = useLanguage();
  const a = t.home.architecture;
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
      aria-label={a.heading}
      className="overflow-x-auto border border-border bg-surface p-4 sm:p-6"
      onKeyDown={markScrollerInteracted}
      onPointerDown={markScrollerInteracted}
      onTouchStart={markScrollerInteracted}
      onWheel={markScrollerInteracted}
    >
      <p className="mb-4 text-xs text-muted">
        {a.heading}{" "}
        <span className="text-muted/70">· {a.caption}</span>
      </p>

      <div className="flex min-w-[42rem] flex-col items-center gap-1">
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
            <VerticalEdge />
          </div>
        </div>

        <ForkConnector3FromRight />
        <div className="grid w-full max-w-2xl grid-cols-3 gap-4 justify-items-center">
          <Node name="proxmox · ceph" description={a.nodes.proxmoxCeph} logo="proxmox" trailing="· ceph" />
          <Node name="proxmox · PBS"  description={a.nodes.proxmoxPbs}  logo="proxmox" trailing="· PBS" />
          <Node name="proxmox · PDM"  description={a.nodes.proxmoxPdm}  logo="proxmox" trailing="· PDM" />
        </div>
      </div>
    </div>
  );
}

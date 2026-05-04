type Props = {
  src: string;
  alt: string;
  caption: string;
  onZoom: () => void;
};

export function Screenshot({ src, alt, caption, onZoom }: Props) {
  const filename = src.split("/").pop();

  return (
    <details className="group px-3 py-2 open:bg-surface-2">
      <summary className="flex cursor-pointer list-none items-baseline gap-2 text-sm text-fg/90 hover:text-accent">
        <span className="text-accent group-open:hidden">›</span>
        <span className="hidden text-accent group-open:inline">▾</span>
        <span className="flex-1">{caption}</span>
      </summary>

      <div className="screenshot-body mt-3 border border-border bg-surface-2">
        <div className="flex items-center justify-between border-b border-border px-2 py-1 text-xs text-muted">
          <div className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-danger/70" />
            <span className="inline-block h-2 w-2 rounded-full bg-warn/70" />
            <span className="inline-block h-2 w-2 rounded-full bg-success/70" />
          </div>
          <span className="truncate">{filename}</span>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          <button
            type="button"
            onClick={onZoom}
            className="block w-full cursor-zoom-in"
            aria-label={`Open ${caption} fullscreen`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              loading="lazy"
              width={1920}
              height={1080}
              className="block h-auto w-full"
            />
          </button>
        </div>
      </div>
    </details>
  );
}

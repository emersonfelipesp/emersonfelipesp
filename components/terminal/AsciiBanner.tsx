type Props = {
  art: string;
  caption?: string;
  className?: string;
};

export function AsciiBanner({ art, caption, className = "" }: Props) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <pre className="whitespace-pre text-[10px] leading-tight text-accent sm:text-xs">
        {art}
      </pre>
      {caption ? (
        <p className="mt-2 text-xs text-muted">{caption}</p>
      ) : null}
    </div>
  );
}

import { CodeSnippet } from "./CodeSnippet";

export type Step = {
  title: string;
  body?: string | readonly string[];
  code?: string;
  codeLabel?: string;
};

type Props = {
  title?: string;
  steps: readonly Step[];
};

export function StepList({ title, steps }: Props) {
  return (
    <div className="space-y-3">
      {title ? (
        <p className="text-xs text-muted">
          <span className="text-accent">$</span> {title}
        </p>
      ) : null}
      <ol className="space-y-3">
        {steps.map((step, i) => {
          const paragraphs =
            step.body === undefined
              ? []
              : Array.isArray(step.body)
                ? (step.body as readonly string[])
                : [step.body as string];
          return (
            <li
              key={i}
              className="border border-border bg-surface p-4 text-sm"
            >
              <p className="mb-2">
                <span className="text-accent">{String(i + 1).padStart(2, "0")}.</span>{" "}
                <span className="text-fg">{step.title}</span>
              </p>
              {paragraphs.length > 0 ? (
                <div className="mb-3 space-y-2 text-fg/90">
                  {paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              ) : null}
              {step.code ? (
                <CodeSnippet code={step.code} label={step.codeLabel ?? "shell"} />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

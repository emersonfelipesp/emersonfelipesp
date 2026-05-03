"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError(null);
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setStatus("sent");
      form.reset();
    } else {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "send failed");
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border border-border bg-surface p-5 text-sm"
    >
      <p className="mb-3 text-xs text-muted">$ cat &gt; /var/mail/emerson</p>
      <div className="space-y-2">
        <Field name="name" label="from" placeholder="your name" />
        <Field
          name="email"
          label="reply-to"
          type="email"
          placeholder="you@example.com"
        />
        <label className="block">
          <span className="text-muted">message:</span>
          <textarea
            name="message"
            required
            rows={5}
            className="mt-1 block w-full border border-border bg-bg p-2 text-fg focus:border-accent focus:outline-none"
            placeholder="ping..."
          />
        </label>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="border border-accent bg-accent/10 px-3 py-1 text-xs text-accent transition-colors duration-150 hover:bg-accent/20 disabled:opacity-50"
        >
          {status === "sending" ? "sending..." : "$ send"}
        </button>
        {status === "sent" ? (
          <span style={{ animation: "fade-in 200ms ease-out" }} className="text-xs text-success">✓ message stored locally</span>
        ) : null}
        {status === "error" ? (
          <span style={{ animation: "fade-in 200ms ease-out" }} className="text-xs text-danger">✗ {error}</span>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-muted">{label}:</span>
      <input
        type={type}
        name={name}
        required
        placeholder={placeholder}
        className="mt-1 block w-full border border-border bg-bg p-2 text-fg focus:border-accent focus:outline-none"
      />
    </label>
  );
}

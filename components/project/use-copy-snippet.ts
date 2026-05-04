"use client";

import { useRef, useState, type MouseEvent } from "react";

export function useCopySnippet(text: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  function flash() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function runCopy() {
    if (writeTextSync(text)) flash();
  }

  function handleClick() {
    const sel = window.getSelection();
    const node = sel?.anchorNode;
    const wrapper = ref.current;
    if (sel && sel.toString() && wrapper && node && wrapper.contains(node)) {
      return;
    }
    runCopy();
  }

  function handleButtonClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    runCopy();
  }

  return { ref, copied, handleClick, handleButtonClick };
}

function writeTextSync(text: string): boolean {
  if (typeof window === "undefined") return false;

  if (window.isSecureContext && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
    return true;
  }

  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "0";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

export function useCopySnippet(text: string) {
  const ref = useRef<HTMLDivElement>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  function flash() {
    setCopied(true);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setCopied(false);
      resetTimerRef.current = null;
    }, 1500);
  }

  async function runCopy() {
    if (await writeText(text)) flash();
  }

  function handleClick() {
    const sel = window.getSelection();
    const node = sel?.anchorNode;
    const wrapper = ref.current;
    if (sel && sel.toString() && wrapper && node && wrapper.contains(node)) {
      return;
    }
    void runCopy();
  }

  function handleButtonClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    void runCopy();
  }

  return { ref, copied, handleClick, handleButtonClick };
}

async function writeText(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
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

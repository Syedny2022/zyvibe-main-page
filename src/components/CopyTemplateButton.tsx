"use client";

import { useState } from "react";
import { writeClipboard } from "@/lib/clipboard";

type Props = {
  text: string;
  label?: string;
  className?: string;
};

export function CopyTemplateButton({ text, label = "Copy Template", className }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const ok = await writeClipboard(text);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      className={className ?? "row-action"}
      onClick={copy}
      aria-live="polite"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

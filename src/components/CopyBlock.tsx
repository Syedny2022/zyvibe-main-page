"use client";

import { useRef, useState } from "react";
import { writeClipboard } from "@/lib/clipboard";

export function CopyBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  async function copy() {
    const ok = await writeClipboard(text);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
      return;
    }
    const node = codeRef.current;
    if (node) {
      const range = document.createRange();
      range.selectNodeContents(node);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  return (
    <div className="copy-block">
      <div className="copy-head">
        <p className="code-label label-caps">{label}</p>
        <button type="button" className="copy-btn mono" onClick={copy} aria-live="polite">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="code-block">
        <code ref={codeRef}>{text}</code>
      </pre>
    </div>
  );
}

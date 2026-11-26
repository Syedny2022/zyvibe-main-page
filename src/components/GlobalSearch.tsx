"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type { SearchEntry } from "@/lib/content";

const GROUP_ORDER: SearchEntry["group"][] = [
  "Use cases",
  "Goals",
  "Agents",
  "Harnesses",
  "Playbooks",
  "Pages",
];

const GROUP_LIMIT: Record<SearchEntry["group"], number> = {
  "Use cases": 5,
  Goals: 6,
  Agents: 6,
  Harnesses: 5,
  Playbooks: 5,
  Pages: 5,
};

export function GlobalSearch({ entries }: { entries: SearchEntry[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
        return;
      }
      if (event.key === "Escape") setOpen(false);
    }
    function onOpenRequest() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("zyvibe:search", onOpenRequest);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("zyvibe:search", onOpenRequest);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);

    function onTab(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const node = dialogRef.current;
      if (!node) return;
      const items = Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onTab);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onTab);
      window.clearTimeout(timer);
      openerRef.current?.focus?.();
    };
  }, [open]);

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matched = needle
      ? entries.filter((entry) =>
          `${entry.label} ${entry.meta} ${entry.group}`.toLowerCase().includes(needle)
        )
      : entries;
    return GROUP_ORDER.map((name) => ({
      name,
      items: matched.filter((entry) => entry.group === name).slice(0, GROUP_LIMIT[name]),
    })).filter((group) => group.items.length > 0);
  }, [entries, query]);

  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onFieldKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (flat.length === 0 ? 0 : (current + 1) % flat.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => (flat.length === 0 ? 0 : (current - 1 + flat.length) % flat.length));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = flat[active];
      if (item) go(item.href);
    }
  }

  return (
    <>
      <button
        type="button"
        className="header-search"
        aria-label="Search the directory"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <svg
          className="header-search-icon"
          viewBox="0 0 16 16"
          width="12"
          height="12"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10.4 10.4 14 14" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <span className="header-search-label">Search</span>
        <kbd className="header-search-kbd mono">⌘K</kbd>
      </button>

      {mounted &&
        open &&
        createPortal(
          <div className="search-modal" onMouseDown={() => setOpen(false)}>
            <div
              ref={dialogRef}
              className="search-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="search-dialog-title"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <h2 id="search-dialog-title" className="sr-only">
                Search the Zyvibe directory
              </h2>

              <div className="search-dialog-bar">
                <span className="mono search-prefix">SEARCH &gt;</span>
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={onFieldKeyDown}
                  placeholder="Use case, goal, agent, or harness..."
                  autoFocus
                  aria-label="Search use cases, goals, agents, and harnesses"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="search-close mono"
                  onClick={() => setOpen(false)}
                >
                  ESC
                </button>
              </div>

              <p className="search-dialog-count mono">
                {query.trim()
                  ? `${flat.length} ${flat.length === 1 ? "RESULT" : "RESULTS"} FOR “${query.trim()}”`
                  : "TYPE TO FILTER · ARROW KEYS TO MOVE · ENTER TO OPEN"}
              </p>

              <div className="search-dialog-results">
                {groups.map((group) => (
                  <div className="search-group" key={group.name}>
                    <p className="search-group-title label-caps">{group.name}</p>
                    {group.items.map((entry) => {
                      const index = flat.indexOf(entry);
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          className="search-result"
                          data-active={index === active}
                          onMouseEnter={() => setActive(index)}
                          onClick={() => go(entry.href)}
                        >
                          <span className="search-result-label">{entry.label}</span>
                          <span className="search-result-meta mono">{entry.meta}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}

                {flat.length === 0 && (
                  <p className="search-empty">
                    No record matches “{query.trim()}”.{" "}
                    <a href="/submit">Submit a use case</a> with a working source link.
                  </p>
                )}
              </div>

              <div className="search-dialog-foot mono">
                <span>⌘K toggle</span>
                <span>↑↓ move</span>
                <span>↵ open</span>
                <span>esc close</span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

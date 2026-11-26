"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ECOSYSTEM } from "@/lib/site";

type NavItem = { label: string; href: string };

/**
 * Mobile navigation drawer. It is an overlay, so it closes itself when the
 * route changes (otherwise it would cover the page the visitor just opened)
 * and on Escape.
 */
export function MobileMenu({
  primary,
  secondary,
}: {
  primary: readonly NavItem[];
  secondary: readonly NavItem[];
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  return (
    <details
      className="mobile-menu"
      ref={ref}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        if (ref.current?.open) {
          event.preventDefault();
          ref.current.open = false;
          ref.current.querySelector("summary")?.focus();
        }
      }}
    >
      <summary aria-label="Open menu">
        <span className="mono">MENU</span>
      </summary>
      <div className="mobile-panel">
        <p className="label-caps">Directory</p>
        {primary.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <p className="label-caps">Ecosystem</p>
        {ECOSYSTEM.map((item) => (
          <a key={item.href} href={item.href} rel="noopener">
            {item.label} · {item.domain}
          </a>
        ))}
        <p className="label-caps">Zyvibe</p>
        {secondary.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  );
}

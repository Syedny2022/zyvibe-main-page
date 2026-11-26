import Link from "next/link";
import { ECOSYSTEM } from "@/lib/site";
import type { SearchEntry } from "@/lib/content";
import { GlobalSearch } from "./GlobalSearch";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

const PRIMARY = [
  { label: "Use Cases", href: "/use-cases" },
  { label: "Goals", href: "/goals" },
  { label: "Agents & Harnesses", href: "/agents" },
  { label: "Solo Builder Playbooks", href: "/playbooks" },
  { label: "Builder Showcase", href: "/showcase" },
];

const SECONDARY = [
  { label: "Methodology", href: "/methodology" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Submit a Use Case", href: "/submit" },
  { label: "Advertise on Zyvibe", href: "/promote" },
];

export function SiteHeader({ searchIndex }: { searchIndex: SearchEntry[] }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Zyvibe home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/zyvibe-wordmark.svg"
            alt="Zyvibe"
            aria-label="Zyvibe"
            width={79}
            height={22}
          />
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {PRIMARY.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-right">
          <GlobalSearch entries={searchIndex} />
          <ThemeToggle />
          <details className="eco-menu">
            <summary>Ecosystem</summary>
            <div className="eco-panel">
              <p className="eco-panel-title label-caps">Zyvibe ecosystem</p>
              {ECOSYSTEM.map((item) => (
                <a key={item.href} href={item.href} rel="noopener">
                  <span className="eco-label">{item.label}</span>
                  <span className="eco-domain mono">{item.domain}</span>
                </a>
              ))}
            </div>
          </details>
          <Link href="/submit" className="header-submit">
            Submit a Use Case
          </Link>
        </div>

        <MobileMenu primary={PRIMARY} secondary={SECONDARY} />
      </div>
    </header>
  );
}

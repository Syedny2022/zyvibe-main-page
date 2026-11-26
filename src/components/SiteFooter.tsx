import Link from "next/link";
import { ECOSYSTEM, SITE } from "@/lib/site";

const EXPLORE = [
  { label: "Use Cases", href: "/use-cases" },
  { label: "Goals", href: "/goals" },
  { label: "Agents & Harnesses", href: "/agents" },
  { label: "Solo Builder Playbooks", href: "/playbooks" },
  { label: "Builder Showcase", href: "/showcase" },
  { label: "Submit a Use Case", href: "/submit" },
];

const TRUST = [
  { label: "Methodology & Evidence Labels", href: "/methodology" },
  { label: "Submission Guidelines", href: "/submit" },
  { label: "Report an Outdated Workflow", href: "/contact" },
  { label: "About Zyvibe", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const LEGAL = [
  { label: "Privacy Notice", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Disclosures", href: "/disclosures" },
];

const COMMERCIAL = [
  { label: "Advertise on Zyvibe", href: "/promote" },
  { label: "View Builder Showcase", href: "/showcase" },
  { label: "Get Zyvibe Digest", href: "/#digest" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-columns">
          <div>
            <p className="footer-col-title label-caps">Explore</p>
            <ul className="footer-col-list">
              {EXPLORE.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-col-title label-caps">Zyvibe Ecosystem</p>
            <ul className="footer-col-list">
              {ECOSYSTEM.map((item) => (
                <li key={item.href}>
                  <a href={item.href} rel="noopener" className="footer-eco-link">
                    <span>{item.label}</span>
                    <span className="footer-domain mono">{`https://${item.domain}`}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-col-title label-caps">Trust</p>
            <ul className="footer-col-list">
              {TRUST.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-col-title label-caps">Legal</p>
            <ul className="footer-col-list">
              {LEGAL.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-col-title label-caps">Commercial</p>
            <ul className="footer-col-list">
              {COMMERCIAL.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <p className="footer-note">
              Paid placements are labeled <strong>Advertisement</strong> beside the item and are
              separate from editorial content.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Zyvibe · {SITE.founder.name} (Clinton, MD / Brooklyn,
            NY)
          </div>
          <div className="footer-bottom-meta">
            Source-checked records · Editorial content is kept separate from labeled commercial
            placements.
          </div>
        </div>
      </div>
    </footer>
  );
}

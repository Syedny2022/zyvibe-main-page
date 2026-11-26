import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE } from "@/lib/site";
import { getSearchIndex } from "@/lib/content";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s | Zyvibe",
  },
  description: SITE.description,
  applicationName: SITE.name,
  icons: {
    icon: [{ url: "/brand/zyvibe-avatar.svg", type: "image/svg+xml" }],
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchIndex = getSearchIndex();
  const tagId = SITE.analytics.googleTagId;
  const linkerDomains = SITE.analytics.crossDomains.map((domain) => `'${domain}'`).join(",");
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${plexMono.variable}`}
    >
      <body>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Zyvibe — AI Agent Use Cases"
          href={`${SITE.url}/feed.xml`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var stored=localStorage.getItem("zyvibe:theme");if(stored==="light"||stored==="dark"){document.documentElement.dataset.theme=stored;}}catch(e){}`,
          }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader searchIndex={searchIndex} />
        <main id="main">{children}</main>
        <SiteFooter />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${tagId}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-config" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${tagId}', { linker: { domains: [${linkerDomains}] } });`}
        </Script>
      </body>
    </html>
  );
}

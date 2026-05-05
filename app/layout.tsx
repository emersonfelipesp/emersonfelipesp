import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/nav/Footer";
import {
  DARK_THEMES,
  DEFAULT_THEME,
  NAMED_THEMES,
  VALID_THEMES,
} from "@/components/theme/theme-definitions";
import {
  DEFAULT_LANG,
  LANGUAGES,
  VALID_LANGS,
} from "@/lib/i18n/languages";

export const metadata: Metadata = {
  title: "emersonfelipesp ~ NetDevOps & Network Automation",
  description:
    "Software developer & network automation engineer. NetBox + Proxmox open source maintainer.",
  metadataBase: new URL("https://emersonfelipesp.com"),
  openGraph: {
    title: "emersonfelipesp ~ NetDevOps",
    description:
      "Software developer & network automation engineer. NetBox + Proxmox open source maintainer.",
    url: "https://emersonfelipesp.com",
    type: "website",
    siteName: "emersonfelipesp.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "emersonfelipesp ~ NetDevOps & Network Automation",
    description:
      "Software developer & network automation engineer. NetBox + Proxmox open source maintainer.",
    creator: "@emersonfelipesp",
  },
  authors: [{ name: "Emerson Felipe", url: "https://emersonfelipesp.com" }],
  category: "technology",
};

const themeBootScript = `
  (function() {
    try {
      var valid = ${JSON.stringify(VALID_THEMES)};
      var dark  = ${JSON.stringify(DARK_THEMES)};
      var named = ${JSON.stringify(NAMED_THEMES)};
      var stored = localStorage.getItem('theme');
      var theme = valid.indexOf(stored) >= 0 ? stored : ${JSON.stringify(DEFAULT_THEME)};
      var root = document.documentElement;
      if (named.indexOf(theme) >= 0) root.setAttribute('data-theme', theme);
      else root.removeAttribute('data-theme');
      root.classList.toggle('dark', dark.indexOf(theme) >= 0);
    } catch (e) {}
  })();
`;

const langBootScript = `
  (function() {
    try {
      var valid = ${JSON.stringify(VALID_LANGS)};
      var htmlLangs = ${JSON.stringify(
        Object.fromEntries(LANGUAGES.map((l) => [l.code, l.htmlLang])),
      )};
      var stored = localStorage.getItem('lang');
      var lang = valid.indexOf(stored) >= 0 ? stored : ${JSON.stringify(DEFAULT_LANG)};
      document.documentElement.lang = htmlLangs[lang];
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning className="dark" data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script dangerouslySetInnerHTML={{ __html: langBootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Emerson Felipe",
              url: "https://emersonfelipesp.com",
              jobTitle: "Software Developer & Network Automation Engineer",
              worksFor: { "@type": "Organization", name: "N-Multifibra" },
              address: { "@type": "PostalAddress", addressLocality: "Cotia", addressRegion: "São Paulo", addressCountry: "BR" },
              sameAs: [
                "https://github.com/emersonfelipesp",
                "https://www.linkedin.com/in/emersonfelipesp/",
              ],
              knowsAbout: [
                "Network Automation", "Python", "NetBox", "Proxmox",
                "BGP", "MPLS", "FastAPI", "Next.js", "TypeScript",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-bg text-fg antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 xl:max-w-6xl xl:px-8">
              <TopNav />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

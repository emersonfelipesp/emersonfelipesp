import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/nav/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { htmlLangFor } from "@/lib/i18n/languages";
import { readLangFromCookies } from "@/lib/i18n/server";
import { createHomeMetadata, siteGraphJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  ...createHomeMetadata(),
  title: {
    default: "Emerson Felipe (emersonfelipesp) - NetDevOps & Network Automation",
    template: "%s | emersonfelipesp",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const lang = await readLangFromCookies();
  return (
    <html lang={htmlLangFor(lang)} suppressHydrationWarning className="dark" data-scroll-behavior="smooth">
      <head>
        <link
          rel="alternate"
          type="text/markdown"
          title="LLMs index"
          href="/llms.txt"
        />
        <link
          rel="alternate"
          type="text/markdown"
          title="Markdown sitemap"
          href="/sitemap.md"
        />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <Script src="/theme-boot.js" strategy="beforeInteractive" />
        <Script src="/lang-boot.js" strategy="beforeInteractive" />
        <JsonLd data={siteGraphJsonLd()} />
      </head>
      <body className="min-h-screen bg-bg text-fg antialiased">
        <ThemeProvider>
          <LanguageProvider initialLang={lang}>
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 xl:max-w-6xl xl:px-8">
              <TopNav />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

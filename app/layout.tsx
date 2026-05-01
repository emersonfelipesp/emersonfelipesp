import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TopNav } from "@/components/nav/TopNav";

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
  },
};

const themeBootScript = `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var mode = stored || (prefersDark ? 'dark' : 'light');
      if (mode === 'dark') document.documentElement.classList.add('dark');
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen bg-bg text-fg antialiased">
        <ThemeProvider>
          <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6">
            <TopNav />
            <main className="flex-1 pt-6">{children}</main>
            <footer className="mt-12 border-t border-border pt-4 text-xs text-muted">
              <span className="text-accent">$</span> echo &quot;built with
              next.js + tailwind + prisma · 100% open source · feedback welcome&quot;
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

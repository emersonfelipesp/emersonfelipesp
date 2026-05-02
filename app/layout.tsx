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

const VALID_THEMES = [
  "default-light",
  "default-dark",
  "netbox-dark",
  "netbox-light",
  "dracula",
  "tokyo-night",
  "onedark-pro",
  "proxmox-dark",
  "proxmox-light",
  "monokai",
];
const DARK_THEMES = [
  "default-dark",
  "netbox-dark",
  "dracula",
  "tokyo-night",
  "onedark-pro",
  "proxmox-dark",
  "monokai",
];
const NAMED_THEMES = [
  "netbox-dark",
  "netbox-light",
  "dracula",
  "tokyo-night",
  "onedark-pro",
  "proxmox-dark",
  "proxmox-light",
  "monokai",
];

const themeBootScript = `
  (function() {
    try {
      var valid = ${JSON.stringify(VALID_THEMES)};
      var dark  = ${JSON.stringify(DARK_THEMES)};
      var named = ${JSON.stringify(NAMED_THEMES)};
      var stored = localStorage.getItem('theme');
      var theme = valid.indexOf(stored) >= 0 ? stored : 'default-dark';
      var root = document.documentElement;
      if (named.indexOf(theme) >= 0) root.setAttribute('data-theme', theme);
      else root.removeAttribute('data-theme');
      root.classList.toggle('dark', dark.indexOf(theme) >= 0);
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

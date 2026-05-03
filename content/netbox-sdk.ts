import type { ProjectContent } from "./types";

export const netboxSdk: ProjectContent = {
  slug: "netbox-sdk",
  name: "netbox-sdk",
  fullName: "emersonfelipesp/netbox-sdk",
  palette: "netbox" as const,
  tagline:
    "Modern NetBox toolkit: an async SDK plus a CLI and a TUI for faster automation.",
  description: [
    "netbox-sdk is an SDK-first NetBox toolkit built on a single async runtime, exposing the same surface as a Python client, a Typer-powered CLI and a Textual-powered TUI.",
    "It ships with a mock API for tests, GraphQL support, dynamic CLI commands and several Textual UIs for browsing and debugging your NetBox infrastructure.",
  ],
  features: [
    "Standalone async NetBox REST API SDK",
    "Typer-based command-line interface",
    "Textual-based terminal UI for interactive browsing",
    "Async REST client with token authentication",
    "Dynamic CLI commands with GraphQL support",
    "Built-in mock API with full CRUD for local testing",
    "Multiple Textual TUIs for browsing and debugging infra",
  ],
  stack: [
    "Python (async)",
    "Typer (CLI)",
    "Textual (TUI)",
    "Pydantic (validation)",
    "Material for MkDocs (docs)",
  ],
  install: {
    primary: "pip install 'netbox-sdk[all]'",
    note: "Pin a specific version: pip install 'netbox-sdk[all]==0.0.7.post6'",
  },
  meta: {
    netbox: "4.3 / 4.4 / 4.5",
    python: "3.10+",
    latestRelease: "v0.0.7.post6",
    stars: 14,
    forks: 0,
  },
  links: {
    repo: "https://github.com/emersonfelipesp/netbox-sdk",
    docs: "https://emersonfelipesp.com/netbox-sdk",
  },
  banner: String.raw`
   _   _      _   ___           ___ ___  _  __
  | \ | |__ _| |_| _ )_____ __ / __|   \| |/ /
  |  \| / -_)  _| _ \/ _ \ \ / \__ \ |) | ' <
  |_|\_\___|\__|___/\___/_\_\ |___/___/|_|\_\
   c l i  ·  t u i  ·  s d k  ·  a s y n c
`,
  sections: [
    { id: "overview", label: "overview" },
    { id: "features", label: "features" },
    { id: "stack", label: "stack" },
    { id: "install", label: "install" },
    { id: "repo", label: "repo" },
    { id: "links", label: "links" },
  ],
};

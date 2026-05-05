import { netboxSdk } from "@/content/netbox-sdk";

export const NETBOX_SDK_PT_BR = {
  tagline:
    "Toolkit moderno para o NetBox: um SDK assíncrono, uma CLI e uma TUI para acelerar a automação.",
  description: [
    "O netbox-sdk é um toolkit do NetBox orientado a SDK, construído sobre um único runtime assíncrono e expondo a mesma superfície como cliente Python, CLI baseada em Typer e TUI feita em Textual.",
    "Vem com uma API mock para testes, suporte a GraphQL, comandos de CLI dinâmicos e várias TUIs em Textual para navegar e depurar sua infraestrutura no NetBox.",
  ],
  features: [
    "SDK assíncrono e independente para a API REST do NetBox",
    "Interface de linha de comando baseada em Typer",
    "TUI baseada em Textual para navegação interativa",
    "Cliente REST assíncrono com autenticação por token",
    "Comandos de CLI dinâmicos com suporte a GraphQL",
    "API mock embutida com CRUD completo para testes locais",
    "Várias TUIs em Textual para navegar e depurar a infra",
  ],
  stack: netboxSdk.stack,
  install: {
    primary: netboxSdk.install.primary,
    note: "Fixe uma versão específica: pip install 'netbox-sdk[all]==0.0.7.post6'",
    runScript: netboxSdk.install.runScript,
  },
};

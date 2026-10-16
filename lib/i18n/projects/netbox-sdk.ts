import { netboxSdk } from "@/content/netbox-sdk";

export const NETBOX_SDK_PT_BR = {
  tagline:
    "Toolkit moderno para o NetBox: um SDK assíncrono, uma CLI e uma TUI para acelerar a automação.",
  description: [
    "O netbox-sdk é um toolkit do NetBox orientado a SDK, construído sobre um único runtime assíncrono e expondo a mesma superfície como cliente Python, CLI baseada em Typer e TUI feita em Textual.",
    "Vem com clientes tipados para NetBox 4.3 a 4.7, API mock para testes, suporte a GraphQL, comandos de CLI dinâmicos, servidor MCP protegido e TUIs em Textual para navegar e depurar sua infraestrutura no NetBox.",
  ],
  features: [
    "SDK assíncrono e independente para a API REST do NetBox",
    "Interface de linha de comando baseada em Typer",
    "TUI baseada em Textual para navegação interativa",
    "Cliente REST assíncrono com autenticação por token",
    "Comandos de CLI dinâmicos com suporte a GraphQL",
    "API mock embutida com CRUD completo para testes locais",
    "Clientes tipados estáveis para NetBox 4.3–4.7; o schema padrão é o GA 4.7.0",
    "Servidor nbx-mcp protegido e bridge semântica para plugins",
    "Várias TUIs em Textual para navegar e depurar a infra",
  ],
  stack: netboxSdk.stack,
  install: {
    primary: netboxSdk.install.primary,
    note: "Fixe uma versão específica: pip install 'netbox-sdk[all]==0.0.13'",
    runScript: netboxSdk.install.runScript,
  },
};

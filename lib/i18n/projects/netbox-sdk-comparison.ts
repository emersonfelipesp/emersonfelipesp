import type { ComparisonContent } from "@/content/types";

export const NETBOX_SDK_COMPARISON_PT_BR: Pick<
  ComparisonContent,
  "tagline" | "intro" | "libraryA" | "libraryB" | "verdict" | "sections"
> = {
  tagline:
    "Comparação lado a lado de duas bibliotecas Python para a API REST do NetBox.",
  sections: [
    { id: "overview", label: "visão geral" },
    { id: "libraries", label: "bibliotecas" },
    { id: "comparison", label: "comparação" },
    { id: "when-to-choose", label: "quando usar" },
    { id: "install", label: "instalação" },
    { id: "links", label: "links" },
  ],
  intro: [
    "pynetbox é o cliente Python oficial para a API REST do NetBox, mantido pela organização netbox-community. É a escolha padrão desde 2017 — originalmente desenvolvido no DigitalOcean — e tornou-se o padrão de facto para scripts Python contra o NetBox.",
    "netbox-sdk é uma biblioteca mais nova (2024, pré-lançamento) construída sobre um runtime assíncrono desde o início. Disponibiliza um SDK standalone, uma CLI com comandos gerados a partir do OpenAPI e uma TUI Textual em um único pacote, além de um servidor mock local para testes sem uma instância real do NetBox.",
    "As duas bibliotecas conversam com a mesma API REST do NetBox. A escolha certa depende de o seu fluxo de trabalho ser orientado a scripts e síncrono, ou orientado a serviços e assíncrono. As seções abaixo comparam as duas sem exageros.",
  ],
  libraryA: {
    name: "pynetbox",
    description: [
      "Um wrapper Python fino e síncrono para a API REST do NetBox. Retorna objetos Record e RecordSet com acesso a atributos estilo ORM, métodos .save() e .delete() — então você pode escrever device.name = 'foo'; device.save() sem construir dicts manualmente.",
      "pynetbox é somente síncrono (usa requests). Suporta paginação paralela via threading=True, validação de filtros contra o OpenAPI com strict_filters=True, e um gerenciador de contexto para o plugin de branching do NetBox. Nenhum servidor mock é incluído — você usa unittest.mock nos testes.",
      "A biblioteca é mantida pela organização GitHub netbox-community e acompanha as versões do NetBox de perto. A compatibilidade está documentada em uma matriz de versões de 3.3 a 4.5.",
    ],
    bestFor: [
      "Scripts, playbooks Ansible e automações que já usam o ecossistema da netbox-community",
      "Projetos que preferem o estilo ORM .save()/.delete() em vez de chamadas de API explícitas",
      "Ambientes que precisam de dependências mínimas em produção",
      "Fluxos que usam o plugin de branching do NetBox via activate_branch()",
    ],
  },
  libraryB: {
    name: "netbox-sdk",
    description: [
      "Um SDK assíncrono construído sobre aiohttp, expondo três camadas de uso: um cliente HTTP bruto, uma fachada assíncrona (api()), e um cliente tipado versionado (typed_api()) que retorna modelos Pydantic para NetBox 4.3–4.6. As três camadas compartilham o mesmo runtime.",
      "O pacote oferece extras opcionais: [cli] adiciona uma CLI Typer-based (nbx) com comandos dinâmicos gerados a partir do OpenAPI, [tui] adiciona uma interface de terminal com Textual, e [mock] adiciona um servidor mock FastAPI local (nbx-mock) para desenvolver e testar sem uma instância real do NetBox.",
      "netbox-sdk está em pré-lançamento (alpha, versão 0.0.9) com baixa adoção. A superfície de API cobre NetBox 4.3–4.6 e pode mudar entre versões. Python 3.11+ é necessário.",
    ],
    bestFor: [
      "Aplicações e serviços assíncronos que precisam de suporte nativo a asyncio",
      "Desenvolver ou testar localmente sem uma instância real do NetBox (servidor mock)",
      "Projetos que querem segurança de tipos completa com respostas NetBox validadas pelo Pydantic",
      "Fluxos que se beneficiam de uma CLI (nbx) ou TUI pronta para operações no NetBox",
    ],
  },
  verdict: [
    "Se você está escrevendo scripts, playbooks Ansible ou qualquer automação síncrona contra o NetBox hoje, pynetbox é a escolha certa. É testado em produção desde 2017, acompanha o ciclo de versões do NetBox, tem dependências mínimas e é mantido pela organização netbox-community.",
    "Se você está construindo um serviço ou aplicação assíncrona que fala com o NetBox, ou precisa desenvolver e testar localmente sem uma instância real, netbox-sdk vale ser avaliado. Seu runtime aiohttp, respostas tipadas com Pydantic, servidor mock e CLI/TUI opcional atendem a um fluxo de trabalho diferente do pynetbox.",
    "As duas bibliotecas não concorrem pelo mesmo caso de uso. pynetbox é voltado para scripts e automação síncrona; netbox-sdk é voltado para serviços assíncronos e equipes que querem modelos tipados, um mock de desenvolvimento, ou uma interface de terminal.",
  ],
};

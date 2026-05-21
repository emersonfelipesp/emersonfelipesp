import type { ComparisonContent } from "@/content/types";

export const PROXMOX_SDK_COMPARISON_PT_BR: Pick<
  ComparisonContent,
  "tagline" | "intro" | "libraryA" | "libraryB" | "verdict" | "sections"
> = {
  tagline:
    "Comparação lado a lado de duas bibliotecas Python para a API do Proxmox.",
  sections: [
    { id: "overview", label: "visão geral" },
    { id: "libraries", label: "bibliotecas" },
    { id: "comparison", label: "comparação" },
    { id: "when-to-choose", label: "quando usar" },
    { id: "install", label: "instalação" },
    { id: "links", label: "links" },
  ],
  intro: [
    "proxmoxer é a biblioteca Python consolidada para a API do Proxmox VE/PBS/PMG. É a escolha padrão desde 2012, comprovada em produção em milhares de ambientes, e sustenta ferramentas de automação como a coleção Ansible Proxmox e vários providers do Terraform.",
    "proxmox-sdk é uma biblioteca mais nova (2024, pré-lançamento) que adota uma abordagem diferente: gera sua superfície de API diretamente a partir do schema do Proxmox API Viewer, acompanha um servidor FastAPI completo além do SDK Python, e opera por padrão em modo mock para que você possa desenvolver sem um cluster real.",
    "Ambas as bibliotecas suportam os mesmos métodos de autenticação e backends de transporte do Proxmox. A escolha certa depende do seu caso de uso — as seções abaixo detalham os trade-offs sem exageros.",
  ],
  libraryA: {
    name: "proxmoxer",
    description: [
      "Um wrapper Python fino e escrito à mão para a API REST do Proxmox. Retorna dicts Python brutos (ou exatamente o JSON que seu nó Proxmox envia). Projetado para ser mínimo: a dependência principal para acesso HTTPS é a biblioteca requests.",
      "proxmoxer é síncrono. Existem wrappers assíncronos não oficiais na comunidade, mas não fazem parte do pacote upstream. Não possui modo mock — cada chamada aponta para um endpoint Proxmox real.",
      "Sua cobertura abrange Proxmox VE, Proxmox Backup Server e Proxmox Datacenter Manager. A superfície de API é mantida manualmente, o que significa que raramente quebra, mas pode ficar atrás de novos endpoints do Proxmox.",
    ],
    bestFor: [
      "Automação existente com Ansible, Terraform ou shell scripts que já usa proxmoxer",
      "Scripts simples que precisam de dependências mínimas em um ambiente de produção",
      "Projetos onde respostas em dict bruto são suficientes e tipagem não é necessária",
      "Ambientes onde você sempre tem um cluster Proxmox real para testar",
    ],
  },
  libraryB: {
    name: "proxmox-sdk",
    description: [
      "Um SDK Python gerado por código a partir do schema do Proxmox API Viewer. O mesmo pacote disponibiliza um servidor FastAPI completo (com Swagger UI em /docs), uma CLI (pbx) e uma TUI Textual — mas o SDK principal pode ser usado de forma standalone sem esses extras.",
      "proxmox-sdk opera por padrão em modo mock: um servidor FastAPI em memória que responde a todos os 675 endpoints do PVE 9.2 com dados CRUD gerados automaticamente. Trocar para o modo real encaminha requisições validadas para um nó Proxmox real.",
      "As respostas são modelos Pydantic, não dicts brutos. O schema é atualizado semanalmente via um workflow do GitHub Actions que detecta drift de API automaticamente. proxmox-sdk está em pré-lançamento (alpha) com baixa adoção e uma superfície de API que pode mudar entre versões.",
    ],
    bestFor: [
      "Construir um serviço ou camada de API sobre o Proxmox que precisa de uma superfície OpenAPI",
      "Desenvolver e testar localmente sem um cluster Proxmox real (modo mock)",
      "Projetos que se beneficiam de respostas Proxmox tipadas e validadas pelo Pydantic",
      "Fluxos de trabalho que querem uma CLI ou TUI pronta para operações no Proxmox",
    ],
  },
  verdict: [
    "Se você precisa de uma biblioteca que funcione em produção hoje, proxmoxer é a escolha certa. Foi testada em batalha por mais de uma década, integra-se ao ecossistema Ansible e Terraform, e adiciona quase nenhum peso de dependências ao seu projeto.",
    "Se você está construindo um novo serviço que expõe funcionalidades do Proxmox via API, ou se quer desenvolver sem um cluster Proxmox real, proxmox-sdk vale ser avaliado. Seu servidor mock, respostas tipadas e superfície OpenAPI oferecem uma experiência de desenvolvimento diferente do proxmoxer — voltada para desenvolvedores de serviços, não autores de scripts.",
    "As duas bibliotecas não são mutuamente exclusivas. proxmoxer lida com chamadas diretas Python-ao-Proxmox; proxmox-sdk mira na camada acima, onde você precisa de um front-end HTTP, docs gerados automaticamente ou modelos tipados para consumidores downstream.",
  ],
};

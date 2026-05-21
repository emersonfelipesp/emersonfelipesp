import { netboxProxboxDeveloper } from "@/content/netbox-proxbox-developer";
import { proxboxApiDeveloper } from "@/content/proxbox-api-developer";
import { netboxSdkDeveloper } from "@/content/netbox-sdk-developer";
import { proxmoxSdkDeveloper } from "@/content/proxmox-sdk-developer";
import type {
  DeveloperContent,
  DeveloperWorkflow,
  SectionLink,
} from "@/content/types";
import { DICTIONARIES } from "./dictionary";
import type { Lang } from "./languages";

function localizeSections<T extends SectionLink>(
  sections: readonly T[],
  lang: Lang,
): T[] {
  const labels = DICTIONARIES[lang].project.developer.sections;
  return sections.map((s) => {
    const key = s.id as keyof typeof labels;
    return labels[key] ? { ...s, label: labels[key] } : { ...s };
  });
}

type LocalizedDeveloper = {
  tagline: string;
  intro: readonly string[];
  architectureBullets: readonly string[];
  integrationNotes: readonly (string | undefined)[];
  contributingCodeStyle: readonly string[];
  ciIntro?: readonly string[];
  ciWorkflows?: readonly DeveloperWorkflow[];
  ciNotes?: readonly string[];
  e2eFramework: string;
  e2eIntro: readonly string[];
  e2eCoverage: readonly string[];
};

const NETBOX_PROXBOX_PT_BR: LocalizedDeveloper = {
  tagline:
    "Guia do desenvolvedor — arquitetura, integrações, fluxo de contribuição e testes ponta a ponta.",
  intro: [
    "O netbox-proxbox é um plugin Django publicado sobre o NetBox 4.5.x / 4.6.x. Ele roda dentro do processo do NetBox e orquestra todo o tráfego real do Proxmox por meio de um serviço FastAPI irmão chamado proxbox-api.",
    "Esta página documenta as peças que um contribuidor precisa entender: como um clique em Full Update na UI do NetBox acaba transmitindo clusters, nós, VMs, snapshots e backups para a fonte da verdade, onde mora o código que faz isso, e como a suíte de testes prova que a fiação funciona.",
  ],
  architectureBullets: [
    "Entry point do plugin: netbox_proxbox/__init__.py registra o NetBoxPluginConfig (atualmente certificado contra NetBox v4.5.8 → v4.6.x).",
    "Modelos persistidos: ProxmoxEndpoint, NetBoxEndpoint (singleton), FastAPIEndpoint (singleton), ProxmoxCluster, ProxmoxNode, ProxmoxStorage, BackupRoutine, Replication, VMBackup, VMSnapshot, VMTaskHistory, ProxboxPluginSettings.",
    "Roteamento: netbox_proxbox/urls.py liga toda view de CRUD e operacional; views em netbox_proxbox/views/ estendem NetBoxModelViewSet e usam register_model_view para painéis de objetos relacionados.",
    "API REST: netbox_proxbox/api/ expõe rotas DRF NetBoxModelViewSet para cada modelo persistido.",
    "Workflow de sincronização: um Full Update enfileira ProxboxSyncJob na fila default do RQ do NetBox (timeout de job 7200s, leitura HTTP 3600s). O job chama o endpoint full-update/stream do proxbox-api e retransmite cada evento SSE para o navegador via netbox_proxbox/services/backend_proxy.py.",
    "Visualizador ao vivo de logs: uma ponte WebSocket separada mantém o buffer de logs do proxbox-api fluindo dentro da UI do plugin. O parsing no navegador vive em netbox_proxbox/static/netbox_proxbox/js/.",
    "Modelo de segurança: views CRUD usam ObjectPermissionRequiredMixin; views customizadas usam ConditionalLoginRequiredMixin (respeita LOGIN_REQUIRED do NetBox); endpoints operacionais usam ContentTypePermissionRequiredMixin.",
    "CLI complementar: proxbox_cli/ disponibiliza o comando pxb (declarado em pyproject.toml [project.scripts]) para disparos de sincronização sem interface.",
  ],
  integrationNotes: [
    "Resolvido em tempo de execução via FastAPIEndpoint.objects.first() — nunca importado como dependência Python.",
    "O plugin vive dentro do NetBox; persiste seus próprios modelos no banco do NetBox e renderiza dentro dos templates do NetBox.",
    "O plugin nunca conversa diretamente com o Proxmox; tudo passa pelo proxbox-api.",
  ],
  contributingCodeStyle: [
    "Linter: ruff (line length 88, select E/F/W).",
    "Formatador: black.",
    "Type checker: ty (>=0.0.1a19).",
    "Hooks de pre-commit: .pre-commit-config.yaml (rode antes de abrir o PR).",
    "PRs referenciam a issue de fechamento com `Closes #<id>`. Guia de contribuição: CONTRIBUTING.md.",
  ],
  ciIntro: [
    "A superfície de CI é dividida entre checagens rápidas de pacote, uma stack Docker E2E reutilizável, automação de documentação, contratos noturnos e publicação em etapas.",
    "A validação de release mantém plugin e backend no mesmo índice de pacotes: validação TestPyPI do plugin usa proxbox-api do TestPyPI, enquanto candidatos e finais PyPI usam proxbox-api do PyPI.",
  ],
  ciWorkflows: [
    {
      name: "ci.yml",
      trigger: "push + pull_request",
      purpose:
        "Roda lint, ty, compile, cobertura pytest e testes de contrato de metadados do pacote.",
    },
    {
      name: "e2e-docker.yml",
      trigger: "workflow_call + manual + noturno",
      purpose:
        "Roda NetBox, rqworker, proxbox-api, PostgreSQL, Redis e um mock Proxmox em Docker.",
    },
    {
      name: "publish-testpypi.yml",
      trigger: "tags de versão + GitHub releases + manual",
      purpose:
        "Publica versões imutáveis TestPyPI/PyPI e exige instalação exata mais validação E2E.",
    },
    {
      name: "docs.yml",
      trigger: "mudanças de docs",
      purpose: "Constrói e publica o site MkDocs.",
    },
    {
      name: "nightly-contracts.yml",
      trigger: "agendamento + manual",
      purpose:
        "Verifica contratos entre repositórios que precisam ficar alinhados com o proxbox-api.",
    },
  ],
  ciNotes: [
    "Nunca republique uma versão consumida com --skip-existing; publique o próximo .postN ou rcN.",
    "O workflow E2E aceita install_source, dependency_mode, proxbox_api_version, netbox_image e proxmox_service para validação focada.",
    "Cada célula da matriz baixa uma tag dedicada de imagem do proxmox-sdk — emersonfelipesp/proxmox-sdk:latest-pve, :latest-pbs, :latest-pdm — para que as três superfícies do Proxmox rodem em paralelo com fail-fast desabilitado.",
    "A fonte pública no MkDocs é docs/developer/ci-e2e-workflows.md (matriz paralela detalhada em docs/features/e2e-docker-testing.md).",
  ],
  e2eFramework:
    "Script Python com requests + stack Docker Compose (NetBox + PostgreSQL + Redis + proxbox-api + um mock por célula do proxmox-sdk escolhido entre latest-pve / latest-pbs / latest-pdm).",
  e2eIntro: [
    "Não há alvo de E2E em pytest — a suíte é um script Python executável que sobe a stack inteira, dispara um Full Update e valida o estado resultante no NetBox.",
    "A matriz Docker se expande em versões do NetBox × proxmox_service para que PVE, Proxmox Backup Server e Proxmox Datacenter Manager sejam exercitados em paralelo. As asserções específicas de PVE têm gate em um helper de stack e são puladas automaticamente nas células pbs/pdm; o smoke do /health do proxbox-api roda em cada célula.",
    "A mesma suíte está conectada ao GitHub Actions para cobertura noturna e releases em etapas: execuções TestPyPI instalam o plugin e o proxbox-api do TestPyPI, enquanto candidatas e finais PyPI instalam ambos do PyPI.",
  ],
  e2eCoverage: [
    "Specs: tests/e2e/e2e_stack_check.py, stack_setup.py, stack_sync.py, stack_common.py, mock_proxmox_api.py.",
    "Stack: imagem netboxcommunity/netbox:v4.5.8 / v4.5.9 / v4.6.0 + Postgres + Redis + proxbox-api + proxmox-sdk:latest-{pve,pbs,pdm} escolhido por célula.",
    "Dados de mock: tests/e2e/proxmox_openapi_mock_data.json montado dentro do contêiner mock do proxmox-sdk; a tag de serviço solicitada determina qual superfície OpenAPI (PVE / PBS / PDM) é servida.",
    "Eixos da matriz: netbox_image (3) × install_source ∈ {local, pypi, container, testpypi} × dependency_mode ∈ {dev, published, testpypi-package, pypi-package} × proxmox_service ∈ {pve, pbs, pdm}, com fail-fast desabilitado.",
    "Gate de release: publish-testpypi.yml publica no TestPyPI primeiro, valida instalacoes exatas de pacote, e so promove versoes rc/final no PyPI depois do E2E passar com o indice correspondente do proxbox-api.",
    "Agendamento: cron noturno 31 2 * * * exercita a matriz completa sem supervisão.",
  ],
};

const PROXBOX_API_PT_BR: LocalizedDeveloper = {
  tagline:
    "Guia do desenvolvedor — orquestração FastAPI, fronteiras de SDK, fluxo de contribuição e a matriz E2E em Docker.",
  intro: [
    "O proxbox-api é o serviço FastAPI que faz a ponte entre Proxmox VE e NetBox. É dele o workflow de sincronização que o plugin netbox-proxbox dispara de dentro do NetBox, e ele expõe endpoints REST + Server-Sent Events + WebSocket para devolver progresso ao vivo.",
    "Esta página cobre a arquitetura em camadas, o que o proxbox-api consome como dependência versus o que ele faz proxy em tempo de execução, o fluxo de contribuição, e a matriz E2E multi-modo que exercita todo transporte antes de uma release sair.",
  ],
  architectureBullets: [
    "Entrypoint ASGI: uvicorn proxbox_api.main:app. O app é montado por proxbox_api.app.factory.create_app() — inicializa o banco SQLite (sqlmodel + aiosqlite), monta a sessão padrão do NetBox e registra as rotas geradas de proxy do Proxmox.",
    "Camadas: routes/ (routers FastAPI — auth, dcim, extras, netbox, proxbox, proxmox, sync, virtualization) → services/sync/ (orquestração) → schemas/ + enum/ (validação Pydantic 2 em todos os limites) → proxmox_to_netbox/ (transformação) → session/ (factories de cliente NetBox + Proxmox como dependências FastAPI).",
    "Sincronizações transmitem Server-Sent Events e, opcionalmente, progresso por WebSocket. /full-update/stream conduz a cadeia completa: devices → storage → VMs → discos → backups → snapshots → interfaces → IPs → backup routines → replications.",
    "Auth: API key com hash bcrypt no header X-Proxbox-API-Key, com bloqueio anti-brute-force (proxbox_api/auth.py). Credenciais em repouso são cifradas com Fernet (PROXBOX_ENCRYPTION_KEY obrigatório em produção).",
    "Persistência: SQLModel + aiosqlite para armazenar endpoints e chaves; o lado proxbox-api não depende de PostgreSQL.",
    "Knobs de concorrência: PROXBOX_NETBOX_TIMEOUT (120s), PROXBOX_NETBOX_MAX_CONCURRENT (padrão 1, intencionalmente baixo), PROXBOX_VM_SYNC_MAX_CONCURRENCY, PROXBOX_NETBOX_GET_CACHE_TTL (cache GET 60s, 0 desabilita), PROXBOX_RATE_LIMIT (60 req/min/IP via SlowAPI).",
    "UI administrativa embutida: nextjs-ui/ — frontend Next.js usado para administrar endpoints, com build target separado.",
    "Rotas geradas de proxy: proxbox_api/generated/ contém 646 endpoints tipados do Proxmox extraídos do API Viewer. Não edite à mão — regenere a partir de proxbox-api/proxmox_codegen/.",
  ],
  integrationNotes: [
    "Cada clique em Full Update no plugin chega aqui como uma requisição para /full-update/stream.",
    "Sessões assíncronas em aiohttp em proxbox_api/session/ + helpers em proxbox_api/netbox_rest.py. Camada de cache GET (60s TTL) compartilhada pelo workflow.",
    "Somente leitura — o workflow nunca faz POST/PUT/DELETE de volta no Proxmox. MockBackend é usado para testes rápidos.",
    "Gerencia chaves bcrypt, credenciais cifradas e registros de endpoint pela mesma superfície FastAPI.",
  ],
  contributingCodeStyle: [
    "Linter: ruff (select E4/E7/E9/F/I/ANN201/D103/W/C90, complexidade máxima 10).",
    "Formatador: ruff format.",
    "Type checker: ty.",
    "PRs precisam incluir uma execução verde de todas as checagens acima; o job core do CI roda pytest tests/ -v --ignore=tests/e2e em cada push e PR.",
  ],
  ciIntro: [
    "O CI do backend é dividido em camadas: checagens Python rápidas, smoke tests de startup das imagens Docker, geração da matriz E2E, fallback de imagem NetBox e validação de sincronização com uma stack NetBox real.",
    "O workflow de publicação valida TestPyPI primeiro, promove release candidates PyPI só depois dos checks de candidata, publica imagens Docker e roda E2E pós-publicação contra os artefatos publicados.",
  ],
  ciWorkflows: [
    {
      name: "ci.yml",
      trigger: "push + pull_request + release + manual",
      purpose:
        "Roda pytest core, piso Python 3.11, smoke free-threaded, Docker bind smoke e matriz E2E com NetBox.",
    },
    {
      name: "publish-testpypi.yml",
      trigger: "tags de versão + GitHub releases + manual",
      purpose:
        "Publica TestPyPI, PyPI rc/final, imagens Docker, e valida instalações exatas mais E2E pre/pos-publicação.",
    },
    {
      name: "docker-hub-publish.yml",
      trigger: "workflow_call + manual",
      purpose:
        "Constrói e publica as variantes raw, nginx e granian da imagem Docker.",
    },
    {
      name: "release-docker-verify.yml",
      trigger: "release + manual",
      purpose:
        "Baixa tags Docker publicadas e verifica startup de cada variante de contêiner.",
    },
    {
      name: "nightly-schema-refresh.yml",
      trigger: "agendamento + manual",
      purpose:
        "Atualiza schemas Proxmox gerados e abre PR quando os artefatos mudam.",
    },
  ],
  ciNotes: [
    "Jobs E2E aguardam até 20 minutos por migrações/indexação do NetBox e exigem /api/status/ antes de configurar tokens.",
    "O job E2E tenta puxar imagens públicas do NetBox primeiro e só baixa o artefato construído quando o pull do registro falha.",
    "E2E Docker com mock Proxmox usa mock_http e rotaciona as tags de serviço do proxmox-sdk (pve, pbs, pdm) por célula da matriz; a passagem MockBackend em processo usa mock_backend e roda apenas na célula main × pve.",
    "A fonte pública no MkDocs é docs/development/e2e-proxmox-service-matrix.md (espelho pt-BR em docs/pt-BR/).",
  ],
  e2eFramework:
    "pytest + pytest-asyncio + httpx.AsyncClient. Dois modos via marker — mock_backend (em processo, sem HTTP) e mock_http (contra um contêiner do proxmox-sdk em execução).",
  e2eIntro: [
    "O loop rápido roda inteiramente em processo contra MockBackend; sem Docker, sem rede. O loop completo se expande em uma matriz de três eixos no GitHub Actions — transport × NetBox × proxmox_service — baixando um mock dedicado do proxmox-sdk por célula.",
    "Cada valor de proxmox_service (pve, pbs, pdm) baixa a tag correspondente — emersonfelipesp/proxmox-sdk:latest-pve, :latest-pbs, :latest-pdm — para que clusters PVE, Proxmox Backup Server e Proxmox Datacenter Manager sejam exercitados em paralelo.",
    "Specs exclusivas do PVE (sync de VMs, devices, backups) têm gate na fixture de sessão requires_pve_schema e são puladas automaticamente nas células pbs/pdm; o smoke tests/e2e/test_proxmox_mock_health.py roda contra /health em cada célula para falhar rápido se uma imagem mock estiver quebrada.",
    "O workflow de release e em etapas: tags normais e post publicam no TestPyPI, release candidates do PyPI usam vX.Y.ZrcN, e o pacote final no PyPI mais as imagens Docker so saem depois da validacao de reinstalacao e dos gates E2E.",
  ],
  e2eCoverage: [
    "Specs: tests/e2e/conftest.py, test_vm_sync.py, test_devices_sync.py, test_backups_sync.py, test_demo_auth.py, test_proxmox_mock_health.py.",
    "Markers: @pytest.mark.mock_backend (MockBackend em processo) e @pytest.mark.mock_http (contêiner Docker do proxmox-sdk nas portas 8006/8007). A fixture de sessão requires_pve_schema pula automaticamente specs exclusivas de PVE nas células pbs/pdm.",
    "Os helpers de auth em proxbox_api/e2e/ são o único lugar do backend onde Playwright é usado; a fixture proxmox_sdk_mock troca as tags do contêiner conforme a variável PROXMOX_SERVICE.",
    "CI: ci.yml roda o job core de testes (pytest excluindo tests/e2e) mais uma matriz E2E em Docker de 7 × 3 × 3 (transport × NetBox × service) com fail-fast desabilitado. A passagem mock_backend tem gate em main + pve para rodar exatamente uma vez.",
    "Gate de release: publish-testpypi.yml valida instalacoes TestPyPI primeiro, depois instalacoes rc/final PyPI, publicacao de imagens Docker e E2E pos-publicacao na mesma matriz de serviços.",
  ],
};

const NETBOX_SDK_PT_BR: LocalizedDeveloper = {
  tagline:
    "Guia do desenvolvedor — três pacotes, um runtime assíncrono, CLI orientada por OpenAPI e harness de testes Textual.",
  intro: [
    "O netbox-sdk é um toolkit single-repo com três pacotes: um SDK Python assíncrono, uma CLI baseada em Typer (nbx) e uma TUI Textual. Eles compartilham um único runtime e uma fronteira de import estrita.",
    "Esta página documenta o layout, o sistema de comandos dinâmicos guiado por OpenAPI, o fluxo de contribuição e o harness de pilot do Textual usado para rodar a suíte de TUI ponta a ponta sem terminal real.",
  ],
  architectureBullets: [
    "Três pacotes co-publicados: netbox_sdk/ (camada de API standalone, sem deps de CLI/TUI), netbox_cli/ (CLI Typer, entry point nbx), netbox_tui/ (TUI Textual, carregada sob demanda). Build backend: setuptools.",
    "Fronteira de import (forçada por convenção + testes): netbox_sdk NÃO pode importar netbox_cli nem netbox_tui. Imports absolutos apenas.",
    "Núcleo do SDK: netbox_sdk/client.py envolve aiohttp.ClientSession e expõe três camadas — NetBoxApiClient cru, fachada assíncrona api(), cliente tipado versionado typed_api() (4.3 / 4.4 / 4.5 / 4.6).",
    "OpenAPI embarcado: netbox_sdk/reference/openapi/*.json contém schemas embarcados para cada release suportada do NetBox.",
    "Geração dinâmica de comandos da CLI: netbox_cli/dynamic.py registra comandos do Typer em tempo de import a partir do schema OpenAPI. netbox_cli/runtime.py é dono das factories de config / index / cliente. Os docs são gerados por netbox_cli/docgen*.",
    "TUI: netbox_tui/app.py é o app principal. netbox_tui/theme_registry.py auto-descobre temas JSON em netbox_tui/themes/*.json. Arquivos TCSS são assets em runtime; tests/test_no_hardcoded_colors.py proíbe literais hex em TCSS.",
    "Camada de mock: netbox_sdk/mock_main.py serve um mock FastAPI local (entry point nbx-mock) para testes e demos offline. Estado em memória com CRUD completo.",
    "Fluxo de demo: netbox_sdk/demo_auth.py usa Playwright para autenticar contra demo.netbox.dev para que as capturas do site (DemoInitRunner / DemoDevicesListRunner) reflitam a saída real da CLI.",
  ],
  integrationNotes: [
    "Autenticação por token; paginação, validação de filtros e carregamento preguiçoso de objetos relacionados ficam no cliente.",
    "Usado pelo perfil de demo para obter um token válido sem fixar credenciais em código.",
    "Disparado pelo entry point nbx-mock. Mesmas rotas que o SDK exercita nos testes.",
    "O proxbox-api fixa netbox-sdk==0.0.8.post1 como seu destino de escrita no NetBox.",
  ],
  contributingCodeStyle: [
    "Linter: ruff (select E/F/I/UP/W/ANN201/ANN202).",
    "Type checker: ty.",
    "O pre-commit faz o gate dos eventos pre-commit e pre-push — instale ambos os tipos de hook.",
    "Regra rígida: sem literais hex de cor em TCSS (forçado por tests/test_no_hardcoded_colors.py).",
  ],
  e2eFramework:
    "pytest + pytest-asyncio (asyncio_mode=auto) + Pilot do App.run_test() do Textual — testes de TUI rodam sem cabeça, sem precisar de terminal real.",
  e2eIntro: [
    "Os testes de TUI montam cada app em um terminal virtual via async with App.run_test() as pilot, e então dirigem teclas/mouse pela API do Pilot. Os testes de SDK rodam a matriz contra API ao vivo em pushes para main, contra um contêiner Docker do NetBox.",
    "As duas suítes são separadas por markers do pytest para que cada uma possa ser rodada de forma isolada no CI.",
  ],
  e2eCoverage: [
    "Specs: tests/test_cli_tui.py (navegação + execução de comandos do NbxCliTuiApp), test_tui_interaction.py (breadcrumb, filtragem, cable trace, tokens de tema), test_dev_tui.py, test_graphql_tui.py.",
    "Harness de screenshots: test_tui_screenshots.py captura fixtures usadas pela pipeline de docgen do site portfólio.",
    "Matriz contra NetBox ao vivo: .github/workflows/test.yml × {v4.5.8, v4.5.9, v4.6.0} roda suite_sdk contra uma API real, incluindo auth / paginação / GraphQL.",
    "Guarda contra hex literais: tests/test_no_hardcoded_colors.py mantém valores de tema fora dos TCSS.",
  ],
};

const PROXMOX_SDK_PT_BR: LocalizedDeveloper = {
  tagline:
    "Guia do desenvolvedor — pipeline de codegen, backends mock/real duplos e a fronteira de integração da qual stacks downstream dependem.",
  intro: [
    "O proxmox-sdk é um toolkit Python orientado a schema. Espelha a superfície REST do Proxmox VE 9.2 como 675 endpoints tipados, roda em modo mock ou proxy real, e expõe o resultado tanto como SDK em processo quanto como servidor FastAPI opcional.",
    "Esta página documenta o pipeline de codegen que produz o schema, a camada de backends plugáveis que faz cada endpoint resolver contra dados mock ou um cluster real, o fluxo de contribuição e a fronteira de integração que stacks downstream (proxbox-api, netbox-proxbox) usam em vez de rodar seu próprio E2E.",
  ],
  architectureBullets: [
    "Pacote Python único proxmox_sdk. Três modos de runtime: servidor FastAPI completo (proxmox_sdk/main.py — mock ou proxy real), entrypoint mock-only standalone (proxmox_sdk/mock_main.py — usado pelas stacks E2E do netbox-proxbox + proxbox-api) e SDK puro (sem servidor).",
    "SDK standalone: proxmox_sdk/sdk/api.py é o ProxmoxSDK (assíncrono). proxmox_sdk/sdk/sync.py o envolve sincronamente. proxmox_sdk/sdk/resource.py acrescenta navegação por atributos.",
    "Backends plugáveis em proxmox_sdk/sdk/backends/: https.py (aiohttp, Proxmox real), mock.py (em memória), local.py (CLI pvesh), ssh_paramiko.py e openssh.py (dois transportes SSH).",
    "Camada de mock: proxmox_sdk/mock/ usa SharedMemoryMockStore (lock compartilhado, persistido em arquivo) e proxmox_sdk/mock/routes.py registra handlers CRUD a partir do schema OpenAPI dinamicamente na inicialização. O estado pode ser zerado com reset_state() entre testes.",
    "Artefatos gerados: proxmox_sdk/generated/ (675 endpoints, modelos Pydantic). Pré-gerados para Proxmox VE 9.2 (9.1.11 mantido; matriz de CI: latest, 9.2, 9.1.11).",
    "Isolamento multi-versão: cada versão de schema recebe um namespace de mock estável (PROXMOX_MOCK_STATE_NAMESPACE padroniza para pmx_{version_tag}). Uma guarda __schema_fingerprint__ no sys.modules evita re-exec de módulo obsoleto quando duas versões carregam no mesmo processo.",
    "Pipeline de codegen: proxmox_sdk/proxmox_codegen/crawler.py (Playwright rastreia o API Viewer oficial do Proxmox), normaliza o resultado, e proxmox_codegen/pipeline.py emite openapi.json + pydantic_models.py. Disparado manualmente ou pelo endpoint /codegen/generate (com rate limit, exige CODEGEN_API_KEY).",
    "Sincronização automática de schema: .github/workflows/schema-update.yml detecta mudanças na API do Proxmox semanalmente (segundas às 03:00 UTC) ou via workflow_dispatch, regenera o schema, verifica integridade de SHA e abre um PR automaticamente.",
    "CLI / TUI: proxmox_sdk/proxmox_cli/ provê os entry points proxmox, pbx e proxmox-cli; pbx tui sobe a TUI Textual com troca de visualização por módulo (PVE / PBS / PDM). Temas: proxmox_cli/themes/themes.py (DARK, LIGHT, MONOKAI).",
    "Rate limiting: SlowAPI em toda rota pública (em processo; funciona sem Redis).",
  ],
  integrationNotes: [
    "Auth: API token (auth/token.py) ou senha/ticket+TOTP (auth/ticket.py). Usado em modo proxy real.",
    "Invocação direta de CLI quando rodando em um nó Proxmox.",
    "Dois transportes SSH intercambiáveis.",
    "O proxbox-api fixa proxmox-sdk==0.0.5.post1; a stack E2E do netbox-proxbox baixa uma das tags por serviço (latest-pve, latest-pbs, latest-pdm) deste repo como o contêiner proxmox-e2e-mock, uma por célula da matriz.",
  ],
  contributingCodeStyle: [
    "Linter: ruff (select E4/E7/E9/F/I/ANN201/D103/W).",
    "Formatador: ruff format.",
    "Type checker: ty.",
    "A saída de codegen (proxmox_sdk/generated/) é regenerada, não editada.",
  ],
  e2eFramework:
    "pytest + pytest-xdist + pytest-cov. A fronteira de integração é coberta por tests/cli/integration/test_backend_integration.py exercitando a ponte CLI ↔ SDK contra o servidor mock.",
  e2eIntro: [
    "O proxmox-sdk não tem um diretório tests/e2e/ dedicado — a suíte de integração da CLI mais as imagens Docker por serviço publicadas (latest-pve, latest-pbs, latest-pdm) atuam como a fronteira de E2E. Stacks downstream (netbox-proxbox, proxbox-api) consomem essas tags e rodam o E2E cross-stack em paralelo.",
    "O v0.0.6 avança o schema para o Proxmox VE 9.2 e expande a matriz de CI para três versões (latest, 9.2, 9.1.11) — cada commit roda a suíte completa de testes contra cada versão de schema de forma independente, com namespacing de estado mock por versão para evitar contaminação entre execuções.",
    "O pipeline de CI faz lint, type check, roda testes com cobertura e reconstrói as variantes Docker por serviço (raw / nginx / granian × pve / pbs / pdm) em cada push para main e testing.",
  ],
  e2eCoverage: [
    "Specs: tests/cli/integration/test_backend_integration.py (ponte CLI ↔ SDK contra o servidor mock).",
    "Matriz de schema do CI: [latest, 9.2, 9.1.11] — cada célula roda a suíte completa com seu próprio PROXMOX_MOCK_STATE_NAMESPACE para evitar colisões de estado compartilhado.",
    "Jobs do CI: lint, syntax, test, docker-images (variantes raw / nginx / granian × tags pve / pbs / pdm publicadas em cada commit em main / testing).",
    "E2E cross-stack: as tags latest-{pve,pbs,pdm} são puxadas pelo e2e-docker.yml do netbox-proxbox e pelo ci.yml do proxbox-api como contêiner proxmox-e2e-mock — uma tag por célula da matriz, provando que as imagens publicadas são consumíveis ponta a ponta.",
  ],
};

const PT_BR_BY_SLUG: Record<string, LocalizedDeveloper> = {
  "netbox-proxbox": NETBOX_PROXBOX_PT_BR,
  "proxbox-api": PROXBOX_API_PT_BR,
  "netbox-sdk": NETBOX_SDK_PT_BR,
  "proxmox-sdk": PROXMOX_SDK_PT_BR,
};

export function getDeveloperContent(
  base: DeveloperContent,
  lang: Lang,
): DeveloperContent {
  if (lang === "en") {
    return { ...base, sections: localizeSections(base.sections, lang) };
  }
  const ptBr = PT_BR_BY_SLUG[base.slug];
  if (!ptBr) {
    return { ...base, sections: localizeSections(base.sections, lang) };
  }
  return {
    ...base,
    tagline: ptBr.tagline,
    intro: ptBr.intro,
    sections: localizeSections(base.sections, lang),
    architecture: { bullets: ptBr.architectureBullets },
    integrations: base.integrations.map((row, i) => ({
      ...row,
      notes: ptBr.integrationNotes[i] ?? row.notes,
    })),
    contributing: {
      ...base.contributing,
      codeStyle: ptBr.contributingCodeStyle,
    },
    ci: base.ci
      ? {
          intro: ptBr.ciIntro ?? base.ci.intro,
          workflows: ptBr.ciWorkflows ?? base.ci.workflows,
          notes: ptBr.ciNotes ?? base.ci.notes,
        }
      : undefined,
    e2e: {
      ...base.e2e,
      framework: ptBr.e2eFramework,
      intro: ptBr.e2eIntro,
      coverage: ptBr.e2eCoverage,
    },
  };
}

export const DEVELOPER_BY_SLUG: Record<string, DeveloperContent> = {
  "netbox-proxbox": netboxProxboxDeveloper,
  "proxbox-api": proxboxApiDeveloper,
  "netbox-sdk": netboxSdkDeveloper,
  "proxmox-sdk": proxmoxSdkDeveloper,
};

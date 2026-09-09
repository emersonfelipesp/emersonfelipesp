export const NETBOX_OPENBAO_PT_BR = {
  tagline:
    "Plugin do NetBox que mantém material secreto no OpenBao enquanto o NetBox possui inventário de credenciais, atribuições e auditoria.",
  description: [
    "O netbox-openbao separa material secreto de metadados de credencial. Chaves privadas, senhas e tokens de API ficam apenas no OpenBao KV v2. Usuários, fingerprints, datas de expiração e atribuições a dispositivos permanecem no NetBox — pesquisáveis, filtráveis e seguros para exportar sem permissão de reveal.",
    "Diferente de plugins de vault no navegador, todo caminho de resolução é server-side pela API REST do NetBox, então automação e operadores compartilham o mesmo modelo de autorização. Reveal é permissão separada, POST-only na UI, JSON-only na API e totalmente auditado.",
  ],
  features: [
    "Nenhum campo do model pode guardar material secreto — changelog, exports e GET da REST API são seguros por construção",
    "Consultas de inventário (expiração, fingerprint, atribuição) não exigem leitura no OpenBao",
    "Permissão reveal dedicada com constraints de objeto no RBAC padrão do NetBox",
    "Rotação em estágios: escreve candidato ao lado da versão live, promove na decisão",
    "AppRoles por tier limitam blast radius; modo broker opcional tira credenciais do vault do host NetBox",
    "HashiCorp Vault suportado como backend alternativo no mesmo contrato",
    "Quick-add de senha SSH; espelha no netbox-nms quando esse plugin está instalado",
  ],
  howItWorks: {
    title: "como funciona",
    paragraphs: [
      "O NetBox guarda linhas Credential, tiers de policy, configuração de engines, atribuições a devices/VMs/services e log completo de acesso. O OpenBao guarda o payload — chave privada, senha, token ou chave de certificado — em um path derivado do engine e tier.",
      "Toda operação que toca material passa por services.py dentro do processo NetBox. Views, viewsets REST, forms e jobs nunca chamam OpenBao diretamente; chamam a camada de serviço, que escolhe o AppRole correto (ou certificado broker) e aplica permissões NetBox primeiro.",
      "Ler material exige a action reveal_credential. Escrita cria ou rotaciona versão KV com compensação explícita se PostgreSQL der rollback. Destruir linha agenda deleção no vault após commit.",
    ],
    splitTable: {
      headers: ["Vai para o OpenBao", "Fica no NetBox (indexado)"],
      rows: [
        ["chave privada", "chave pública"],
        ["senha", "SHA256 fingerprint"],
        ["password", "username"],
        ["token de API", "tipo de chave e tamanho em bits"],
        ["chave privada de certificado", "serial, issuer, subject, not_before, not_after"],
      ],
    },
  },
  security: {
    title: "modelo de segurança",
    bullets: [
      "secret_data é write-only na REST API — DRF recusa serializar em GET, brief ou browsable API",
      "Respostas de reveal são Cache-Control: no-store e excluem renderer HTML",
      "Exceções de backend não carregam texto do vendor — dicas de policy OpenBao não chegam a logs ou clientes",
      "SecretIDs de AppRole vêm de environment ou mounts _FILE, nunca do banco",
      "Modo broker remove credenciais do vault da configuração NetBox; NetBox usa certificado mTLS cliente",
    ],
  },
  ecosystem: {
    title: "ecossistema",
    items: [
      {
        description:
          "Sidecar opcional que guarda o AppRole. NetBox autentica com certificado cliente; log de auditoria fica fora do blast radius do NetBox.",
      },
      {
        description:
          "Quando instalado, quick-add de senha SSH espelha o mesmo login em DeviceCredential e DeviceService SSH.",
      },
      {
        description:
          "Operações de host OpenBao (health, seal, reload de policy) via procedures RPC auditadas — nunca shell ad-hoc do plugin.",
      },
      {
        description:
          "Automação resolve credenciais pela REST do plugin (/api/plugins/openbao/credentials/) com os mesmos tokens e RBAC do NetBox.",
      },
    ],
  },
  apiExamples: {
    title: "api",
    intro:
      "Endpoints de inventário nunca retornam material. Reveal exige netbox_openbao.reveal_credential e parâmetro reason opcional.",
    snippets: [
      {
        label: "inventário — sem leitura no OpenBao",
      },
      {
        label: "reveal — permissão separada",
      },
    ],
  },
  stack: [
    "Plugin NetBox (Django / Python 3.12+)",
    "OpenBao 2.6.x KV v2 (HashiCorp Vault opcional)",
    "PostgreSQL 15+ com ltree",
    "Redis 6+ e NetBox RQ para jobs em background",
  ],
  install: {
    note: "Requer OpenBao (ou Vault) com KV v2, auth AppRole e SecretID por engine no environment do processo NetBox.",
  },
} as const;

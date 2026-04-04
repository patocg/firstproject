# Arquitetura do firstproject

Documento de referência técnica cobrindo a arquitetura completa: desde os requisitos funcionais até o ambiente de produção pós-deploy.

---

## 1. Visão Geral do Sistema

```mermaid
graph TB
    subgraph Cliente["Navegador (Cliente)"]
        UI[Next.js — SSR / CSR]
    end

    subgraph Vercel["Vercel (Edge + Serverless)"]
        NEXT[Next.js App]
        API[API Routes]
        HEADERS[Security Headers\nnext.config.js]
    end

    subgraph AWS["AWS"]
        S3[S3 Bucket\njnths-family-album]
        DDB_WL[(DynamoDB\nwhitelist)]
        DDB_PHOTOS[(DynamoDB\nphotos)]
        DDB_LOGS[(DynamoDB\nacess_denied_logs)]
    end

    subgraph Auth["Autenticação"]
        GOOGLE[Google OAuth 2.0]
        NEXTAUTH[NextAuth v4]
    end

    UI -->|HTTPS| NEXT
    NEXT --> API
    NEXT --> HEADERS
    API -->|GetCommand / ScanCommand / PutCommand| DDB_WL
    API -->|PutCommand / UpdateCommand| DDB_PHOTOS
    API -->|PutCommand| DDB_LOGS
    API -->|Presigned PUT URL| S3
    UI -->|PUT direto \n com presigned URL| S3
    API --> NEXTAUTH
    NEXTAUTH -->|OAuth 2.0| GOOGLE
```

---

## 2. Estrutura de Pastas

```
firstproject/
├── components/
│   ├── common/         → Header, Footer
│   └── sections/       → HeroSection, AboutSection, SkillSection,
│                          StatsSection, ProjectsSection, AlbumSection
├── lib/
│   ├── dynamo.js       → DynamoDBDocumentClient (singleton)
│   ├── photos.js       → listPhotosByAlbum (paginação + soft delete)
│   ├── authLogs.js     → logDeniedAccess → DynamoDB
│   └── logger.js       → logger estruturado + maskEmail
├── pages/
│   ├── index.js        → Portfólio público
│   ├── album/
│   │   ├── index.js    → Lista de álbuns (privado)
│   │   └── [albumCode].js → Galeria de fotos do álbum
│   ├── auth/
│   │   ├── signin.js   → Página customizada de login
│   │   └── error.js    → Página de erro de autenticação
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth].js → Configuração NextAuth
│       │   └── rate-limit.js    → Rate limit em memória
│       ├── album/
│       │   ├── upload-url.js    → Gera presigned URL no S3
│       │   ├── add-photo.js     → Salva metadados no DynamoDB
│       │   ├── delete.js        → Soft delete no DynamoDB
│       │   ├── list-albums.js   → Lista álbuns distintos
│       │   ├── list.js          → Lista fotos por prefixo S3 (legado)
│       │   └── [albumCode].js   → Lista fotos de um álbum via DynamoDB
│       └── whitelist/
│           ├── check.js   → Verifica acesso + retorna permissões
│           ├── list.js    → Lista todos os usuários (paginado)
│           ├── add.js     → Adiciona usuário
│           ├── update.js  → Atualiza permissões
│           └── remove.js  → Remove usuário
├── tests/
│   ├── api/            → Testes das API Routes
│   ├── lib/            → Testes das funções de lib
│   ├── security/       → NoSecrets, NoHardcoded
│   └── *.test.js       → Testes de componentes UI
└── docs/               → Documentação técnica
```

---

## 3. Fluxo de Autenticação

```mermaid
sequenceDiagram
    actor User as Usuário
    participant Browser
    participant NextAuth
    participant Google as Google OAuth
    participant DynamoDB
    participant Logs as DynamoDB\nacess_denied_logs

    User->>Browser: Acessa /album
    Browser->>NextAuth: Sem sessão → redireciona /auth/signin
    User->>Browser: Clica "Entrar com Google"
    Browser->>Google: Redirect OAuth (client_id, scope)
    Google-->>Browser: Código de autorização
    Browser->>NextAuth: Callback /api/auth/callback/google

    NextAuth->>NextAuth: signIn callback

    alt É OWNER_EMAIL
        NextAuth-->>Browser: ✅ Acesso liberado (bypass whitelist)
    else Rate limit excedido (5 tentativas / 15min)
        NextAuth-->>Browser: ❌ Bloqueado (429)
    else Email não na whitelist
        NextAuth->>DynamoDB: GetCommand — tabela whitelist
        DynamoDB-->>NextAuth: Item não encontrado
        NextAuth->>Logs: logDeniedAccess(email, NOT_IN_WHITELIST)
        NextAuth-->>Browser: ❌ Acesso negado
    else Email autorizado na whitelist
        NextAuth->>DynamoDB: GetCommand — tabela whitelist
        DynamoDB-->>NextAuth: Item encontrado
        NextAuth-->>Browser: ✅ JWT gerado (cookie de sessão)
    end

    Browser->>NextAuth: POST /api/whitelist/check
    NextAuth->>DynamoDB: GetCommand — busca permissões
    DynamoDB-->>Browser: allowed, owner, permissions{}
    Browser->>Browser: Renderiza interface\ncorreta por papel
```

---

## 4. Fluxo de Upload de Foto

```mermaid
sequenceDiagram
    actor User as Usuário (owner ou canUploadPhotos)
    participant Browser
    participant API as API Route\n/api/album/upload-url
    participant APIPhoto as API Route\n/api/album/add-photo
    participant DDB as DynamoDB\nwhitelist
    participant S3 as AWS S3

    User->>Browser: Seleciona arquivo
    Browser->>API: POST /api/album/upload-url\n{ fileName, fileType, s3Key }

    API->>API: getServerSession → 401 se sem sessão
    alt É owner
        API->>API: Bypass de whitelist
    else Não é owner
        API->>DDB: GetCommand — verifica canUploadPhotos
        DDB-->>API: Item com permissões
        alt canUploadPhotos = false
            API-->>Browser: 403 Not allowed
        end
    end

    API->>S3: getSignedUrl (PutObjectCommand, 5min)
    S3-->>API: presigned URL
    API-->>Browser: { uploadUrl, key }

    Browser->>S3: PUT direto com presigned URL\n(sem passar pelo servidor)
    S3-->>Browser: 200 OK

    Browser->>APIPhoto: POST /api/album/add-photo\n{ albumCode, s3Key, ... }
    APIPhoto->>APIPhoto: Mesma verificação de sessão + permissão
    APIPhoto->>DDB: PutCommand — tabela photos
    DDB-->>APIPhoto: OK
    APIPhoto-->>Browser: 200 { photoId }
```

---

## 5. Fluxo de Acesso à Galeria

```mermaid
flowchart TD
    A[Usuário acessa /album] --> B{Sessão ativa?}
    B -- Não --> C[Exibe tela de login\n+ botão Google]
    B -- Sim --> D[POST /api/whitelist/check]

    D --> E{Retorno}
    E -- owner=true --> F[Carrega álbuns\n+ mostra painel admin]
    E -- allowed=true --> G[Carrega lista de álbuns]
    E -- allowed=false --> H[Exibe mensagem\nde acesso negado]

    F --> I[GET /api/album/list-albums]
    G --> I
    I --> J[DynamoDB — Scan photos\ndistinct albumCode]
    J --> K[Grade de álbuns]
    K --> L[Clica num álbum]
    L --> M[GET /api/album/albumCode]
    M --> N[DynamoDB — Query photos\nonde deletedAt=null]
    N --> O[Galeria de fotos\ncarregadas do S3]
```

---

## 6. Modelo de Dados (DynamoDB)

```mermaid
erDiagram
    WHITELIST {
        string email PK
        string name
        boolean isActive
        boolean canViewAlbums
        boolean canUploadPhotos
        boolean canDeletePhotos
        boolean canEditProfile
        string lastLoginAt
    }

    PHOTOS {
        string photoId PK
        string albumCode
        string s3Key
        string uploadedAt
        string uploadedBy
        string deletedAt
    }

    ACESS_DENIED_LOGS {
        string email PK
        string timestamp SK
        string reason
    }

    WHITELIST ||--o{ PHOTOS : "usuário faz upload"
    WHITELIST ||--o{ ACESS_DENIED_LOGS : "tentativa negada"
```

---

## 7. Camadas de Segurança

```mermaid
graph TB
    subgraph L1["Camada 1 — Transporte"]
        HSTS[HSTS\nmax-age=63072000]
        CSP[Content-Security-Policy]
        XFO[X-Frame-Options DENY]
        XCTO[X-Content-Type-Options nosniff]
    end

    subgraph L2["Camada 2 — Rate Limiting"]
        RL[5 tentativas / 15min\npor e-mail em memória]
    end

    subgraph L3["Camada 3 — Autenticação"]
        GOOGLE[Google OAuth 2.0]
        JWT[JWT em cookie\nHTTP-only]
    end

    subgraph L4["Camada 4 — Autorização"]
        WL[Whitelist DynamoDB\nisActive + canViewAlbums]
        PERM[Permissões granulares\ncanUploadPhotos\ncanDeletePhotos\ncanEditProfile]
    end

    subgraph L5["Camada 5 — Segredos"]
        ENV[Vars via Vercel\nnunca em código]
        TESTS[Testes automáticos\nNoSecrets + NoHardcoded]
        GIT[.gitignore cobre\n.env* .vercel/]
    end

    Request --> L1 --> L2 --> L3 --> L4
    L5 -.->|garante em CI| L3
    L5 -.->|garante em CI| L4
```

---

## 8. Pipeline de Deploy

```mermaid
flowchart LR
    DEV[Desenvolvedor] -->|git push| GITHUB[GitHub\nbranch feature/*]
    GITHUB -->|Pull Request| PR[Code Review\n+ Testes Locais]
    PR -->|merge develop| DEVELOP[develop]
    DEVELOP -->|Pull Request → main| MAIN[main]
    MAIN -->|webhook automático| VERCEL[Vercel\nBuild + Deploy]
    VERCEL --> PROD[jnths.com.br\nProdução]

    subgraph EnvVars["Variáveis de Ambiente"]
        VDASH[Vercel Dashboard] -->|vercel env pull| LOCAL[.env.local\nignored by git]
        VDASH -->|injetado no build| VERCEL
    end
```

---

## 9. Ambiente de Testes

```mermaid
graph LR
    subgraph TestEnv["NODE_ENV=test"]
        ENVTEST[.env.test\nvalores fake]
        SETUP[jest.setup.js\nsomente imports]
        MOCKS[Mocks: DynamoDB, S3,\nNextAuth, next/router]
    end

    subgraph Suites["14 Suites — 75 testes"]
        UI[Componentes UI\n18 testes]
        API[API Routes\n32 testes]
        LIB[Lib\n5 testes]
        SEC[Segurança\n17 testes]
    end

    ENVTEST --> TestEnv
    SETUP --> TestEnv
    TestEnv --> Suites

    SEC -->|verifica| NOSECRETS[Sem hardcode\nnos arquivos de API]
    SEC -->|verifica| NOHARDCODED[Sem fallbacks\nem jest.setup.js]
    SEC -->|verifica| GITIGNORE[.gitignore cobre\ntodos os arquivos sensíveis]
```

---

## 10. Variáveis de Ambiente

| Variável | Usado em | Descrição |
|---|---|---|
| `AWS_REGION` | `lib/dynamo.js`, `upload-url.js` | Região AWS (sa-east-1) |
| `AWS_ACCESS_KEY_ID` | `upload-url.js` | Credencial IAM para S3 |
| `AWS_SECRET_ACCESS_KEY` | `upload-url.js` | Credencial IAM para S3 |
| `AWS_S3_BUCKET` | `upload-url.js` | Nome do bucket S3 |
| `DYNAMO_TABLE_WHITELIST` | APIs de album, whitelist | Tabela de controle de acesso |
| `DYNAMO_TABLE_PHOTOS` | `add-photo.js`, `delete.js`, `[albumCode].js` | Tabela de metadados de fotos |
| `DYNAMO_TABLE_AUTH_DENIED` | `lib/authLogs.js` | Tabela de logs de acesso negado |
| `OWNER_EMAIL` | NextAuth, todas as APIs protegidas | E-mail do dono (bypass total) |
| `GOOGLE_CLIENT_ID` | NextAuth | App Google OAuth |
| `GOOGLE_CLIENT_SECRET` | NextAuth | App Google OAuth |
| `NEXTAUTH_SECRET` | NextAuth | Assina JWT de sessão |
| `NEXTAUTH_URL` | NextAuth | URL base (https://jnths.com.br) |

Todas gerenciadas pela Vercel. Localmente obtidas via `vercel env pull .env.local`.

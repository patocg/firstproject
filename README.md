# FIRSTPROJECT

Aplicação web desenvolvida com Next.js, integrando AWS (S3 + DynamoDB), autenticação OAuth via Google e controle de acesso baseado em whitelist.

Este projeto evoluiu de um portfólio visual para um laboratório de engenharia focado em arquitetura, segurança, DevOps e governança de código.

Deploy em produção: https://jnths.com.br
Repositório: https://github.com/patocg/firstproject

---

## 1. Objetivo do Projeto

O firstproject não é apenas uma vitrine visual.

Ele foi estruturado para demonstrar:

- Arquitetura escalável
- Integração com serviços cloud
- Controle de acesso baseado em regras granulares
- Hardening de segurança aplicado
- Governança de código
- Preparação para CI/CD e observabilidade

É um projeto orientado à evolução contínua.

---

## 2. Stack Tecnológica

**Frontend**
- Next.js 16 + React 19

**Backend / API**
- Next.js API Routes
- AWS SDK v3

**Cloud**
- AWS S3 (armazenamento de assets)
- AWS DynamoDB (whitelist, fotos, logs de acesso negado)

**Autenticação**
- NextAuth v4
- Google OAuth

**DevOps**
- Vercel (deploy + env vars)
- GitHub (versionamento)
- Jest + React Testing Library (testes)
- ESLint + Prettier

---

## 3. Arquitetura

```
components/   → Componentes reutilizáveis
lib/          → Camada de acesso a dados e utilitários
pages/        → Rotas e API handlers
public/       → Assets estáticos
tests/        → Testes automatizados
docs/         → Documentação técnica
```

Separação de responsabilidades:
- UI desacoplada da lógica
- APIs isoladas por domínio
- Acesso a dados centralizado em `lib/`
- Regras de autorização documentadas formalmente

---

## 4. Controle de Acesso

Sistema baseado em whitelist armazenada no DynamoDB.

Permissões granulares por usuário:

| Permissão | Descrição |
|---|---|
| `isActive` | Usuário ativo na whitelist |
| `canViewAlbums` | Acesso à galeria de fotos |
| `canUploadPhotos` | Upload de novas fotos |
| `canDeletePhotos` | Remoção de fotos (soft delete) |
| `canEditProfile` | Edição de perfil |

O `OWNER_EMAIL` é definido exclusivamente via variável de ambiente — nunca hardcoded no código.

Documentação completa:
- `docs/PERMISSIONS.md`
- `docs/ADMIN_PAINEL.md`

---

## 5. Segurança Implementada

- Security headers HTTP (CSP, HSTS, X-Frame-Options)
- Rate limiting nas rotas de API
- Mascaramento de dados sensíveis em logs
- Separação por ambiente via variáveis de ambiente (Vercel)
- Controle de acesso granular por permissão no DynamoDB
- Nenhum segredo hardcoded — verificado por testes automatizados
- `.env.local` nunca versionado — gerado sob demanda via `vercel env pull`

Próximas evoluções planejadas:
- CSP mais restritivo
- Monitoramento de vulnerabilidades automatizado (Dependabot)
- Observabilidade com logs persistentes (Sentry / Pino)

---

## 6. Testes

```bash
npm test
```

Estado atual: **75 testes passando em 14 suites**

| Suite | Cobertura |
|---|---|
| Componentes UI | HeroSection, AboutSection, SkillsSection, StatsSection, ProjectsSection, AlbumPage, AlbumDetailPage |
| APIs | add-photo, upload-url, delete, whitelist/check |
| Lib | listPhotosByAlbum (paginação + soft delete) |
| Segurança | NoSecrets, NoHardcoded |

Os testes de segurança garantem automaticamente:
- Nenhum e-mail ou credencial hardcoded no código
- `.gitignore` cobrindo todos os arquivos sensíveis
- Sem uso de `NEXT_PUBLIC_` em variáveis sensíveis

---

## 7. Desenvolvimento Local

**Instalação:**
```bash
npm install
```

**Variáveis de ambiente** (requer Vercel CLI):
```bash
vercel env pull .env.local
```

**Rodar em desenvolvimento:**
```bash
npm run dev
```

**Build para produção:**
```bash
npm run build
```

---

## 8. Workflow de Branches

| Branch | Propósito |
|---|---|
| `main` | Produção |
| `develop` | Homologação |
| `feature/*` | Novas funcionalidades |
| `fix/*` | Correções de bugs |
| `refactor/*` | Melhorias estruturais |
| `hotfix/*` | Correções críticas em produção |

Commits seguem o padrão [Conventional Commits](https://www.conventionalcommits.org):

```
feat(auth): implementa validação de whitelist
fix(api): corrige tratamento de erro no S3
test(security): adiciona verificação de hardcode
```

---

## 9. CI/CD e Automação

Pipeline planejado (GitHub Actions — issue #8):

```
lint → test → build → security scan → deploy
```

Objetivo: nenhum merge com falha de pipeline.

---

## 10. Roadmap

O roadmap estratégico completo está disponível em [ROADMAP.md](ROADMAP.md).

Foco atual:
1. CI/CD completo com GitHub Actions
2. Commitlint + Husky
3. TypeScript progressivo
4. Modularização por domínio
5. Observabilidade e monitoramento

---

## 11. Changelog

Histórico de mudanças disponível em [CHANGELOG.md](CHANGELOG.md).

---

## 12. Performance e Qualidade

Metas Lighthouse:

| Métrica | Meta |
|---|---|
| Performance | > 90 |
| Accessibility | > 95 |
| Best Practices | > 95 |
| SEO | > 90 |

---

## 13. Licença

MIT (a ser formalizada).

---

## 14. Posicionamento Técnico

Este projeto demonstra:

- Capacidade de integrar frontend e backend em ambiente cloud real
- Experiência prática com AWS (S3 + DynamoDB)
- Mentalidade DevOps e segurança por padrão
- Governança de código com testes automatizados e sem segredos no repositório
- Evolução arquitetural contínua e disciplinada

Não é apenas um site. É um estudo contínuo de engenharia aplicada.

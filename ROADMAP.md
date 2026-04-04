# FIRSTPROJECT – ROADMAP ESTRATÉGICO v4.0
Atualizado em: 04/04/2026
Autor: Jonathas Cunha (Cursando Engenharia de Software - 7° sem.)

---

## 1. Visão Estratégica

Consolidar o firstproject como um portfólio técnico de alto nível, com arquitetura escalável, segurança robusta, automação completa e governança madura.

**Score de maturidade atual: ~7.5/10**
Meta: 8.5+/10

---

## 2. Eixos de Evolução

1. Confiabilidade (Testes + CI)
2. Governança (Padrões + Workflow)
3. Escalabilidade (Arquitetura + Banco)
4. Segurança (Hardening contínuo)
5. Observabilidade (Logs + Monitoramento)
6. Experiência de Contribuição

---

## 3. Fase 1 – Estabilização

### 3.1 Testes Automatizados — CONCLUÍDO

- [x] Testes unitários de componentes críticos
- [x] Testes de integração nas APIs (add-photo, upload-url, delete, whitelist/check)
- [x] Testes de segurança (NoSecrets, NoHardcoded)
- [x] Testes de lib (listPhotosByAlbum com paginação e soft delete)
- [x] 75 testes passando em 14 suites
- [x] `.env.test` com valores fake — sem hardcode no código
- [ ] Relatório de coverage no CI
- [ ] Fail build se coverage < 70%

### 3.2 CI Completo (GitHub Actions) — PENDENTE (issue #8)

Pipeline obrigatório:
```
lint → test → build → security scan
```

Ferramentas planejadas:
- ESLint
- Jest
- npm audit
- Dependabot

Critério de aceite: PR não pode ser mergeado se pipeline falhar.

### 3.3 Padronização de Commits — PENDENTE (issue #10)

- [ ] Commitlint
- [ ] Husky (pre-commit e commit-msg)

Conventional Commits já é adotado — falta automação da validação.

---

## 4. Fase 2 – Arquitetura e Banco

### 4.1 Estrutura por Domínio

Migrar de estrutura técnica para estrutura por feature:

```
/features
  /auth
  /albums
  /admin
  /api
```

Separação clara: domain / services / infra / presentation.

### 4.2 Banco de Dados Estruturado

Atualmente: DynamoDB + S3

Evolução planejada:
- Definir padrão definitivo (manter NoSQL ou migrar para PostgreSQL)
- Implementar migrations formais
- Separar ambientes: dev / staging / production

### 4.3 TypeScript Progressivo

- [ ] Converter arquivos críticos primeiro
- [ ] Tipar API responses
- [ ] Tipar modelos de dados
- [ ] Ativar strict mode

---

## 5. Fase 3 – Segurança Avançada

### 5.1 Hardening — PARCIALMENTE CONCLUÍDO

- [x] Controle de acesso granular por permissão (canUploadPhotos, canDeletePhotos)
- [x] OWNER_EMAIL via variável de ambiente
- [x] Testes automatizados contra hardcode e vazamento de segredos
- [x] Security headers HTTP
- [x] Rate limiting nas APIs
- [ ] CSP estrito
- [ ] Sanitização de inputs
- [ ] Rate limit granular por endpoint (deferred — issue aberta)
- [ ] Logs estruturados persistentes (Pino ou Winston)

### 5.2 Monitoramento

- [ ] Sentry para erros
- [ ] Vercel Analytics
- [ ] Uptime monitor

---

## 6. Fase 4 – Experiência de Contribuição — PARCIALMENTE CONCLUÍDO

- [x] README.md completo
- [x] CONTRIBUTING.md
- [x] ROADMAP.md
- [x] CHANGELOG.md
- [x] CLAUDE.md
- [ ] CODE_OF_CONDUCT.md
- [ ] LICENSE (MIT formal)
- [ ] Templates de Issue e PR no GitHub

---

## 7. Fase 5 – Qualidade Visível

Badges no README:

- [ ] Build passing (GitHub Actions)
- [ ] Coverage
- [ ] License
- [ ] Last commit
- [ ] Deploy status (Vercel)

Meta Lighthouse:

| Métrica | Meta |
|---|---|
| Performance | > 90 |
| Accessibility | > 95 |
| Best Practices | > 95 |
| SEO | > 90 |

---

## 8. Métricas de Maturidade

| Dimensão | Estado atual | Meta |
|---|---|---|
| Testes | 75 testes, ~14 suites | 80% coverage |
| CI/CD | Pendente | 100% automatizado |
| Segurança | Permissões granulares, sem hardcode | Zero high vulnerabilities |
| Documentação | README, ROADMAP, CHANGELOG, CLAUDE.md | 100% dos fluxos críticos |
| Tipagem | JavaScript | 80% em TypeScript |

---

## 9. Visão de Longo Prazo

- Transformar projeto em referência técnica pública
- Publicar artigos técnicos baseados nele
- Usar como base para novos produtos
- Adicionar arquitetura multi-tenant no futuro

---

## 10. Conclusão

O projeto já demonstra maturidade crescente.
O foco agora não é adicionar features — é consolidar engenharia.

Disciplina técnica agora garantirá liberdade no futuro.

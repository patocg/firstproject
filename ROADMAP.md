# FIRSTPROJECT – ROADMAP ESTRATÉGICO v3.0
Atualizado em: 03/03/2026
Autor: jonathas Cunha (Cursando Engenharia de Software - 7° SEM)

---

# 1. VISÃO ESTRATÉGICA

Objetivo do projeto:
Consolidar o firstproject como um portfólio técnico de alto nível, com arquitetura escalável, segurança robusta, automação completa e governança madura.

Meta de maturidade:
Elevar o projeto do nível atual (~6.8/10) para 8.5+ em critérios profissionais de engenharia.

---

# 2. EIXOS DE EVOLUÇÃO

1. Confiabilidade (Testes + CI)
2. Governança (Padrões + Workflow)
3. Escalabilidade (Arquitetura + Banco)
4. Segurança (Hardening contínuo)
5. Observabilidade (Logs + Monitoramento)
6. Experiência de Contribuição

---

# 3. FASE 1 – ESTABILIZAÇÃO (2–3 semanas)

## 3.1 Testes Automatizados (Prioridade Crítica)

- Expandir testes unitários (componentes críticos)
- Testes de integração nas APIs
- Cobertura mínima obrigatória: 75%
- Adicionar relatório de coverage no CI
- Fail build se coverage < 70%

Critério de aceite:
Pipeline bloqueia merge se testes falharem.

---

## 3.2 CI Completo (GitHub Actions)

Pipeline obrigatório:

lint → test → build → security scan

Ferramentas:
- ESLint
- Prettier
- Jest
- npm audit
- Dependabot

Critério de aceite:
PR não pode ser mergeado se pipeline falhar.

---

## 3.3 Padronização de Commits

- Commitlint
- Husky (pre-commit e commit-msg)
- Conventional Commits obrigatório

---

# 4. FASE 2 – ARQUITETURA E BANCO (3–4 semanas)

## 4.1 Estrutura por Domínio

Migrar de estrutura técnica para estrutura por feature:

/features
  /auth
  /albums
  /admin
  /api

Separação clara:
- domain
- services
- infra
- presentation

---

## 4.2 Banco de Dados Estruturado

Atualmente: DynamoDB + S3

Evolução recomendada:
- Definir padrão definitivo (manter NoSQL ou migrar para PostgreSQL)
- Implementar migrations formais
- Separar ambientes:
  - dev
  - staging
  - production

---

## 4.3 TypeScript Progressivo

- Converter arquivos críticos primeiro
- Tipar API responses
- Tipar modelos de dados
- Ativar strict mode

---

# 5. FASE 3 – SEGURANÇA AVANÇADA (2–3 semanas)

## 5.1 Hardening

- CSP estrito
- Sanitização de inputs
- Rate limit granular por endpoint
- Logs estruturados (Pino ou Winston)
- Masking obrigatório de dados sensíveis

---

## 5.2 Monitoramento

- Sentry para erros
- Vercel Analytics
- Uptime monitor
- Logs estruturados persistentes

---

# 6. FASE 4 – EXPERIÊNCIA DE CONTRIBUIÇÃO

- CONTRIBUTING.md completo
- CODE_OF_CONDUCT.md
- LICENSE (MIT)
- Templates de Issue e PR
- Roadmap público atualizado

---

# 7. FASE 5 – QUALIDADE VISÍVEL

Adicionar badges no README:

- Build passing
- Coverage
- License
- Last commit
- Deploy status

Meta Lighthouse:
Performance > 90
Accessibility > 95
Best Practices > 95
SEO > 90

---

# 8. MÉTRICAS DE MATURIDADE

Objetivo final:

| Dimensão | Meta |
|----------|------|
| Testes | 80% coverage |
| CI/CD | 100% automatizado |
| Segurança | Zero high vulnerabilities |
| Documentação | 100% dos fluxos críticos documentados |
| Tipagem | 80% do projeto em TypeScript |

---

# 9. VISÃO DE LONGO PRAZO

- Transformar projeto em referência técnica pública
- Publicar artigos técnicos baseados nele
- Usar como base para novos produtos
- Adicionar arquitetura multi-tenant no futuro

---

# 10. CONCLUSÃO

O projeto já demonstra maturidade crescente.
O foco agora não é adicionar features.
É consolidar engenharia.

Disciplina técnica agora garantirá minha liberdade no futuro.
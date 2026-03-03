# FIRSTPROJECT

Aplicação web desenvolvida com Next.js, integrando AWS (S3 + DynamoDB), autenticação OAuth via Google e controle de acesso baseado em whitelist.

Este projeto evoluiu de um portfólio visual para um laboratório de engenharia focado em arquitetura, segurança, DevOps e governança de código.

Deploy em produção:
https://jnths.com.br

Repositório:
https://github.com/patocg/firstproject

---

# 1. Objetivo do Projeto

O firstproject não é apenas uma vitrine visual.

Ele foi estruturado para demonstrar:

- Arquitetura escalável
- Integração com serviços cloud
- Controle de acesso baseado em regras
- Hardening básico de segurança
- Governança de código
- Preparação para CI/CD e observabilidade

É um projeto orientado à evolução contínua.

---

# 2. Stack Tecnológica

Frontend:
- Next.js
- React

Backend / API:
- Next.js API Routes
- AWS SDK v3

Cloud:
- AWS S3 (armazenamento de assets)
- AWS DynamoDB (controle de acesso / whitelist)

Autenticação:
- NextAuth
- Google OAuth

DevOps:
- Vercel (deploy)
- GitHub (versionamento)
- Jest (testes)
- ESLint + Prettier

---

# 3. Arquitetura

Estrutura atual:
- `components/` → Componentes reutilizáveis
- `lib/` → Camada de acesso a dados e utilitários
- `pages/` → Rotas e API handlers
- `public/` → Assets estáticos
- `tests/` → Testes automatizados
- `docs/` → Documentação técnica`


Separação de responsabilidades:

- UI desacoplada da lógica
- APIs isoladas
- Acesso a dados centralizado em `lib/`
- Regras de autorização documentadas formalmente

---

# 4. Controle de Acesso

Sistema baseado em whitelist armazenada no DynamoDB.

Regras principais:

- Usuário autenticado via Google
- Verificação de status ativo
- Permissão específica para visualização de álbuns
- OWNER_EMAIL definido por variável de ambiente

Documentação completa:
- docs/PERMISSIONS.md
- docs/ADMIN_PAINEL.md

---

# 5. Segurança Implementada

- Security headers HTTP
- Rate limiting nas rotas de API
- Mascaramento de dados sensíveis em logs
- Separação por ambiente via variáveis
- Remoção de console logs em produção
- Logging estruturado

Próximas evoluções planejadas:
- CSP mais restritivo
- Monitoramento de vulnerabilidades automatizado
- Observabilidade com logs persistentes

---

# 6. Testes

Executar testes:
- `npm test`

Meta de cobertura:
70% (em evolução para 80%)

Inclui:
- Testes unitários de componentes críticos
- Testes de integração de APIs

---

# 7. Desenvolvimento Local

Instalação:
- `npm istall`

Rodar em ambiente de desenvolvimento:
- `npm run dev`


Build para produção:
- `npm run build`


---

# 8. Workflow de Branches

Modelo adotado:

- main → Produção
- develop → Homologação
- feature/* → Novas funcionalidades
- fix/* → Correções
- refactor/* → Melhorias estruturais

Commits seguem padrão Conventional Commits.

Exemplo:
- `feat(auth)`: implementa validação de whitelist
- `fix(api)`: corrige tratamento de erro no S3
- `refactor(logging)`: remove console.log em produção


---

# 9. CI/CD e Automação

Pipeline em evolução para incluir:

- Lint obrigatório
- Testes automatizados
- Build validado
- Security scan
- Deploy automático em main

Objetivo:
Nenhum merge com falha de pipeline.

---

# 10. Roadmap

O roadmap estratégico completo está disponível em:

ROADMAP.md

Foco atual:

1. Aumento de cobertura de testes
2. CI/CD completo
3. TypeScript progressivo
4. Modularização por domínio
5. Observabilidade e monitoramento

Meta de maturidade técnica: 8.5+/10

---

# 11. Performance e Qualidade

Metas de qualidade:

- Lighthouse Performance > 90
- Accessibility > 95
- Best Practices > 95
- SEO > 90

---

# 12. Licença

Licença a ser definida (recomendado: MIT).

---

# 13. Posicionamento Técnico

Este projeto demonstra:

- Capacidade de integrar frontend e backend
- Experiência com AWS
- Mentalidade DevOps
- Governança de código
- Evolução arquitetural contínua
- Preocupação com segurança

Não é apenas um site.
É um estudo contínuo de engenharia aplicada.

---

# 14. Próxima Revisão Técnica

Revisão estratégica prevista para:
03/04/2026

Objetivo:
Avaliar evolução da cobertura de testes, pipeline CI/CD e hardening.

---

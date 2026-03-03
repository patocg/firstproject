# CONTRIBUTING

Obrigado por considerar contribuir com este projeto.

Este repositório segue princípios de engenharia orientados à qualidade, segurança e governança de código. Contribuições são bem-vindas desde que respeitem os padrões definidos abaixo.

---

# 1. Visão do Projeto

Este projeto tem como objetivo evoluir como um laboratório técnico de engenharia Fullstack e DevOps, com foco em:

- Arquitetura escalável
- Integração com serviços cloud (AWS)
- Controle de acesso estruturado
- Segurança aplicada
- Governança de código
- Observabilidade e automação
- Monitoramento e métricas claras para rastreamento de uso, erros e performance

Contribuições devem reforçar esses pilares.

---

# 2. Pré-requisitos

Antes de contribuir:

- Node.js conforme definido em `.nvmrc`
- Instalar dependências:

npm install

- Rodar localmente:

npm run dev

- Executar testes:

npm test

Nenhum PR deve ser aberto sem validação local.

---

# 3. Workflow de Branches

Modelo adotado:

- main → produção
- develop → homologação
- feature/* → novas funcionalidades
- fix/* → correções de bugs
- refactor/* → melhorias estruturais
- hotfix/* → correções críticas

Regras:

- Nunca abrir PR direto para `main`
- Sempre criar branch a partir de `develop`
- Nome da branch deve ser descritivo

Exemplo:

feature/auth-whitelist-validation
fix/s3-timeout-error
refactor/logger-structure

---

# 4. Padrão de Commits

Este projeto utiliza Conventional Commits.

Formato:

<tipo>(escopo): descrição

Tipos válidos:

- feat
- fix
- docs
- refactor
- test
- chore
- style

Exemplos:

feat(auth): adiciona validação de whitelist
fix(api): corrige erro de timeout no S3
refactor(logging): remove console.log em produção

Commits genéricos como "update" ou "fix bug" não são aceitos.

---

# 5. Pull Requests

Antes de abrir um PR, verifique:

- Código testado localmente
- Lint sem erros
- Sem console.log em produção
- Testes adicionados (quando aplicável)
- Documentação atualizada se necessário

O PR deve conter:

- Descrição clara do que foi feito
- Motivação técnica
- Impacto esperado
- Referência à issue (se existir)

PRs incompletos poderão ser fechados.

---

# 6. Padrões de Código

- Seguir regras do ESLint
- Manter consistência com Prettier
- Evitar duplicação de lógica
- Manter separação clara de responsabilidades
- Não misturar lógica de UI com acesso a dados

---

# 7. Testes

Contribuições que adicionam funcionalidades devem incluir:

- Testes unitários
- Testes de integração quando necessário

Meta de cobertura mínima: 70% (em evolução para 80%).

---

# 8. Segurança

É proibido:

- Versionar arquivos `.env`
- Expor credenciais
- Inserir dados sensíveis em logs
- Reduzir nível de segurança existente

Qualquer alteração que impacte autenticação, autorização ou dados deve ser explicitamente documentada no PR.

---

# 9. Comunicação

- Grandes mudanças devem ser discutidas via Issue antes da implementação.
- Feedback deve ser técnico e fundamentado.
- Respeito profissional é obrigatório.

---

# 10. Direção Estratégica

Este projeto prioriza:

1. Qualidade sobre velocidade.
2. Clareza arquitetural.
3. Segurança por padrão.
4. Automação antes de escala.

Contribuições devem fortalecer esses princípios.

---

Obrigado por contribuir.
Abs.
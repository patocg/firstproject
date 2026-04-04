# CHANGELOG

Todas as mudanças notáveis deste projeto são documentadas aqui.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [0.3.0] – 2026-04-04

### Segurança
- Controle de acesso granular nas APIs `add-photo`, `upload-url` e `delete`: autenticação obrigatória (401) e verificação de permissões granulares (`canUploadPhotos`, `canDeletePhotos`) via DynamoDB
- `OWNER_EMAIL` centralizado em `process.env.OWNER_EMAIL` em todos os handlers — nenhum e-mail hardcoded no código

### Corrigido
- `whitelist/list`: substituído scan único por loop de paginação com `LastEvaluatedKey` — garante retorno de todos os registros independente do volume
- `list-albums`: removido dead code inalcançável no bloco `catch`
- `list`: corrigido prefixo S3 de `album/` para `albuns/`

### Testes
- 75 testes passando em 14 suites
- Novos testes de API: `AddPhoto`, `UploadUrl`, `Delete`, `WhitelistCheck` (8 casos cada)
- Novos testes de lib: `listPhotosByAlbum` com paginação e soft delete
- Novos testes de segurança: `NoSecrets` e `NoHardcoded`
- `.env.test` criado com valores fake — sem hardcode em `jest.setup.js`

---

## [0.2.0] – 2026-03-03

### Adicionado
- Matriz de permissões granulares: `canViewAlbums`, `canUploadPhotos`, `canDeletePhotos`, `canEditProfile`, `isActive`
- Painel administrativo para o owner
- Documentação de permissões (`docs/PERMISSIONS.md`, `docs/ADMIN_PAINEL.md`)
- README.md reestruturado com roadmap e guia de contribuição
- CONTRIBUTING.md
- ROADMAP.md v3.0

### Corrigido
- Declaração duplicada de `isOwner` em `albumCode`
- Paginação no DynamoDB Scan/Query

### Segurança
- Security headers HTTP reforçados (CSP, HSTS, X-Frame-Options)
- Rate limiting nas rotas de autenticação

---

## [0.1.0] – 2026-01-01

### Adicionado
- Autenticação via Google OAuth (NextAuth v4)
- Whitelist de acesso armazenada no DynamoDB
- Upload de fotos para AWS S3 com presigned URLs
- Galeria de álbuns integrada ao DynamoDB
- Portfólio visual: HeroSection, AboutSection, SkillsSection, StatsSection, ProjectsSection
- Refatoração para componentes isolados
- Primeiros testes com Jest + React Testing Library
- AWS SDK v3 (DynamoDB + S3)
- Deploy contínuo na Vercel

---

[0.3.0]: https://github.com/patocg/firstproject/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/patocg/firstproject/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/patocg/firstproject/releases/tag/v0.1.0

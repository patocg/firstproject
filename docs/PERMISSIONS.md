
# 📜 Matriz de Permissões - Sistema de Whitelist

> **Descrição:** Documentação técnica do sistema de controle de acesso e permissões granulares para o álbum de fotos privado.
>
> **Última atualização:** Março de 2026
>
> **Responsável:** Jonathas Cunha

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Princípios de Design](#-princípios-de-design)
3. [Estrutura da Tabela](#estrutura-da-tabela)
4. [Regras de Negócio](#-regras-de-negócio)
   - [Owner (Dono do Projeto)](#-owner-dono-do-projeto)
   - [Usuários na Whitelist](#-usuários-na-whitelist)
   - [Usuários Fora da Whitelist](#-usuários-fora-da-whitelist)
5. [Fluxo de Decisão](#-fluxo-de-decisão)
6. [API Reference](#-api-reference)
   - [Endpoint: Verificar Permissões](#endpoint-verificar-permissões)
   - [Endpoint: Listar Whitelist](#endpoint-listar-whitelist)
   - [Endpoint: Adicionar Usuário](#endpoint-adicionar-usuário)
   - [Endpoint: Atualizar Permissões](#endpoint-atualizar-permissões)
   - [Endpoint: Remover Usuário](#endpoint-remover-usuário)
7. [Exemplos Práticos](#-exemplos-práticos)
8. [Operações Painel Administrativo](#operações-painel-administrativo)
   - [Acesso ao Painel](#-acesso-ao-painel)
   - [Adicionar Novo Usuário](#-adicionar-novo-usuário)
   - [Gerenciar Permissões](#gerenciar-permissões-matriz)
   - [Excluir Usuários](#excluir-usuários)
   - [Troubleshooting](#-troubleshooting)
9. [Auditoria e Logs](#-auditoria-e-logs)
10. [Variáveis de Ambiente](#variáveis-de-ambiente)
11. [FAQ](#-faq)
12. [Referências Relacionadas](#-referências-relacionadas)

### Documentos Relacionados

- [Painel Administrativo - UI e Estados](/docs/ADMIN_PAINEL.md)
- [README do Projeto](/README.md)

---

## Visão Geral
O sistema de permissões controla o **acesso dos usuários ao álbum de fotos privado**. Cada usuário na whitelist tem permissões granulares definidas no **Amazon DynamoDB**, permitindo controle fino sobre operações de visualização, upload, exclusão e edição.

## 🔑 Princípios de Design

| Princípio | Descrição |
|-----------|-----------|
| **Least Privilege** | Usuários começam com permissões mínimas (default `false`) |
| **Fail Secure** | Ausência de registro = acesso negado |
| **Owner Override** | Dono do projeto tem acesso irrestrito sempre |
| **Audit Trail** | Todas as tentativas de acesso são logadas |
| **Default Deny** | Negação por padrão |

---

## Estrutura da Tabela
### Configuração

| Propriedade | Valor |
|-------------|-------|
| **Nome da tabela** | `DYNAMO_TABLE_WHITELIST` (variável de ambiente) |
| **Partition Key (PK)** | `email` (String, lowercase) |
| **Sort Key (SK)** | _(opcional, não utilizado)_ |
| **Região AWS** | `AWS_REGION` (variável de ambiente) |

### Schema dos Campos
| Campo | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| `email` | String | — | Email do usuário (lowercase) |
| `name` | String | — | Nome completo do usuário |
| `isActive` | Boolean | `true` | Status de ativação |
| `canViewAlbums` | Boolean | `true` | Permissão de visualização |
| `canUploadPhotos` | Boolean | `false` | Permissão de upload |
| `canDeletePhotos` | Boolean | `false` | Permissão de exclusão |
| `canEditProfile` | Boolean | `false` | Permissão de edição |

### Exemplo de Item no DynamoDB
```json
{
  "email": "usuario@example.com",
  "name": "Usuário Teste",
  "isActive": true,
  "canViewAlbums": true,
  "canUploadPhotos": false,
  "canDeletePhotos": false,
  "canEditProfile": false
}
```
## 📋 Regras de Negócio
### 🏆 Owner (Dono do Projeto)
O dono tem acesso total e irrestrito, independente da whitelist.

Implementação
```js
// Constante definida via .env
const OWNER_EMAIL = process.env.OWNER_EMAIL || "";

// Verificação de owner
if (email.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
  return {
    allowed: true,
    owner: true,
    permissions: {
      isActive: true,
      canViewAlbums: true,
      canUploadPhotos: true,
      canDeletePhotos: true,
      canEditProfile: true,
    },
  };
}
```
Configuração
| Variável    | Valor de Exemplo  | Obrigatório |
| ----------- | ----------------- | ----------- |
| OWNER_EMAIL | owner@example.com | ✅ Sim       |

⚠️ Importante: Apenas um email pode ser definido como owner. Para múltiplos administradores, adicione-os na whitelist com todas as permissões habilitadas.
---

### 👥 Usuários na Whitelist
Regras de Avaliação
| # | Regra                     | Descrição                          |
| - | ------------------------- | ---------------------------------- |
| 1 | `isActive === false`        | ❌ Acesso negado (bloqueia tudo)    |
| 2 | `canViewAlbums === false `  | ❌ Acesso negado (sem visualização) |
| 3 | `isActive && canViewAlbums` | ✅ Acesso permitido                 |
| 4 | Registro inexistente      | ❌ Acesso negado                    |

Fórmula de Acesso
```js
allowed = isActive AND canViewAlbums
```
Defaults Seguros
Campos ausentes ou `undefined` são tratados com defaults conservadores:

```js
const permissions = {
  isActive: item.isActive !== false,           // ✅ default: true
  canViewAlbums: item.canViewAlbums !== false, // ✅ default: true
  canUploadPhotos: item.canUploadPhotos === true,  // ⚠️ default: false
  canDeletePhotos: item.canDeletePhotos === true,  // ⚠️ default: false
  canEditProfile: item.canEditProfile === true,    // ⚠️ default: false
};
```
📝 Nota: Permissões de escrita (`upload`, `delete`, `edit`) requerem habilitação explícita (`=== true`).
---

### 🚫 Usuários Fora da Whitelist
Usuários não cadastrados na tabela não têm acesso.

Resposta Padrão
```js
{
  "allowed": false,
  "owner": false,
  "permissions": null
}
```
Comportamento do Sistema
1. ❌ Acesso à API negado (HTTP 200 com allowed: false)
2. 📝 Log registrado em DYNAMO_TABLE_AUTH_DENIED
3. 🔄 Frontend redireciona para página de login
4. 🔔 Admin pode ser notificado (se implementado)
---

## 🔄 Fluxo de Decisão
```
┌─────────────────────────────────────────────────────────────────────────┐
│  📥 POST /api/whitelist/check                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │  Email é o Owner?            │
                    └──────────────────────────────┘
                           │                    │
                      ✅ Sim │                    │ ❌ Não
                           ▼                    ▼
              ┌─────────────────────┐  ┌──────────────────────────┐
              │  🔑 Acesso Total    │  │  Existe na Whitelist?    │
              │  owner: true        │  └──────────────────────────┘
              │  Todas permissões   │         │              │
              └─────────────────────┘      ✅ Sim │              │ ❌ Não
                                           ▼              ▼
                                  ┌────────────────┐  ┌─────────────────┐
                                  │  isActive?     │  │  🚫 Acesso      │
                                  └────────────────┘  │  Negado         │
                                         │            └─────────────────┘
                                    ✅ Sim │
                                           ▼
                                  ┌────────────────┐
                                  │  canViewAlbums?│
                                  └────────────────┘
                                         │
                                    ✅ Sim │
                                           ▼
                                  ┌─────────────────┐
                                  │  ✅ Acesso      │
                                  │  Permitido      │
                                  │  + permissions  │
                                  └─────────────────┘
```
Tabela de Decisão Completa
| isActive  | canViewAlbums | canUpload | canDelete | canEdit | allowed | Situação           |
| --------- | ------------- | --------- | --------- | ------- | ------- | ------------------ |
| ✅ `true`    | ✅ `true`        | `*`         | `*`         | `*`       | ✅ `true`  | Acesso permitido   |
| ✅ `true`    | ❌ `false`       | `*`         | `*`         | `*`       | ❌ `false` | Sem visualização   |
| ❌ `false`   | ✅ `true`        | `*`         | `*`         | `*`       | ❌ `false` | Usuário inativo    |
| ❌ `false`   | ❌ `false`       | `*`         | `*`         | `*`       | ❌ `false` | Inativo + sem view |
| `undefined` | `undefined`     | `false`     | `false`     | `false`   | ✅ `true`  | Defaults aplicados |
| N/A       | N/A           | N/A       | N/A       | N/A     | ❌ `false` | Fora da whitelist  |
`*` = valor irrelevante para decisão de `allowed`
---

## 🔌 API Reference
### Endpoint: Verificar Permissões
```text
POST /api/whitelist/check
```
### Autenticação
Requisito	Status
| Requisito           | Status        |
| ------------------- | ------------- |
| Session NextAuth    | ✅ Obrigatória |
| Usuário autenticado | ✅ Obrigatório |

### 📥 Request Body

```json
{
  "email": "usuario@example.com"
}
```

| Campo | Tipo   | Obrigatório | Descrição                       |
| ----- | ------ | ----------- | ------------------------------- |
| email | String | ✅ Sim      | Email do usuário para verificar |


### 📤 Responses
### ✅ Sucesso - Usuário na Whitelist
HTTP 200
```json
{
  "allowed": true,
  "owner": false,
  "permissions": {
    "isActive": true,
    "canViewAlbums": true,
    "canUploadPhotos": false,
    "canDeletePhotos": false,
    "canEditProfile": false
  }
}
```
### 👑 Sucesso - Owner
HTTP 200
```json
{
  "allowed": true,
  "owner": true,
  "permissions": {
    "isActive": true,
    "canViewAlbums": true,
    "canUploadPhotos": true,
    "canDeletePhotos": true,
    "canEditProfile": true
  }
}
```
### 🚫 Acesso Negado - Fora da Whitelist
HTTP 200
```json
{
  "allowed": false,
  "owner": false,
  "permissions": null
}
```
### ❌ Erro - Configuração Ausente
HTTP 500
```json
{
  "error": "Configuração de tabela da whitelist ausente"
}
```
### ⚠️ Erro - Não Autenticado
HTTP 401
```json
{
  "error": "Not authenticated"
}
```
### ⚠️ Erro - Método Inválido
HTTP 405
```json
{
  "error": "Method not allowed"
}
```

---

## 📚 Exemplos Práticos
### Cenário 1: Owner Acessando
Registro: Não necessário (owner é definido por variável de ambiente)

Request:
```text
POST /api/whitelist/check
{
  "email": "owner@example.com"
}
```
Response:
```json
{
  "allowed": true,
  "owner": true,
  "permissions": {
    "isActive": true,
    "canViewAlbums": true,
    "canUploadPhotos": true,
    "canDeletePhotos": true,
    "canEditProfile": true
  }
}
```
---
### Cenário 2: Usuário com Acesso Completo
Registro no DynamoDB:
```json
{
  "email": "maria@example.com",
  "isActive": true,
  "canViewAlbums": true,
  "canUploadPhotos": true,
  "canDeletePhotos": true,
  "canEditProfile": true
}
```
Response:
```json
{
  "allowed": true,
  "owner": false,
  "permissions": {
    "isActive": true,
    "canViewAlbums": true,
    "canUploadPhotos": true,
    "canDeletePhotos": true,
    "canEditProfile": true
  }
}
```
---
### Cenário 3: Usuário Apenas Leitura
Registro no DynamoDB:
```json
{
  "email": "joao@example.com",
  "isActive": true,
  "canViewAlbums": true,
  "canUploadPhotos": false,
  "canDeletePhotos": false,
  "canEditProfile": false
}
```
Response:
```json
{
  "allowed": true,
  "owner": false,
  "permissions": {
    "isActive": true,
    "canViewAlbums": true,
    "canUploadPhotos": false,
    "canDeletePhotos": false,
    "canEditProfile": false
  }
}
```
---
### Cenário 4: Usuário Inativo (Bloqueado)
Registro no DynamoDB:
```json
{
  "email": "exemplo@example.com",
  "isActive": false,
  "canViewAlbums": true,
  "canUploadPhotos": true,
  "canDeletePhotos": true,
  "canEditProfile": true
}
```
Response:
```json
{
  "allowed": false,
  "owner": false,
  "permissions": {
    "isActive": false,
    "canViewAlbums": true,
    "canUploadPhotos": true,
    "canDeletePhotos": true,
    "canEditProfile": true
  }
}
```
Nota: Mesmo com todas as permissões habilitadas, `isActive: false` bloqueia o acesso.

---
### Cenário 5: Usuário Não Cadastrado
Request:
```text
POST /api/whitelist/check
{
  "email": "desconhecido@example.com"
}
```
Response:
```json
{
  "allowed": false,
  "owner": false,
  "permissions": null
}
```
---
### Cenário 6: Registro Antigo (Campos Ausentes)
Registro no DynamoDB (legado):
```json
{
  "email": "legacy@example.com",
  "isActive": true
}
```
Response (com defaults aplicados):
```json
{
  "allowed": true,
  "owner": false,
  "permissions": {
    "isActive": true,
    "canViewAlbums": true,
    "canUploadPhotos": false,
    "canDeletePhotos": false,
    "canEditProfile": false
  }
}
```
---

### Endpoint: Listar Whitelist

```text
GET /api/whitelist/list
```

#### 🔐 Autenticação

| Requisito | Status |
|-----------|--------|
| Session NextAuth | ✅ Obrigatória |
| Usuário autenticado + Owner | ✅ Obrigatório |

#### 📤 Response de Sucesso (200)

```json
{
  "items": [
    {
      "name": "Maria Silva",
      "email": "maria@example.com",
      "isActive": true,
      "canViewAlbums": true,
      "canUploadPhotos": false,
      "canDeletePhotos": false,
      "canEditProfile": false,
      "lastLoginAt": "2026-03-02T23:15:00.000Z"
    }
  ]
}
```
Response Erro(500)
```json
{
  "error": "Falha ao carregar whitelist"
}
```
---
### Endpoint: Adicionar Usuário
```text
POST /api/whitelist/add
Content-Type: application/json
```
🔐 Autenticação
| Requisito                   | Status        |
| --------------------------- | ------------- |
| Session NextAuth            | ✅ Obrigatória |
| Usuário autenticado + Owner | ✅ Obrigatório |

📥 Request Body
```json`
{
  "name": "João Santos",
  "email": "joao@example.com"
}
```
| Campo | Tipo   | Obrigatório | Descrição                         |
| ----- | ------ | ----------- | --------------------------------- |
| name  | String | ✅ Sim       | Nome completo do usuário          |
| email | String | ✅ Sim       | Email (convertido para lowercase) |

📤 Response de Sucesso (201)
```json
{
  "message": "Usuário adicionado à whitelist com sucesso"
}
```
📤 Response de Erro (400)
```json
{
  "error": "Email já existe na whitelist"
}
```
Validações
- ✅ name: Obrigatório, não vazio
- ✅ email: Obrigatório, formato válido
- ✅ email: Não pode existir na whitelist
---

### Endpoint: Atualizar Permissões
```text
POST /api/whitelist/update
Content-Type: application/json
```
🔐 Autenticação
| Requisito                   | Status        |
| --------------------------- | ------------- |
| Session NextAuth            | ✅ Obrigatória |
| Usuário autenticado + Owner | ✅ Obrigatório |

📥 Request Body
```json
{
  "email": "maria@example.com",
  "patch": {
    "isActive": true,
    "canViewAlbums": true,
    "canUploadPhotos": false,
    "canDeletePhotos": false,
    "canEditProfile": false
  }
}
```
| Campo | Tipo   | Obrigatório | Descrição                     |
| ----- | ------ | ----------- | ----------------------------- |
| email | String | ✅ Sim       | Email do usuário (chave)      |
| patch | Object | ✅ Sim       | Objeto com campos a atualizar |

📤 Response de Sucesso (200)
```json
{
  "message": "Permissões atualizadas com sucesso"
}
```
📤 Response de Erro (404)
```json
{
  "error": "Usuário não encontrado"
}
```
Notas
- O campo patch contém apenas os campos alterados (partial update)
- O backend aplica regras de consistência automaticamente
- Ver Regras de Consistência (ver qual link usar aqui)
---
### Endpoint: Remover Usuário
```text
POST /api/whitelist/remove
Content-Type: application/json
```
🔐 Autenticação
| Requisito                   | Status        |
| --------------------------- | ------------- |
| Session NextAuth            | ✅ Obrigatória |
| Usuário autenticado + Owner | ✅ Obrigatório |

📥 Request Body
```json
{
  "email": "joao@example.com"
}
```
| Campo | Tipo   | Obrigatório | Descrição                  |
| ----- | ------ | ----------- | -------------------------- |
| email | String | ✅ Sim       | Email do usuário a remover |

📤 Response de Sucesso (200)
```json
{
  "message": "Usuário removido da whitelist"
}
```
📤 Response de Erro (404)
```json
{
  "error": "Usuário não encontrado"
}
```
Notas
- A remoção é definitiva (não há soft delete)
- O usuário perde acesso imediatamente
- Confirmação é feita no frontend via window.confirm

---

## Operações Painel Administrativo
### ⚠️ Importante

O gerenciamento da whitelist é realizado **exclusivamente via Painel Administrativo Embutido**.

Esta documentação cobre **apenas regras de negócio e APIs**. Para detalhes de **interface, estados, responsividade e testes**, consulte:

👉 **[Documentação do Painel Administrativo](/docs/ADMIN_PAINEL.md)**

### O Que Você Vai Encontrar

| Documento | Conteúdo |
|-----------|----------|
| **[PERMISSIONS.md](/docs/PERMISSIONS.md)** | Regras de negócio, estrutura de dados, APIs, exemplos |
| **[ADMIN_PAINEL.md](/docs/ADMIN_PAINEL.md)** | UI, estados, fluxos, responsividade, testes de interface |

---

## 🔐 Acesso ao Painel

| Requisito | Descrição |
|-----------|-----------|
| **Owner Email** | Deve ser o mesmo definido em `OWNER_EMAIL` no `.env` |
| **Autenticação** | Login válido com Google OAuth via NextAuth |
| **Permissão** | Automática para o owner (campo `owner: true` na resposta da whitelist) |

#### Como Acessar

1. Faça login no sistema com a conta do **Owner** em `/album`
2. Após carregar a lista de álbuns, localize o botão **"Área administrativa"** no header
3. Clique no botão para abrir o overlay de matriz de permissões

> **🔒 Segurança:** O botão "Área administrativa" **só é renderizado** se `isOwner === true`. Usuários não-owner não veem nenhuma opção de administração.

---

### 📊 Visão Geral do Painel

O painel administrativo é um **overlay em tela cheia** (90vw x 90vh) que cobre a página de álbuns, contendo:

| Seção | Descrição |
|-------|-----------|
| **Formulário de Adição** | Campos para adicionar novo usuário (nome + email) |
| **Barra de Ações** | Contador de selecionados + botão "Excluir selecionados" |
| **Matriz de Permissões** | Tabela grid com todos os usuários e suas permissões |
| **Feedback** | Mensagens de sucesso/erro das operações |

---

## ➕ Adicionar Novo Usuário
### Interface

O formulário está localizado no topo do painel:
```
┌─────────────────────────────────────────────────────────────┐
│ [Nome completo] [E-mail] [Adicionar à whitelist] │
└─────────────────────────────────────────────────────────────┘
```

### Passo a Passo

1. No campo **"Nome completo"**, digite o nome do usuário
2. No campo **"E-mail"**, digite o email (será convertido automaticamente para lowercase)
3. Clique em **"Adicionar à whitelist"**

### Validações

| Campo | Validação |
|-------|-----------|
| `Nome` | ✅ Obrigatório (não pode ser vazio após trim) |
| `Email` | ✅ Obrigatório (não pode ser vazio após trim) |

### Defaults ao Criar

Quando um usuário é adicionado via API (`/api/whitelist/add`), recebe as seguintes permissões padrão:

| Permissão | Valor Padrão |
|-----------|--------------|
| `isActive` | ✅ `true` |
| `canViewAlbums` | ✅ `true` |
| `canUploadPhotos` | ❌ `false` |
| `canDeletePhotos` | ❌ `false` |
| `canEditProfile` | ❌ `false` |

> **📝 Nota:** Novos usuários nascem **ativos e com acesso de leitura**, mas sem permissões de escrita.

### Feedback Visual

- **Sucesso:** Mensagem verde *"Usuário adicionado à whitelist com sucesso."*
- **Erro:** Mensagem vermelha com descrição do erro
- A matriz é **atualizada automaticamente** após adição

---

## Gerenciar Permissões Matriz
### Estrutura da Matriz

A tabela exibe **9 colunas**:

| # | Coluna | Descrição |
|---|--------|-----------|
| 1 | **Checkbox** | Seleção para exclusão em lote |
| 2 | **Nome** | Nome completo do usuário |
| 3 | **E-mail** | Email do usuário (sempre em lowercase) |
| 4 | **Último login** | Data/hora do último acesso (ou "—") |
| 5 | **Status** | Bolinha verde/vermelha (ativo/inativo) |
| 6 | **Acesso aos álbuns** | Botão "Permitido/Bloqueado" |
| 7 | **Excluir fotos** | Botão "Permitido/Bloqueado" |
| 8 | **Upload** | Botão "Permitido/Bloqueado" |
| 9 | **Alteração cadastro** | Botão "Permitido/Bloqueado" |

---

### 🟢🔴 Alternar Status (Ativo/Inativo)

**Interface:**
- Coluna **"Status"** → Bolinha colorida
- 🟢 **Verde** (`#22c55e`) = Usuário **ativo**
- 🔴 **Vermelho** (`#dc2626`) = Usuário **inativo**

**Como Alternar:**
1. Clique na **bolinha de status** do usuário desejado
2. A alteração é **enviada automaticamente** para a API `/api/whitelist/update`
3. A matriz é **recarregada** para refletir a mudança

**Regras de Negócio da Alternância:**

**Ao DESATIVAR (verde → vermelho):**
```javascript
patch = {
  isActive: false,
  canViewAlbums: false,
  canUploadPhotos: false,
  canDeletePhotos: false,
  canEditProfile: false
}
```
Efeito: Usuário perde todas as permissões imediatamente.

Ao ATIVAR (vermelho → verde):
```javascript
patch = {
  isActive: true,
  canViewAlbums: true,
  canUploadPhotos: false,
  canDeletePhotos: false,
  canEditProfile: false
}
```
Efeito: Usuário ganha acesso de leitura, mas mantém permissões de escrita desligadas.

---

### 🔓🔒 Alternar Permissões Individuais
Interface:
- Colunas 6-9 → Botões arredondados
- 🟢 "Permitido" (fundo verde claro, texto verde, borda verde)
- 🔴 "Bloqueado" (fundo vermelho claro, texto vermelho, borda vermelha)

Como Alternar:
1. Clique no botão da permissão desejada
2. O estado alterna entre "Permitido" ↔ "Bloqueado"
3. A alteração é enviada automaticamente para a API
4. A matriz é recarregada

---

### 📜 Regras de Consistência das Permissões

O sistema aplica regras de negócio automáticas para manter consistência:

Regra 1: Desligar canViewAlbums
```javascript
if (campo === "canViewAlbums" && nextValue === false) {
  patch = {
    canViewAlbums: false,
    isActive: false,              // ❌ Desativa usuário
    canUploadPhotos: false,
    canDeletePhotos: false,
    canEditProfile: false
  }
}
```
Efeito: Bloquear visualização desativa automaticamente o usuário e remove todas as outras permissões.
Regra 2: Ligar `canViewAlbums`
```javascript
if (campo === "canViewAlbums" && nextValue === true) {
  patch = {
    canViewAlbums: true,
    isActive: true                // ✅ Ativa usuário
  }
}
```
Efeito: Permitir visualização ativa automaticamente o usuário (se estava inativo).

Regra 3: Ligar Permissões de Escrita com Usuário Inativo

```javascript
if (
  ["canUploadPhotos", "canDeletePhotos", "canEditProfile"].includes(campo) &&
  nextValue === true &&
  entry.isActive === false
) {
  patch = {
    [campo]: true,
    isActive: true,               // ✅ Ativa usuário
    canViewAlbums: true           // ✅ Garante visualização
  }
}
```
Efeito: Habilitar upload/exclusão/edição em usuário inativo automaticamente:
 - ✅ Ativa o usuário
 - ✅ Garante acesso aos álbuns
 - ✅ Mantém a permissão solicitada
 
 📝 Lógica: Não faz sentido ter permissão de escrita sem poder ver os álbuns.

---

## Excluir Usuários
### Método 1: Exclusão em Lote (Recomendado)
Passo a passo:
1. Marque os checkboxes na coluna 1 dos usuários que deseja excluir
    - Ou use o checkbox do cabeçalho para selecionar todos
2. O contador na barra de ações mostrará: "Selecionados: X"
3. Clique em "Excluir selecionados"
4. Confirme a ação no modal do navegador:
     - 1 usuário: "Remover [`email`] da whitelist?"
     - Múltiplos: "Remover X usuários da whitelist?"
5. A exclusão será processada usuário por usuário via API /api/whitelist/remove
6. A matriz é atualizada automaticamente

Comportamento:
- ❌ Acesso do usuário é revogado imediatamente
- 📝 Registro é removido do DynamoDB
- 🔄 Usuário será redirecionado para login ao tentar acessar

---

### Método 2: Exclusão Individual (Alternativa)

⚠️ Nota: Atualmente não há botão "Excluir" por linha. A exclusão deve ser feita via seleção em lote (mesmo que seja 1 usuário).

---

🔍 Funcionalidades da Matriz

Ordenação

    ⚠️ Não implementado: A matriz exibe usuários na ordem retornada pela API (provavelmente ordem de criação ou alfabética por email - preciso ajustar isso).

Filtros

    ⚠️ Não implementado: Não há filtros por status, permissões ou busca por nome/email. (feat futura)

Paginação

    ⚠️ Não implementado: Todos os usuários são carregados de uma vez. Para whitelists muito grandes (>100 usuários), considere implementar paginação. (ainda não vi necessidade de implementar isso agora, feat futura)

📝 Nota: Para detalhes completos sobre interface, estados e testes do painel, consulte a Documentação do Painel Administrativo.

---

🔄 Atualização em Tempo Real
Recarregamento da Matriz
A matriz é recarregada automaticamente após:
- ✅ Adicionar usuário
- ✅ Alternar status (ativo/inativo)
- ✅ Alternar qualquer permissão
- ✅ Excluir usuário(s)

Como funciona:
```javascript
await fetch("/api/whitelist/update", { ... });
await fetchWhitelist();  // ← Recarrega toda a lista
```
⚡ Atenção: Não há WebSocket ou polling. Alterações feitas em outras abas/dispositivos só serão visíveis após recarregar manualmente o painel (fechar e abrir novamente).

---

📋 Exportar Lista de Usuários

    ⚠️ Não implementado: Não há funcionalidade de exportação (CSV/JSON) no painel atual.

Workaround:
1. Abra o Console do Desenvolvedor (F12)
2. Vá na aba Network
3. Recarregue a whitelist
4. Clique na requisição /api/whitelist/list
5. Copie o JSON da resposta
6. Use um conversor JSON → CSV se necessário

---

🚫 O Que Não É Possível Fazer
| Ação                              | Status              | Motivo                                          |
| --------------------------------- | ------------------- | ----------------------------------------------- |
| Adicionar usuário via API externa | ❌ Bloqueado         | Apenas via painel                               |
| Usuário não-owner gerenciar       | ❌ Bloqueado         | Verificação isOwner no backend                  |
| Importação em lote (CSV/JSON)     | ⚠️ Não implementado | Requer desenvolvimento                          |
| Busca/filtro na matriz            | ⚠️ Não implementado | Requer desenvolvimento                          |
| Ordenação customizada             | ⚠️ Não implementado | Requer desenvolvimento                          |
| Exportação CSV/JSON               | ⚠️ Não implementado | Requer desenvolvimento                          |
| Desfazer última ação              | ⚠️ Não implementado | Requer desenvolvimento                          |
| Histórico de alterações           | ⚠️ Não implementado | Logs existem no backend, mas não visíveis no UI |

---

🛡️ Boas Práticas
✅ Recomendado
 - [ ] Revisar permissões de escrita antes de habilitar (upload/exclusão)
 - [ ] Desativar antes de excluir se quiser manter histórico (alternativa: exportar backup manual)
 - [ ] Monitorar o último login para identificar usuários inativos há muito tempo
 - [ ] Teste com usuário de prova antes de liberar acesso em produção
 - [ ] Use emails corporativos para facilitar identificação

❌ Evitar
 - [ ] Dar permissão de exclusão para usuários temporários ou pouco confiáveis
 - [ ] Compartilhar credenciais do Owner para terceiros gerenciarem
 - [ ] Habilitar todas as permissões sem necessidade real
 - [ ] Ignorar mensagens de erro ao adicionar/atualizar (pode indicar problemas na API)

## 🆘 Troubleshooting
Problema: Botão "Área administrativa" não aparece
Causas possíveis:
1. Usuário logado não é o owner definido em OWNER_EMAIL
2. Sessão NextAuth expirou
3. Variável OWNER_EMAIL não configurada no .env

Solução:
```
1. Verifique no terminal se OWNER_EMAIL está definido
2. Faça logout e login novamente com a conta correta
3. Verifique no console do navegador se há erros de autenticação
4. Confirme que o email da sessão bate com OWNER_EMAIL
```

---

Problema: Alteração de permissão não surte efeito
Causas possíveis:

Falha na API `/api/whitelist/update` (verifique console)

Permissão de IAM insuficiente no DynamoDB

Variáveis de ambiente ausentes (`DYNAMO_TABLE_WHITELIST`)

Solução:

```
1. Abra o Console (F12) → aba Network
2. Clique na permissão e observe a requisição POST
3. Verifique se retornou 200 OK ou erro (4xx/5xx)
4. Se erro 500, verifique logs da API (Vercel ou local)
5. Recarregue o painel (feche e abra novamente)
```

---

Problema: Usuário excluído ainda consegue acessar
Causas possíveis:
1. Sessão ativa do usuário ainda válida
2. Cache de frontend com dados antigos

Solução:

```
1. Peça para o usuário fazer logout e login novamente
2. Se persistir, invalide a sessão no NextAuth (se implementado)
3. Verifique se a exclusão foi registrada no DynamoDB
```

---

Problema: Mensagem de erro ao adicionar usuário
Causas possíveis:
1. Email já existe na whitelist
2. Falha de conexão com DynamoDB
3. Validação de email falhou no backend

Solução:

```
1. Verifique se o email já está na matriz
2. Confira a ortografia do email
3. Verifique logs da API `/api/whitelist/add`
4. Tente novamente após alguns segundos
```

---

📊 Estrutura de Dados da Whitelist

Schema Retornado pela API

A API `/api/whitelist/list` retorna um array de objetos com a seguinte estrutura:

```javascript
interface WhitelistEntry {
  name: string;           // Nome completo do usuário
  email: string;          // Email em lowercase (PK no DynamoDB)
  isActive: boolean;      // Status de ativação
  canViewAlbums: boolean; // Permissão de visualização
  canUploadPhotos: boolean; // Permissão de upload
  canDeletePhotos: boolean; // Permissão de exclusão
  canEditProfile: boolean;  // Permissão de edição
  lastLoginAt?: string;   // Data do último login (ISO 8601) ou "—"
  createdAt?: string;     // Data de criação (se disponível)
  updatedAt?: string;     // Data da última atualização (se disponível)
}
```
Exemplo de Registro
```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "isActive": true,
  "canViewAlbums": true,
  "canUploadPhotos": false,
  "canDeletePhotos": false,
  "canEditProfile": false,
  "lastLoginAt": "2026-03-02T23:15:00.000Z",
  "createdAt": "2026-01-15T10:30:00.000Z",
  "updatedAt": "2026-03-01T14:20:00.000Z"
}
```
Mapeamento DynamoDB → Frontend
| Campo no DynamoDB      | Campo no Frontend | Transformação                      |
| ---------------------- | ----------------- | ---------------------------------- |
| PK (email)             | email             | Mantido em lowercase               |
| name (S)               | name              | Nenhum                             |
| isActive (BOOL)        | isActive          | Nenhum                             |
| canViewAlbums (BOOL)   | canViewAlbums     | Nenhum                             |
| canUploadPhotos (BOOL) | canUploadPhotos   | Nenhum                             |
| canDeletePhotos (BOOL) | canDeletePhotos   | Nenhum                             |
| canEditProfile (BOOL)  | canEditProfile    | Nenhum                             |
| lastLoginAt (S)        | lastLoginAt       | ISO 8601 → String formatada ou "—" |

---

🔧 APIs Utilizadas pelo Painel

O painel administrativo consome 4 endpoints principais:
| Endpoint              | Método | Finalidade                                |
| --------------------- | ------ | ----------------------------------------- |
| `/api/whitelist/list `  | GET    | Listar todos os usuários da whitelist     |
| `/api/whitelist/add`    | POST   | Adicionar novo usuário                    |
| `/api/whitelist/update` | POST   | Atualizar permissões de usuário existente |
| `/api/whitelist/remove` | POST   | Remover usuário da whitelist              |

---

1. Listar Whitelist
Requisição:

```
GET /api/whitelist/list
```
Resposta de Sucesso (200):

```json
{
  "items": [
    {
      "name": "Maria Silva",
      "email": "maria@example.com",
      "isActive": true,
      "canViewAlbums": true,
      "canUploadPhotos": false,
      "canDeletePhotos": false,
      "canEditProfile": false,
      "lastLoginAt": "2026-03-02T23:15:00.000Z"
    }
  ]
}
```
Resposta de Erro (500):

```json
{
  "error": "Falha ao carregar whitelist"
}
```

---

2. Adicionar Usuário
Requisição:

```text
POST /api/whitelist/add
Content-Type: application/json

{
  "name": "João Santos",
  "email": "joao@example.com"
}
```

Resposta de Sucesso (200/201):

```json
{
  "message": "Usuário adicionado à whitelist com sucesso"
}
```
Resposta de Erro (400/500):

```json
{
  "error": "Email já existe na whitelist"
}
```
Validações do Backend:
- ✅ name: Obrigatório, não vazio
- ✅ email: Obrigatório, formato válido, convertido para lowercase
- ✅ email: Não pode existir já na whitelist

---

3. Atualizar Permissões
Requisição:

```text
POST /api/whitelist/update
Content-Type: application/json

{
  "email": "maria@example.com",
  "patch": {
    "isActive": true,
    "canViewAlbums": true,
    "canUploadPhotos": false,
    "canDeletePhotos": false,
    "canEditProfile": false
  }
}
```
Resposta de Sucesso (200):

```json
{
  "message": "Permissões atualizadas com sucesso"
}
```
Resposta de Erro (400/500):

```json
{
  "error": "Usuário não encontrado"
}
```
Notas:
- O campo patch contém apenas os campos alterados (partial update)
- O backend aplica as regras de consistência descritas anteriormente
- O email é usado como chave para localizar o registro

---

4. Remover Usuário
Requisição:

```text
POST /api/whitelist/remove
Content-Type: application/json

{
  "email": "joao@example.com"
}
```
Resposta de Sucesso (200):

```json
{
  "message": "Usuário removido da whitelist"
}
```
Resposta de Erro (400/500):

```json
{
  "error": "Usuário não encontrado"
}
```
Notas:
- A remoção é definitiva (não há soft delete)
- O usuário perde acesso imediatamente
- Não há confirmação no backend (a confirmação é feita no frontend via window.confirm)

---

## 🔐 Segurança do Painel Admin
### Verificações de Backend
Cada endpoint protege contra acesso não autorizado:

```javascript
// Exemplo de verificação em /api/whitelist/list.js
const session = await getServerSession(req, res, authOptions);

// 1. Verifica se está autenticado
if (!session || !session.user) {
  return res.status(401).json({ error: "Not authenticated" });
}

// 2. Verifica se é o owner
const OWNER_EMAIL = process.env.OWNER_EMAIL || "";
if (session.user.email.toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
  return res.status(403).json({ error: "Forbidden: Owner only" });
}
```
| Endpoint              | Verificação            |
| --------------------- | ---------------------- |
| /api/whitelist/list   | ✅ Autenticação + Owner |
| /api/whitelist/add    | ✅ Autenticação + Owner |
| /api/whitelist/update | ✅ Autenticação + Owner |
| /api/whitelist/remove | ✅ Autenticação + Owner |

### Retorno Esperado para Não-Owner
HTTP 403 Forbidden:

```json
{
  "error": "Forbidden: Owner only"
}
```

---

## 📊 Auditoria e Logs
### O Que Monitorar
| Métrica                            | Por Que Importa                  |
| ---------------------------------- | -------------------------------- |
| Tempo de carregamento da whitelist | Performance da API + DynamoDB    |
| Taxa de erro nas operações         | Problemas de IAM, rede ou código |
| Número de usuários na whitelist    | Crescimento do sistema           |
| Frequência de alterações           | Padrão de uso do painel          |
| Último login dos usuários          | Identificar contas órfãs         |

### Logs Sugeridos no Backend
```javascript
// Em /api/whitelist/add.js
logger.info(`Owner adicionou usuário: ${maskEmail(email)}`, {
  addedBy: session.user.email,
  timestamp: new Date().toISOString()
});

// Em /api/whitelist/remove.js
logger.warn(`Owner removeu usuário: ${maskEmail(email)}`, {
  removedBy: session.user.email,
  timestamp: new Date().toISOString()
});

// Em /api/whitelist/update.js
logger.debug(`Owner atualizou permissões: ${maskEmail(email)}`, {
  updatedBy: session.user.email,
  patch,
  timestamp: new Date().toISOString()
});
```

---

## Variáveis de Ambiente
### Obrigatórias
| Variável                 | Descrição                       | Exemplo                |
| ------------------------ | ------------------------------- | ---------------------- |
| `OWNER_EMAIL`              | Email do dono do projeto        | `owner@example.com`      |
| `DYNAMO_TABLE_WHITELIST`   | Tabela de permissões            | `exemple-whitelist`      |
| `DYNAMO_TABLE_AUTH_DENIED` | Tabela de logs de acesso negado | `exemple-deny-auth-logs` |
| `AWS_REGION`               | Região da AWS                   | `exemple-região`         |

### Opcionais
| Variável  | Descrição                           | Default    |
| --------- | ----------------------------------- | ---------- |
| `LOG_LEVEL` | Nível de log (`verbose`, `info`, `error`) | `info`       |
| `NODE_ENV`  | Ambiente (`development`, `production`)  | `production` |

## ❓ FAQ
### Posso ter múltiplos owners?
R: Não atualmente. O sistema suporta apenas um OWNER_EMAIL. Para múltiplos administradores, adicione-os na whitelist com todas as permissões habilitadas.

### O que acontece se eu remover alguém da whitelist?
R: O usuário perde acesso imediatamente. Não há cache ou grace period.

### Posso mudar permissões dinamicamente?
R: Sim, atualize o item no DynamoDB. A mudança é imediata (não há cache).

### Como faço backup da whitelist?
R: Atualmente não há exportação nativa. Use o workaround via Console do Desenvolvedor (Network → Copiar JSON) ou exporte diretamente do DynamoDB Console.

### O sistema notifica o usuário quando ele é adicionado?
R: Não automaticamente. O owner deve comunicar o usuário externamente (email, WhatsApp, etc.) que ele foi adicionado.

---

## 📚 Referências Relacionadas
### Documentação Interna
| Documento       | Descrição                                     |
| --------------- | --------------------------------------------- |
| [README.md](/README.md)       | Visão geral do projeto                        |
| [PERMISSIONS.md](/docs/PERMISSIONS.md)  | Matriz de permissões e regras de negócio      |
| [ADMIN_PAINEL.md](/docs/ADMIN_PAINEL.md) | UI, estados e testes do painel administrativo |
| [SETUP.md](/docs/SETUP.md)        | Guia de configuração (em desenvolvimento)     |

### Documentação Externa
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Amazon S3 Documentation](https://docs.aws.amazon.com/s3/)
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)

---

Fim da documentação.

Para informações sobre interface, estados e testes do painel, consulte [Documentação do Painel Administrativo](/docs/ADMIN_PAINEL.md).

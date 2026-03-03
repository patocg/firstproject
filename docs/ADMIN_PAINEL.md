# Painel Administrativo - UI e Estados

> **Descrição:** Documentação técnica da interface do usuário (UI), estados, responsividade e testes do Painel Administrativo de Gerenciamento da Whitelist.
>
> **Última atualização:** Março de 2026
>
> **Responsável:** Jonathas Cunha
>
> **Relacionado:** [Matriz de Permissões](/docs/PERMISSIONS.md)

---

## Índice

- [Visão Geral](#visão-geral)
- [Estados de UI](#-estados-de-ui-do-painel)
- [Fluxo de Estados](#-fluxo-de-estados)
- [Responsividade](#-responsividade-e-limitações)
- [Testes e Validação](#-testes-e-validação)
- [Referências](#-referências)

---

## Visão Geral

Esta documentação cobre **exclusivamente aspectos de UI e estados** do Painel Administrativo. Para informações sobre:

- **Regras de negócio de permissões:** Veja [Matriz de Permissões](/docs/PERMISSIONS.md)
- **APIs do backend:** Veja [API Reference](/docs/PERMISSIONS.md#-api-reference)
- **Configuração de variáveis de ambiente:** Veja [Variáveis de Ambiente](PERMISSIONS.md#variáveis-de-ambiente)

### Localização no Código

| Arquivo | Caminho |
|---------|---------|
| **Componente Principal** | `pages/album/index.js` |
| **Overlay Admin** | Linhas ~600-900 |
| **Estado do Painel** | `adminOpen`, `whitelist`, `selectedEmails` |

---

## Estados de UI do Painel
### Estados Possíveis

O painel pode estar em **5 estados distintos**, que determinam o que é exibido ao usuário:

| Estado | Condição | UI Exibida | Prioridade |
|--------|----------|------------|------------|
| **Carregando** | `wlLoading === true` | `"Carregando whitelist..."` | 🔴 Alta |
| **Erro** | `wlError !== ""` | Mensagem de erro em vermelho | 🔴 Alta |
| **Sucesso** | `adminMessage !== ""` | Mensagem de sucesso em verde | 🟡 Média |
| **Vazio** | `whitelist.length === 0` | `"Nenhum usuário na whitelist ainda."` | 🟢 Baixa |
| **Populado** | `whitelist.length > 0` | Matriz completa com todos os usuários | 🟢 Baixa |

### Hierarquia de Exibição

Os estados são renderizados com a seguinte prioridade:

```javascript
if (wlLoading) {
  return "Carregando...";  // 🔴 Prioridade máxima
}

if (wlError) {
  return <Erro>{wlError}</Erro>;  // 🔴 Prioridade máxima
}

if (adminMessage) {
  return <Sucesso>{adminMessage}</Sucesso>;  // 🟡 Prioridade média
}

if (whitelist.length === 0) {
  return "Nenhum usuário...";  // 🟢 Prioridade baixa
}

return <Matriz />;  // 🟢 Estado normal
```
### Detalhes de Cada Estado
1. Estado: Carregando
Gatilho: setWlLoading(true) ao chamar fetchWhitelist()

UI:
```
┌─────────────────────────────────────┐
│  Carregando whitelist...            │
└─────────────────────────────────────┘
```
Duração típica: 200-800ms (depende do DynamoDB)

---

2. Estado: Erro
Gatilho: setWlError(msg) quando API retorna erro

UI:
```
┌─────────────────────────────────────┐
│  ❌ Falha ao carregar whitelist     │
└─────────────────────────────────────┘
```
Cores:
- Texto: #dc2626 (vermelho)
- Fundo: transparent
Ações do usuário:
- Fechar e reabrir o painel
- Recarregar a página
---

3. Estado: Sucesso
Gatilho: setAdminMessage(msg) após operação bem-sucedida

UI:
```
┌─────────────────────────────────────┐
│  ✅ Usuário adicionado com sucesso  │
└─────────────────────────────────────┘
```
Cores:
- Texto: #16a34a (verde)
- Fundo: transparent

Duração: Mensagem desaparece ao fechar o painel

---

4. Estado: Vazio
Gatilho: whitelist.length === 0 após carregamento

UI:
```
┌─────────────────────────────────────┐
│  Nenhum usuário na whitelist ainda. │
└─────────────────────────────────────┘
```
Quando ocorre:
- Primeiro acesso do owner
- Todos os usuários foram removidos

---

5. Estado: Populado
Gatilho: whitelist.length > 0

UI: Matriz completa de permissões (9 colunas)

Performance:
- Até 50 usuários: Renderização instantânea
- 50-100 usuários: Leve delay (< 1s)
- 100+ usuários: Considerar paginação (não implementado)

---

## Fluxo de Estados
### Diagrama Completo
```
┌─────────────────┐
│   Painel Abre   │
│ (adminOpen=true)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ wlLoading=true  │
│ "Carregando..." │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Chamada: fetchWhitelist()  │
│  GET /api/whitelist/list    │
└────────┬────────────┬───────┘
         │            │
    ✅ 200 OK │            │ ❌ Erro (4xx/5xx)
         ▼            ▼
┌─────────────────┐  ┌───────────────────┐
│ whitelist = []  │  │ wlError = msg     │
│ wlLoading=false │  │ wlLoading=false   │
└────────┬────────┘  └───────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  whitelist.length === 0?    │
└────────┬────────────┬───────┘
         │            │
      ✅ Sim │            │ ❌ Não
         ▼            ▼
┌─────────────────┐  ┌─────────────────┐
│ "Nenhum usuário"│  │ Renderiza Matriz│
│ wlLoading=false │  │ wlLoading=false │
└─────────────────┘  └─────────────────┘
```
### Transição de Estado
| De → Para             | Gatilho                   | Ação do Usuário                |
| --------------------- | ------------------------- | ------------------------------ |
| Carregando → Populado | API retorna 200 com dados | Nenhum (automático)            |
| Carregando → Vazio    | API retorna 200 sem dados | Nenhum (automático)            |
| Carregando → Erro     | API retorna erro          | Nenhum (automático)            |
| Erro → Carregando     | Reabrir painel            | Click em "Área administrativa" |
| Populado → Carregando | Atualizar lista           | Qualquer operação na matriz    |
| Sucesso → Populado    | Mensagem expira           | Fechar painel ou nova operação |

---

## Responsividade e Limitações
Dimensões do Overlay
| Propriedade     | Valor  | Notas                       |
| --------------- | ------ | --------------------------- |
| Largura         | 90vw   | 90% da largura da viewport  |
| Largura Máxima  | 1600px | Trava em telas muito largas |
| Altura          | 90vh   | 90% da altura da viewport   |
| Border Radius   | 16px   | Cantos arredondados         |
| Z-Index         | 9999   | Sempre acima de tudo        |
| Padding Interno | 24px   | Espaçamento do conteúdo     |

### Comportamento em Diferentes Resoluções
Desktop (≥ 1024px)
✅ Experiência ideal:
- Matriz exibida sem scroll horizontal
- Todas as 9 colunas visíveis simultaneamente
- Formulário em linha única (nome + email + botão)

Tablet (768px - 1023px)
⚠️ Experiência aceitável:
- Scroll horizontal na matriz
- 2-3 colunas escondidas inicialmente
- Formulário pode quebrar em 2 linhas

Mobile (< 768px)
❌ Experiência limitada:
- Scroll horizontal necessário
- Apenas 1-2 colunas visíveis por vez
- Formulário quebra em múltiplas linhas
- Botões de permissão podem sobrepor texto

### Estrutura da Matriz (9 Colunas)
| # | Coluna             | Largura Relativa | Visível em Mobile? |
| - | ------------------ | ---------------- | ------------------ |
| 1 | Checkbox           | 0.5fr            | ✅ Sim              |
| 2 | Nome               | 1.8fr            | ✅ Sim              |
| 3 | E-mail             | 2.2fr            | ✅ Sim              |
| 4 | Último login       | 1.5fr            | ❌ Não (scroll)     |
| 5 | Status             | 1fr              | ✅ Sim              |
| 6 | Acesso aos álbuns  | 1.4fr            | ❌ Não (scroll)     |
| 7 | Excluir fotos      | 1.4fr            | ❌ Não (scroll)     |
| 8 | Upload             | 1.4fr            | ❌ Não (scroll)     |
| 9 | Alteração cadastro | 1.6fr            | ❌ Não (scroll)     |

### Limitações Conhecidas
| Limitação             | Impacto                              | Workaround                                    |
| --------------------- | ------------------------------------ | --------------------------------------------- |
| Não é mobile-friendly | Difícil uso em telas < 768px         | Usar apenas em desktop/tablet                 |
| Sem paginação         | Performance cai com 100+ usuários    | Filtrar por email (não implementado)          |
| Sem busca             | Difícil encontrar usuário específico | Scroll manual ou ordenação (não implementado) |
| Sem exportação        | Não há backup via UI                 | Usar console do navegador + copiar JSON       |
| Sem desfazer          | Exclusão é permanente                | Confirmar antes de excluir                    |

### Melhorias Futuras Sugeridas
 - [ ] Responsividade total para mobile (redesenho da matriz)
 - [ ] Busca por email/nome com debounce
 - [ ] Ordenação por coluna (clicável)
 - [ ] Paginação ou virtual scrolling
 - [ ] Exportação CSV/JSON com 1 clique
 - [ ] Desfazer última ação (undo)
 - [ ] Modo compacto para telas pequenas

---

## Testes e Validação
### Checklist de Testes
Antes de liberar alterações no painel, execute todos os testes abaixo:

Testes Funcionais Básicos
 - [ ] Adicionar usuário com nome/email válidos
     - Esperado: Sucesso, mensagem verde, matriz atualizada
 - [ ] Adicionar usuário com email duplicado
     - Esperado: Erro, mensagem vermelha, matriz não atualiza
 - [ ] Adicionar usuário com campos vazios
     - Esperado: Erro de validação, nenhum request para API
 - [ ] Adicionar usuário com email em maiúsculo
     - Esperado: Email convertido para lowercase automaticamente

Testes de Alternância de Status
 - [ ] Alternar status de ativo para inativo (verde → vermelho)
     - Esperado: Todas as permissões zeradas (todos "Bloqueado")
 - [ ] Alternar status de inativo para ativo (vermelho → verde)
     - Esperado: `canViewAlbums = true`, outros permanecem `false`
 - [ ] Bloquear canViewAlbums (Permitido → Bloqueado)
     - Esperado: Status muda para inativo (vermelho), outros zerados
 - [ ] Habilitar canUploadPhotos em usuário inativo
     - Esperado: Status muda para ativo (verde), `canViewAlbums = true`

Testes de Exclusão
 - [ ] Excluir 1 usuário via seleção
     - Esperado: Modal de confirmação, usuário removido após confirmar
 - [ ] Excluir múltiplos usuários via seleção em lote
     - Esperado: Modal com contagem, todos removidos sequencialmente
 - [ ] Cancelar exclusão no modal de confirmação
     - Esperado: Nenhum request para API, usuários permanecem na matriz
 - [ ] Selecionar todos via checkbox do cabeçalho
     - Esperado: Todos checkboxes marcados, contador atualizado

Testes de Estado
 - [ ] Fechar painel e verificar se estado foi resetado
     - Esperado: `selectedEmails = []`, `adminMessage = ""`, `wlError = ""`
 - [ ] Acessar como não-owner
     - Esperado: Botão "Área administrativa" não aparece
 - [ ] Acessar como não-autenticado
     - Esperado: Redirecionado para login antes de ver álbuns

Testes de API
 - [ ] Requisição para `/api/whitelist/list` retorna 200
     - Esperado: Array de objetos com estrutura correta
 - [ ] Requisição para `/api/whitelist/add` com dados válidos retorna 200/201
     - Esperado: Usuário criado, fetchWhitelist() recarrega
 - [ ] Requisição para `/api/whitelist/update` com patch parcial retorna 200
     - Esperado: Apenas campos alterados são atualizados
 - [ ] Requisição para `/api/whitelist/remove` com email válido retorna 200
     - Esperado: Usuário removido do DynamoDB

Testes de Segurança
 - [ ] Tentar acessar API sem autenticação
     - Esperado: 401 Unauthorized
 - [ ] Tentar acessar API como não-owner
     - Esperado: 403 Forbidden
 - [ ] Injetar email com SQL/NoSQL no campo de email
     - Esperado: Validação rejeita ou sanitiza input
 - [ ] XSS via campo nome
     - Esperado: Nome é renderizado como texto, não executado como HTML

Testes de Performance
 - [ ] Carregar whitelist com 50 usuários
     - Esperado: < 1 segundo para renderizar
 - [ ] Carregar whitelist com 100 usuários
     - Esperado: < 2 segundos para renderizar
 - [ ] Alternar 10 permissões rapidamente
     - Esperado: Sem race conditions, estado final consistente

---

### Casos de Teste Detalhados
Caso de Teste 1: Fluxo Completo de Adição
```
// 1. Preencher formulário
setNewName("Teste Silva");
setNewEmail("TESTE@EXAMPLE.COM");  // Maiúsculo proposital

// 2. Submeter
handleAddWhitelist(event);

// 3. Esperado:
// - Email convertido para "teste@example.com"
// - POST para /api/whitelist/add
// - Status 200/201
// - adminMessage = "Usuário adicionado..."
// - fetchWhitelist() recarrega matriz
// - Formulário limpo (nome = "", email = "")
```
---

Caso de Teste 2: Regra de Consistência
```
// 1. Usuário inativo: isActive = false
// 2. Clicar em "Upload" para habilitar

// Esperado:
PATCH /api/whitelist/update
{
  "email": "usuario@example.com",
  "patch": {
    "canUploadPhotos": true,
    "isActive": true,      // ← Ativado automaticamente
    "canViewAlbums": true  // ← Garantido automaticamente
  }
}

// 3. Matriz recarrega mostrando:
// - Status: verde (ativo)
// - Upload: "Permitido"
// - Acesso aos álbuns: "Permitido"
```
---

Caso de Teste 3: Exclusão em Lote
```
// 1. Selecionar 3 usuários via checkbox
// 2. Clicar em "Excluir selecionados"

// Esperado:
// - Modal: "Remover 3 usuários da whitelist?"
// - Ao confirmar:
//   - 3 requests POST para /api/whitelist/remove (sequencial)
//   - Cada request com { email: "usuario@example.com" }
// - Após último request:
//   - fetchWhitelist() recarrega matriz
//   - selectedEmails = []
//   - adminMessage = "Usuários removidos..." (se implementado)
```
---

Caso de Teste 4: Cancelamento de Exclusão
```
// 1. Selecionar 1 usuário
// 2. Clicar em "Excluir selecionados"
// 3. Clicar em "Cancelar" no modal

// Esperado:
// - Nenhum request para API
// - Checkbox permanece marcado
// - selectedEmails mantém o email
// - Matriz não recarrega
```
---

Caso de Teste 5: Race Condition (Múltiplas Ações Rápidas)
```
// 1. Clicar em "Alternar status" 5 vezes rapidamente

// Esperado:
// - 5 requests POST para /api/whitelist/update
// - Estado final consistente (último request vence)
// - Sem erros de "cannot read property of undefined"
// - Matriz reflete estado correto após todos os requests
```
---

### Critérios de Aceite
Para cada teste acima, verifique:
| Critério       | Como Validar                        |
| -------------- | ----------------------------------- |
| Funcionalidade | Ação produz o resultado esperado?   |
| Consistência   | Estado da matriz bate com DynamoDB? |
| Feedback       | Mensagens de sucesso/erro aparecem? |
| Performance    | Ação completa em < 2 segundos?      |
| Segurança      | Validações de input funcionam?      |
| Acessibilidade | Navegação por teclado funciona?     |

---

## Debug e Ferramentas
### Console do Desenvolvedor
Inspecionar Estado Atual
```
// No console do navegador (F12):
whitelist;        // Array completo de usuários
selectedEmails;   // Emails selecionados
adminMessage;     // Mensagem atual (sucesso/erro)
wlLoading;        // true/false
wlError;          // Mensagem de erro (se houver)
```
Forçar Recarregamento
```
// Recarregar whitelist manualmente:
fetchWhitelist();
```
Limpar Estado
```
// Resetar seleção em lote:
setSelectedEmails([]);

// Limpar mensagens:
setAdminMessage("");
setWlError("");
```
---

### Network Tab (F12)
Verificar Requests da API
| Ação                | Endpoint Esperado     | Método |
| ------------------- | --------------------- | ------ |
| Abrir painel        | /api/whitelist/list   | GET    |
| Adicionar usuário   | /api/whitelist/add    | POST   |
| Atualizar permissão | /api/whitelist/update | POST   |
| Excluir usuário     | /api/whitelist/remove | POST   |

Estrutura de Request/Response
Adicionar Usuário:
```
POST /api/whitelist/add
Content-Type: application/json

{
  "name": "Teste Silva",
  "email": "teste@example.com"
}
```
Resposta de Sucesso:
```
{
  "message": "Usuário adicionado à whitelist com sucesso"
}
```
Resposta de Erro:
```
{
  "error": "Email já existe na whitelist"
}
```
---
### Logs do Backend
Se os testes falharem, verifique os logs:

Vercel (Produção)
1. Acesse vercel.com
2. Selecione o projeto
3. Vá em "Logs"
4. Filtre por função (ex: /api/whitelist/add)

Local (Desenvolvimento)
```
# Terminal onde roda npm run dev:
# Logs aparecem em tempo real

# Exemplo de log esperado:
[Whitelist:add] Usuário adicionado: teste@example.com
[Whitelist:update] Permissões atualizadas: teste@example.com
[Whitelist:remove] Usuário removido: teste@example.com
```
---

## Referências
### Documentação Relacionada
- Matriz de Permissões - Regras de negócio e APIs
- README.md - Visão geral do projeto
- Setup Guide - Configuração de ambiente

### Código Fonte
- Componente Principal: pages/album/index.js
- API List: pages/api/whitelist/list.js
- API Add: pages/api/whitelist/add.js
- API Update: pages/api/whitelist/update.js
- API Remove: pages/api/whitelist/remove.js

### Ferramentas Externas
- React DevTools - Inspecionar componentes e estado
- Postman - Testar APIs manualmente
- Chrome Lighthouse - Auditar performance e acessibilidade
---

### Changelog
| Versão | Data    | Mudanças                               |
| ------ | ------- | -------------------------------------- |
| 1.0    | 2026-01 | Documentação inicial criada            |
| 1.1    | 2026-03 | Adicionados casos de teste detalhados  |
| 1.2    | 2026-03 | Incluídos exemplos de debug no console |

---

Fim da documentação do Painel Administrativo.

Para informações sobre regras de negócio, permissões e APIs, retorne para Matriz de Permissões.
---

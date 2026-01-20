# 🌐 jnths.com.br - Portfólio Pessoal v1.0

> Portfólio moderno e responsivo com animações suaves, hover effects e design elegante

[![Version](https://img.shields.io/badge/version-1.0-blue.svg?style=flat-square)](https://github.com/patocg/firstproject/releases/tag/v1.0)
[![Stack](https://img.shields.io/badge/stack-Next.js%20•%20React%20•%20Vercel-black.svg?style=flat-square)](https://github.com/patocg/firstproject)
[![Deploy](https://img.shields.io/badge/deploy-Vercel-success.svg?style=flat-square)](https://jnths.com.br)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](#license)

---

## 📸 Preview

[Acesse o site live](https://jnths.com.br)

---

## ✨ Características Principais

### 🎨 Design Moderno
- Paleta de cores harmônica e minimalista
- Fundo cinza moderno (`#e5e5e5`)
- Cards brancos com bordas coloridas
- Typography clara e hierárquica
- 100% responsivo

### 🎬 Animações & Efeitos
- **Fade In + Slide**: Elementos entram com animação suave
- **Scale Effect**: Ícones crescem ao aparecer
- **Hover Effects**: Cards sobem, ícones brilham
- **Transições Suaves**: 0.3s ease em todos os elementos
- Delays progressivos para efeito cascata

### 🛠️ Seções Principais

#### 1. **Header**
- Título com animação fadeInSlideDown
- Badges do GitHub (followers, stars, profile views)
- Ícones sociais com hover effects elegantes
- Descrição inspiradora

#### 2. **Sobre Mim**
- Missão, experiência e aprendizado
- Organizado com bullets descritivos
- Layout limpo e hierárquico

#### 3. **Linguagens e Ferramentas**
Organizadas por **4 categorias**:
- 🔧 **Backend**: Python, Flask, PostgreSQL
- 🎨 **Frontend**: HTML5, CSS3, JavaScript
- ⚙️ **DevOps & Tools**: Git, VSCode
- 🤖 **AI Tools**: Gemini, OpenAI, Perplexity, Grok, Copilot

Todos com **hover effects**: scale(1.2) + drop-shadow

#### 4. **Estatísticas & Linguagens**
- 4 cards com bordas coloridas (vermelho, ciano, roxo, lavanda)
- GitHub Stats, Top Languages, Top Repository, Contributions
- Labels descritivos com emojis
- Hover effects com lift + sombra colorida
- Animações fadeInSlideUp com delays progressivos

#### 5. **Aprendizados & Inspiração**
- Blockquote elegante com citação inspiradora
- Design minimalista

#### 6. **Footer**
- Design minimalista e clean
- 3 colunas: Projeto, Social, Info
- Links com hover effects
- Stack de tecnologias (Next.js • React • Vercel)
- Versão do site (v1.0)

---

## 🏗️ Estrutura do Projeto
pages/
├── index.js # Página principal do portfólio
└── _app.js # Configuração Next.js

public/
└── (assets estáticos)

.gitignore
package.json
README.md

---

## 🚀 Stack de Tecnologias

- **Framework**: [Next.js](https://nextjs.org)
- **Library**: [React](https://react.dev)
- **Hosting**: [Vercel](https://vercel.com)
- **Styling**: CSS-in-JS (Inline Styles)
- **Icons**: [Devicon](https://devicons.dev), [UXWing](https://uxwing.com), [SVGRepo](https://svgrepo.com)

---

## 📦 Como Rodar Localmente

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/patocg/firstproject.git

# Entre no diretório
cd firstproject

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
Acesse http://localhost:3000 no navegador.

🎯 Melhorias da v1.0
✅ Novo Design
Redesign completo com paleta moderna

Fundo cinza em vez do branco puro

Melhor hierarquia visual

✅ Animações
Fade in + slide up/down na entrada

Scale effect nos ícones

Delays progressivos para efeito cascata

✅ Seções Refatoradas
Linguagens: Agora com 4 categorias organizadas

Estatísticas: 4 cards coloridos com labels

Header: Animações suaves nos elementos

✅ Novos Recursos
Ícones de AI Tools (Gemini, OpenAI, Perplexity, Grok, Copilot)

Footer minimalista e moderno

Hover effects em todos os elementos interativos

✅ Removido
Seção de Destaques do Instagram (CORS issues em produção)

🎨 Paleta de Cores
Cor	Código	Uso
Cinza Claro	#e5e5e5	Fundo principal
Branco	#fff	Cards e seções
Cinza Escuro	#333	Texto principal
Vermelho	#FF6B6B	Bordas, hover effects
Ciano	#4ECDC4	Bordas, destaque
Roxo	#6C5CE7	Bordas, destaque
Lavanda	#A29BFE	Bordas, destaque

---

/* Fade In + Slide Down */
@keyframes fadeInSlideDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Fade In + Slide Up */
@keyframes fadeInSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Fade In + Scale */
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
📱 Responsividade
✅ Mobile first approach

✅ Breakpoints otimizados

✅ Touch-friendly interactive elements

✅ Testes em diferentes resoluções

🔗 Links Úteis
🌐 Site Live: https://jnths.com.br

💼 LinkedIn: https://linkedin.com/in/jonathas-lima-cunha-60070839/

📧 GitHub: https://github.com/patocg

🐦 Instagram: https://www.instagram.com/jonathas.cunha/

📝 Commits Principais
feat: adiciona 5 cards de estatísticas

style: refatora seção de Linguagens e Ferramentas

style: adiciona animações e hover effects na seção inicial

feat: adiciona footer minimalista e moderno

📊 Estatísticas
GitHub Followers
GitHub Stars
Profile Views

💬 Feedback
Gostou do projeto? Deixe uma ⭐ no repositório!

📄 License
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

👨‍💻 Autor
Jonathas Cunha

📍 Campo Grande, MS - Brasil

🟢 Disponível para projetos

💻 Desenvolvedor Full-Stack | Cloud Infrastructure | Automação

<div align="center">
Feito com 💻 por Jonathas Cunha

v1.0 • 2025 • Next.js • React • Vercel

</div> ```
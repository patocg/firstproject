import React from "react";

const socialLinks = [
  {
    href: "https://jnths.com.br/",
    // Atualize para o melhor SVG publicada se necessário!
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/internetexplorer.svg",
    title: "WebSite"
  },
  {
    href: "https://linkedin.com/in/jonathas-lima-cunha-60070839/",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg",
    title: "LinkedIn"
  },
  {
    href: "https://www.instagram.com/jonathas.cunha/",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg",
    title: "Instagram"
  },
  {
    href: "https://github.com/patocg",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg",
    title: "GitHub"
  },
  {
    href: "https://www.facebook.com/jonathas.cunha/",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg",
    title: "Facebook"
  },
];

export default function Home() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#404040", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto", padding: 32, background: "#fff", borderRadius: 12, boxShadow: "0 0 12px #ddd" }}>
        <h1>👋 Olá, eu sou Jonathas Cunha!</h1>

        <div style={{ margin: "18px 0" }}>
          <img src="https://img.shields.io/github/followers/patocg?style=social" alt="GitHub followers" />
          <img src="https://img.shields.io/github/stars/patocg/jnths?style=social" alt="Repo Stars" style={{ marginLeft: 12 }} />
          <img src="https://komarev.com/ghpvc/?username=patocg" alt="Profile Views" style={{ marginLeft: 12 }} />
        </div>

        {/* Ícones sociais com hover */}
        <div style={{
          display: "flex",
          gap: 18,
          justifyContent: "center",
          alignItems: "center",
          margin: "16px 0"
        }}>
          {socialLinks.map(link => (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.title}
              style={{
                borderRadius: 8,
                padding: 4,
                transition: "background 0.2s",
                background: "#f6f6f6"
              }}
              onMouseOver={e => e.currentTarget.style.background = "#e1edf7"}
              onMouseOut={e => e.currentTarget.style.background = "#f6f6f6"}
            >
              <img
                src={link.icon}
                alt={link.title}
                style={{
                  width: 32,
                  height: 32,
                  transition: "filter 0.2s",
                  filter: "grayscale(35%) brightness(1)"
                }}
                onMouseOver={e => e.currentTarget.style.filter = "none"}
                onMouseOut={e => e.currentTarget.style.filter = "grayscale(35%) brightness(1)"}
              />
            </a>
          ))}
        </div>

        <p style={{ fontSize: "1.15rem", color: "#222", marginBottom: 0 }}>
          Tecnologia, código e inovação fazem parte da minha trajetória — brasileiro apaixonado por transformar ideias em soluções práticas!
        </p>
      </div>

      <section style={{ maxWidth: 900, margin: "32px auto", background: "#fff", borderRadius: 12, padding: "0 32px 32px", boxShadow: "0 0 12px #eee" }}>
        <h2>✨ Sobre mim</h2>
        <p>
          Atualmente desenvolvo projetos focados em automação, inovação e integração, procurando sempre compartilhar conhecimento e facilitar a vida de quem busca tecnologia para resultados reais.
        </p>
        <ul>
          <li>🎯 <strong>Missão</strong>: Transformar desafios em soluções digitais que impulsionam negócios e pessoas.</li>
          <li>🚀 <strong>Experiência</strong>: Projetos envolvendo Python, infraestrutura de redes, integração web e automação.</li>
          <li>💡 <strong>Aprendizado contínuo e autêntico</strong>: Sempre testando novas ferramentas, frameworks e boas práticas.</li>
        </ul>

        <hr style={{ margin: "32px 0" }} />

        <h2>🛠️ Linguagens e Ferramentas</h2>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" height="32" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" alt="Flask" height="32" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" height="32" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" height="32" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JS" height="32" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" height="32" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" height="32" />
          <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.svg" alt="Gemini" height="32" />
          <img src="https://logo.svgcdn.com/l/perplexity-icon.svg" alt="Perplexity" height="32" />
          <img src="https://www.svgrepo.com/show/306500/openai.svg" alt="OpenAI" height="32" />
          <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-copilot-icon.svg" alt="Copilot" height="32" />
          <img src="https://unpkg.com/@lobehub/icons-static-svg@latest/icons/grok.svg" alt="Grok" height="32" />
        </div>

        <hr style={{ margin: "32px 0" }} />

        <h2>📖 O que você pode encontrar aqui</h2>
        <ul>
          <li>Soluções para automação de tarefas, integração de APIs, uso de Python em projetos reais.</li>
          <li>Dicas de configuração, uso de ferramentas modernas e integração com Vercel e cloud hosting.</li>
        </ul>

        <hr style={{ margin: "32px 0" }} />

        <h2>📊 Estatísticas & Linguagens</h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "0 16px"
        }}>
          {/* Card 1: GitHub Stats */}
          <div style={{
            transition: "all 0.3s ease",
            cursor: "pointer",
            flex: "1 1 300px",
            minWidth: 280
          }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.25)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}>
            <img
              src="https://github-readme-stats.vercel.app/api?username=patocg&show_icons=true&count_private=true&theme=dracula"
              alt="Jonathas GitHub Stats"
              style={{ maxWidth: "100%", width: "100%", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            />
          </div>

          {/* Card 2: Top Languages */}
          <div style={{
            transition: "all 0.3s ease",
            cursor: "pointer",
            flex: "1 1 300px",
            minWidth: 280
          }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.25)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}>
            <img
              src="https://github-readme-stats.vercel.app/api/top-langs?username=patocg&show_icons=true&locale=pt-br&theme=dracula"
              alt="Top Languages"
              style={{ maxWidth: "100%", width: "100%", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            />
          </div>

          {/* 
    Card 3: GitHub Streak - DESATIVADO (CORS issue em produção)
    <div style={{
      transition: "all 0.3s ease",
      cursor: "pointer",
      flex: "1 1 300px",
      minWidth: 280
    }}
    onMouseOver={e => {
      e.currentTarget.style.transform = "translateY(-8px)";
      e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.25)";
    }}
    onMouseOut={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    }}>
      <img 
        src="https://streak-stats.demolab.com/?user=patocg&theme=dracula&hide_border=true"
        alt="GitHub Streak" 
        style={{ maxWidth: "100%", width: "100%", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      />
    </div>
  */}

          {/* Card 4: Top Repository */}
          <div style={{
            transition: "all 0.3s ease",
            cursor: "pointer",
            flex: "1 1 300px",
            minWidth: 280
          }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.25)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}>
            <img
              src="https://github-readme-stats.vercel.app/api/pin/?username=patocg&repo=jnths&theme=dracula"
              alt="Top Repository - jnths"
              style={{ maxWidth: "100%", width: "100%", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            />
          </div>

          {/* Card 5: Contribution Stats */}
          <div style={{
            transition: "all 0.3s ease",
            cursor: "pointer",
            flex: "1 1 300px",
            minWidth: 280
          }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.25)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}>
            <img
              src="https://github-readme-stats.vercel.app/api?username=patocg&theme=dracula&hide=stars,contribs&show=reviews,discussions_started,prs_merged_percentage"
              alt="Contribution Stats"
              style={{ maxWidth: "100%", width: "100%", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            />
          </div>
        </div>


        {/* REMOVIDA DAQUI A SEÇÃO DE DESTAQUES DO INSTAGRAM */}

        <hr style={{ margin: "32px 0" }} />

        <h2>🌱 Aprendizados & Inspiração</h2>
        <blockquote style={{ fontStyle: "italic", fontSize: "1.05rem", color: "#555" }}>
          “Tecnologia é ferramenta de crescimento, aprendizado e conexão de pessoas. Evoluir todo dia é parte do processo!”
        </blockquote>

        <hr style={{ margin: "32px 0" }} />

        <div style={{ textAlign: "center", marginTop: 32, color: "#888", fontSize: "0.95rem" }}>
          <sub> jnths.com.br · v1.1 - 01/2026</sub>
        </div>
      </section>
    </main>
  );
}
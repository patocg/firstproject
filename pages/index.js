import React from "react";
import { signIn } from "next-auth/react";

const socialLinks = [
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
    <main style={{ fontFamily: "Arial, sans-serif", background: "#e5e5e5", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto", padding: 32, background: "#fff", borderRadius: 12, boxShadow: "0 0 12px #ddd" }}>

        {/* Estilos de animação */}
        <style>{`
      @keyframes fadeInSlideDown {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInSlideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .title-animate {
        animation: fadeInSlideDown 0.6s ease-out forwards;
      }
      
      .badge-animate {
        animation: fadeInSlideUp 0.6s ease-out forwards;
      }
      
      .social-animate {
        animation: fadeInSlideUp 0.6s ease-out forwards;
      }
      
      .description-animate {
        animation: fadeInSlideUp 0.6s ease-out forwards;
      }
    `}</style>

        {/* Título com animação */}
        <h1 className="title-animate" style={{ fontSize: "2.5rem", marginBottom: 16, color: "#222" }}>
          👋 Olá, eu sou Jonathas Cunha!
        </h1>

        {/* Badges com animação e hover */}
        <div className="badge-animate" style={{ margin: "18px 0", animationDelay: "0.2s", display: "flex", gap: 16, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <img
            src="https://img.shields.io/github/followers/patocg?style=social"
            alt="GitHub followers"
            style={{
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.filter = "drop-shadow(0 4px 8px rgba(0,0,0,0.2))";
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.filter = "drop-shadow(0 0px 0px rgba(0,0,0,0))";
            }}
          />
          <img
            src="https://img.shields.io/github/stars/patocg/jnths?style=social"
            alt="Repo Stars"
            style={{
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.filter = "drop-shadow(0 4px 8px rgba(0,0,0,0.2))";
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.filter = "drop-shadow(0 0px 0px rgba(0,0,0,0))";
            }}
          />
          <img
            src="https://komarev.com/ghpvc/?username=patocg"
            alt="Profile Views"
            style={{
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.filter = "drop-shadow(0 4px 8px rgba(0,0,0,0.2))";
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.filter = "drop-shadow(0 0px 0px rgba(0,0,0,0))";
            }}
          />
        </div>

        {/* Ícones sociais com animação e hover */}
        <div className="social-animate" style={{
          display: "flex",
          gap: 18,
          justifyContent: "center",
          alignItems: "center",
          margin: "16px 0",
          animationDelay: "0.4s"
        }}>
          {socialLinks.map((link, index) => (
            <div
              key={link.title}
              style={{
                animation: `fadeInSlideUp 0.6s ease-out forwards`,
                animationDelay: `${0.4 + index * 0.08}s`
              }}
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.title}
                style={{
                  borderRadius: 8,
                  padding: 4,
                  transition: "all 0.3s ease",
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <img
                  src={link.icon}
                  alt={link.title}
                  style={{
                    width: 32,
                    height: 32,
                    transition: "all 0.3s ease",
                    filter: "grayscale(35%) brightness(1)"
                  }}
                  onMouseOver={e => e.currentTarget.style.filter = "none"}
                  onMouseOut={e => e.currentTarget.style.filter = "grayscale(35%) brightness(1)"}
                />
              </a>
            </div>
          ))}
        </div>


        {/* Descrição com animação */}
        <p className="description-animate" style={{ fontSize: "1.15rem", color: "#555", marginBottom: 0, animationDelay: "0.6s", lineHeight: 1.6 }}>
          Tecnologia, código e inovação fazem parte da minha trajetória — brasileiro apaixonado por transformar ideias em soluções práticas!
        </p>
        {/* Card privado logo abaixo da descrição */}
        <div
          className="card-animate card-5"
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 12,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                background: "#111827",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 18,
              }}
            >
              🔒
            </span>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  color: "#111827",
                }}
              >
                Álbum da família
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  color: "#6b7280",
                }}
              >
                Área privada protegida por login Google.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 6,
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                padding: "4px 10px",
                borderRadius: 999,
                background: "#fee2e2",
                color: "#b91c1c",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
              }}
            >
              Área privada
            </span>

            <button
              onClick={() => signIn("google", { callbackUrl: "/album" })}
              style={{
                marginLeft: "auto",
                padding: "8px 16px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: "#111827",
                color: "#fff",
                fontWeight: 500,
                fontSize: "0.9rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 18px rgba(0,0,0,0.25)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 10px rgba(0,0,0,0.15)";
              }}
            >
              Entrar com Google para ver álbuns
            </button>
          </div>
        </div>

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

        {/* Estilos de animação para ícones */}
        <style>{`
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .icon-animate {
    animation: fadeInScale 0.4s ease-out forwards;
  }
`}</style>

        {/* Backend */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: "1rem", color: "#333", marginBottom: 12, textTransform: "uppercase", letterSpacing: "1px" }}>
            🔧 Backend
          </h3>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
            <div className="icon-animate" style={{ animationDelay: "0.1s" }}>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
                alt="Python"
                height="40"
                style={{
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "scale(1.2) rotateY(10deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.2))";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "scale(1) rotateY(0deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
                }}
                title="Python"
              />
            </div>
            <div className="icon-animate" style={{ animationDelay: "0.15s" }}>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg"
                alt="Flask"
                height="40"
                style={{
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "scale(1.2) rotateY(10deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.2))";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "scale(1) rotateY(0deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
                }}
                title="Flask"
              />
            </div>
            <div className="icon-animate" style={{ animationDelay: "0.2s" }}>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
                alt="PostgreSQL"
                height="40"
                style={{
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "scale(1.2) rotateY(10deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.2))";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "scale(1) rotateY(0deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
                }}
                title="PostgreSQL"
              />
            </div>
          </div>
        </div>

        {/* Frontend */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: "1rem", color: "#333", marginBottom: 12, textTransform: "uppercase", letterSpacing: "1px" }}>
            🎨 Frontend
          </h3>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
            <div className="icon-animate" style={{ animationDelay: "0.25s" }}>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
                alt="HTML5"
                height="40"
                style={{
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "scale(1.2) rotateY(10deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.2))";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "scale(1) rotateY(0deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
                }}
                title="HTML5"
              />
            </div>
            <div className="icon-animate" style={{ animationDelay: "0.3s" }}>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
                alt="CSS3"
                height="40"
                style={{
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "scale(1.2) rotateY(10deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.2))";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "scale(1) rotateY(0deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
                }}
                title="CSS3"
              />
            </div>
            <div className="icon-animate" style={{ animationDelay: "0.35s" }}>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                alt="JS"
                height="40"
                style={{
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "scale(1.2) rotateY(10deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.2))";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "scale(1) rotateY(0deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
                }}
                title="JavaScript"
              />
            </div>
          </div>
        </div>

        {/* DevOps & Tools */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: "1rem", color: "#333", marginBottom: 12, textTransform: "uppercase", letterSpacing: "1px" }}>
            ⚙️ DevOps & Tools
          </h3>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
            <div className="icon-animate" style={{ animationDelay: "0.4s" }}>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
                alt="Git"
                height="40"
                style={{
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "scale(1.2) rotateY(10deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.2))";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "scale(1) rotateY(0deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
                }}
                title="Git"
              />
            </div>
            <div className="icon-animate" style={{ animationDelay: "0.45s" }}>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
                alt="VSCode"
                height="40"
                style={{
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "scale(1.2) rotateY(10deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.2))";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "scale(1) rotateY(0deg)";
                  e.currentTarget.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
                }}
                title="VSCode"
              />
            </div>
          </div>
          {/* AI Tools */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: "1rem", color: "#333", marginBottom: 12, textTransform: "uppercase", letterSpacing: "1px" }}>
              🤖 AI Tools
            </h3>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
              <div className="icon-animate" style={{ animationDelay: "0.5s" }}>
                <img
                  src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.svg"
                  alt="Gemini"
                  height="40"
                  style={{
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = "scale(1.2) rotateY(10deg)";
                    e.currentTarget.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.2))";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = "scale(1) rotateY(0deg)";
                    e.currentTarget.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
                  }}
                  title="Gemini"
                />
              </div>
              <div className="icon-animate" style={{ animationDelay: "0.55s" }}>
                <img
                  src="https://www.svgrepo.com/show/306500/openai.svg"
                  alt="OpenAI"
                  height="40"
                  style={{
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = "scale(1.2) rotateY(10deg)";
                    e.currentTarget.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.2))";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = "scale(1) rotateY(0deg)";
                    e.currentTarget.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
                  }}
                  title="OpenAI / GPT"
                />
              </div>
              <div className="icon-animate" style={{ animationDelay: "0.6s" }}>
                <img
                  src="https://logo.svgcdn.com/l/perplexity-icon.svg"
                  alt="Perplexity"
                  height="40"
                  style={{
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = "scale(1.2) rotateY(10deg)";
                    e.currentTarget.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.2))";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = "scale(1) rotateY(0deg)";
                    e.currentTarget.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
                  }}
                  title="Perplexity"
                />
              </div>
              <div className="icon-animate" style={{ animationDelay: "0.65s" }}>
                <img
                  src="https://unpkg.com/@lobehub/icons-static-svg@latest/icons/grok.svg"
                  alt="Grok"
                  height="40"
                  style={{
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = "scale(1.2) rotateY(10deg)";
                    e.currentTarget.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.2))";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = "scale(1) rotateY(0deg)";
                    e.currentTarget.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
                  }}
                  title="Grok"
                />
              </div>
              <div className="icon-animate" style={{ animationDelay: "0.7s" }}>
                <img
                  src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-copilot-icon.svg"
                  alt="Copilot"
                  height="40"
                  style={{
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = "scale(1.2) rotateY(10deg)";
                    e.currentTarget.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.2))";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = "scale(1) rotateY(0deg)";
                    e.currentTarget.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
                  }}
                  title="GitHub Copilot"
                />
              </div>
            </div>
          </div>
        </div>

        <hr style={{ margin: "32px 0" }} />

        <h2>📖 O que você pode encontrar aqui</h2>
        <ul>
          <li>Soluções para automação de tarefas, integração de APIs, uso de Python em projetos reais.</li>
          <li>Dicas de configuração, uso de ferramentas modernas e integração com Vercel e cloud hosting.</li>
        </ul>

        <hr style={{ margin: "32px 0" }} />

        <h2>📊 Estatísticas & Linguagens</h2>

        {/* Estilos de animação */}
        <style>{`
  @keyframes fadeInSlideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .card-animate {
    animation: fadeInSlideUp 0.6s ease-out forwards;
  }
  
  .card-1 { animation-delay: 0.1s; }
  .card-2 { animation-delay: 0.2s; }
  .card-4 { animation-delay: 0.3s; }
  .card-5 { animation-delay: 0.4s; }
`}</style>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "0 16px"
        }}>
          {/* Card 1: GitHub Stats */}
          <div className="card-animate card-1" style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flex: "1 1 300px",
            minWidth: 280
          }}>
            <label style={{
              fontSize: "0.95rem",
              fontWeight: "600",
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              📈 GitHub Stats
            </label>
            <div style={{
              transition: "all 0.3s ease",
              cursor: "pointer",
              border: "3px solid #FF6B6B",
              borderRadius: 8,
              padding: 2,
              background: "#fff"
            }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(255, 107, 107, 0.3)";
                e.currentTarget.style.borderColor = "#FF5252";
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "#FF6B6B";
              }}>
              <img
                src="https://github-readme-stats-kappa-eight-10.vercel.app/api?username=patocg&show_icons=true&count_private=true&theme=dracula"
                alt="Jonathas GitHub Stats"
                style={{ maxWidth: "100%", width: "100%", borderRadius: 6, display: "block" }}
              />
            </div>
          </div>

          {/* Card 2: Top Languages */}
          <div className="card-animate card-2" style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flex: "1 1 300px",
            minWidth: 280
          }}>
            <label style={{
              fontSize: "0.95rem",
              fontWeight: "600",
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              💻 Top Languages
            </label>
            <div style={{
              transition: "all 0.3s ease",
              cursor: "pointer",
              border: "3px solid #4ECDC4",
              borderRadius: 8,
              padding: 2,
              background: "#fff"
            }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(78, 205, 196, 0.3)";
                e.currentTarget.style.borderColor = "#3BA39C";
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "#4ECDC4";
              }}>
              <img
                src="https://github-readme-stats-kappa-eight-10.vercel.app/api/top-langs?username=patocg&show_icons=true&locale=pt-br&theme=dracula"
                alt="Top Languages"
                style={{ maxWidth: "100%", width: "100%", borderRadius: 6, display: "block" }}
              />
            </div>
          </div>

          {/* 
    Card 3: GitHub Streak - DESATIVADO (CORS issue em produção)
    <div className="card-animate card-3" style={{...}}>
      ...
    </div>
  */}

          {/* Card 4: Top Repository */}
          <div className="card-animate card-4" style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flex: "1 1 300px",
            minWidth: 280
          }}>
            <label style={{
              fontSize: "0.95rem",
              fontWeight: "600",
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              ⭐ Top Repository
            </label>
            <div style={{
              transition: "all 0.3s ease",
              cursor: "pointer",
              border: "3px solid #6C5CE7",
              borderRadius: 8,
              padding: 2,
              background: "#fff"
            }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(108, 92, 231, 0.3)";
                e.currentTarget.style.borderColor = "#5F3DC4";
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "#6C5CE7";
              }}>
              <img
                src="https://github-readme-stats-kappa-eight-10.vercel.app/api/pin/?username=patocg&repo=jnths&theme=dracula"
                alt="Top Repository - jnths"
                style={{ maxWidth: "100%", width: "100%", borderRadius: 6, display: "block" }}
              />
            </div>
          </div>

          {/* Card 5: Contribution Stats */}
          <div className="card-animate card-5" style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flex: "1 1 300px",
            minWidth: 280
          }}>
            <label style={{
              fontSize: "0.95rem",
              fontWeight: "600",
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              🎯 Contributions
            </label>
            <div style={{
              transition: "all 0.3s ease",
              cursor: "pointer",
              border: "3px solid #A29BFE",
              borderRadius: 8,
              padding: 2,
              background: "#fff"
            }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(162, 155, 254, 0.3)";
                e.currentTarget.style.borderColor = "#9B88E8";
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "#A29BFE";
              }}>
              <img
                src="https://github-readme-stats-kappa-eight-10.vercel.app/api?username=patocg&theme=dracula&hide=stars,contribs&show=reviews,discussions_started,prs_merged_percentage"
                alt="Contribution Stats"
                style={{ maxWidth: "100%", width: "100%", borderRadius: 6, display: "block" }}
              />
            </div>
          </div>
        </div>
        {/* REMOVIDA DAQUI A SEÇÃO DE DESTAQUES DO INSTAGRAM */}

        <hr style={{ margin: "32px 0" }} />

        <h2>🌱 Aprendizados & Inspiração</h2>
        <blockquote style={{ fontStyle: "italic", fontSize: "1.05rem", color: "#555" }}>
          “Tecnologia é ferramenta de crescimento, aprendizado e conexão de pessoas. Evoluir todo dia é parte do processo!”
        </blockquote>

        <footer style={{
          background: "#fff",
          color: "#333",
          padding: "40px 32px",
          marginTop: 64,
          borderTop: "1px solid #e0e0e0"
        }}>
          <style>{`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .footer-animate {
      animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .footer-link {
      color: #666;
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }
    
    .footer-link:hover {
      color: #FF6B6B;
    }
  `}</style>

          <div style={{ maxWidth: 900, margin: "0 auto" }}>

            {/* Grid simples */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 24, marginBottom: 24 }}>

              <div className="footer-animate" style={{ animationDelay: "0.1s" }}>
                <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "#999", marginBottom: 8 }}>Projeto</p>
                <a href="https://github.com/patocg" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a><br />
                <a href="https://jnths.com.br/" target="_blank" rel="noopener noreferrer" className="footer-link">Site</a>
              </div>

              <div className="footer-animate" style={{ animationDelay: "0.15s" }}>
                <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "#999", marginBottom: 8 }}>Social</p>
                <a href="https://linkedin.com/in/jonathas-lima-cunha-60070839/" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a><br />
                <a href="https://www.instagram.com/jonathas.cunha/" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
              </div>

              <div className="footer-animate" style={{ animationDelay: "0.2s" }}>
                <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "#999", marginBottom: 8 }}>Info</p>
                <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>Campo Grande, MS</p>
                <p style={{ fontSize: "0.9rem", color: "#4ECDC4", margin: "4px 0 0 0" }}>🟢 Disponível</p>
              </div>

            </div>

            {/* Linha divisória fina */}
            <hr style={{ border: "none", borderTop: "1px solid #e0e0e0", margin: "24px 0" }} />

            {/* Footer bottom */}
            <div className="footer-animate" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              fontSize: "0.85rem",
              color: "#999",
              animationDelay: "0.25s"
            }}>
              <p style={{ margin: 0 }}>© 2025 Jonathas Cunha</p>
              <p style={{ margin: 0 }}>Stack: Next.js • React • Vercel</p>
              <p style={{ margin: 0 }}>v1.0</p>
            </div>

          </div>
        </footer>


      </section>
    </main>
  );
}
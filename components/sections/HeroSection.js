import AlbumSection from "./AlbumSection";

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

export default function HeroSection() {
  return (
    <>
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

      <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto", padding: 32, background: "#fff", borderRadius: 12, boxShadow: "0 0 12px #ddd" }}>
        
        {/* Título */}
        <h1 className="title-animate" style={{ fontSize: "2.5rem", marginBottom: 16, color: "#222" }}>
          👋 Olá, eu sou Jonathas Cunha!
        </h1>

        {/* Badges */}
        <div className="badge-animate" style={{ margin: "18px 0", animationDelay: "0.2s", display: "flex", gap: 16, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <img
            src="https://img.shields.io/github/followers/patocg?style=social"
            alt="GitHub followers"
            style={{ transition: "all 0.3s ease", cursor: "pointer" }}
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
            style={{ transition: "all 0.3s ease", cursor: "pointer" }}
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
            style={{ transition: "all 0.3s ease", cursor: "pointer" }}
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

        {/* Ícones Sociais */}
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

        {/* Descrição */}
        <p className="description-animate" style={{ fontSize: "1.15rem", color: "#555", marginBottom: 0, animationDelay: "0.6s", lineHeight: 1.6 }}>
          Tecnologia, código e inovação fazem parte da minha trajetória — brasileiro apaixonado por transformar ideias em soluções práticas!
        </p>
        <AlbumSection />
      </div>
    </>
  );
}

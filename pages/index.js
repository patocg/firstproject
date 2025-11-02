// src/pages/index.js ou src/App.js
import React from "react";

export default function Home() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto", padding: 32, background: "#fff", borderRadius: 12, boxShadow: "0 0 12px #ddd" }}>
        <h1>👋 Olá, eu sou Jonathas Cunha!</h1>

        <div style={{ margin: "18px 0" }}>
          <img src="https://img.shields.io/github/followers/patocg?style=social" alt="GitHub followers" />
          <img src="https://img.shields.io/github/stars/patocg/jnths?style=social" alt="Repo Stars" style={{ marginLeft: 12 }} />
          <img src="https://komarev.com/ghpvc/?username=patocg" alt="Profile Views" style={{ marginLeft: 12 }}/>
        </div>

        <p style={{ fontSize: "1.15rem", color: "#222", marginBottom: 0 }}>
          Tecnologia, código e inovação fazem parte da minha trajetória — brasileiro apaixonado por transformar ideias em soluções práticas!
        </p>
        <p style={{ margin: "18px 0", fontSize: "1rem" }}>
          <a href="https://jnths.com.br/" target="_blank" rel="noopener noreferrer">🌐 Meu site</a> ·{" "}
          <a href="https://linkedin.com/in/jonathas-lima-cunha-60070839/" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a> ·{" "}
          <a href="https://www.instagram.com/jonathas.cunha/" target="_blank" rel="noopener noreferrer">📸 Instagram</a> ·{" "}
          <a href="https://github.com/patocg" target="_blank" rel="noopener noreferrer">🐙 GitHub</a>
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
          <li>💡 <strong>Aprendizado contínuo</strong> e autêntico — sempre testando novas ferramentas, frameworks e boas práticas.</li>
        </ul>

        <hr style={{ margin: "32px 0" }}/>

        <h2>🛠️ Linguagens e Ferramentas</h2>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" height="32"/>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" alt="Flask" height="32"/>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" height="32"/>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" height="32"/>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JS" height="32"/>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" height="32"/>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" height="32"/>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="VSCode" height="32"/>
        </div>

        <hr style={{ margin: "32px 0" }}/>

        <h2>📖 O que você encontra aqui</h2>
        <ul>
          <li>Tutoriais, códigos e exemplos práticos para quem está começando ou quer aprimorar projetos pessoais.</li>
          <li>Soluções para automação de tarefas, integração de APIs, uso de Python em projetos reais.</li>
          <li>Dicas de configuração, uso de ferramentas modernas e integração com Vercel e cloud hosting.</li>
        </ul>

        <hr style={{ margin: "32px 0" }}/>

        <h2>📊 Estatísticas & Linguagens</h2>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center"
        }}>
          <img src="https://github-readme-stats.vercel.app/api?username=patocg&show_icons=true&count_private=true&theme=dracula"
               alt="Jonathas GitHub Stats" style={{ width: 420, maxWidth: "100%", borderRadius: 8 }}/>
          <img src="https://github-readme-stats.vercel.app/api/top-langs?username=patocg&show_icons=true&locale=pt-br&layout=compact&theme=dracula"
               alt="Top Languages" style={{ width: 420, maxWidth: "100%", borderRadius: 8 }}/>
        </div>

        <hr style={{ margin: "32px 0" }}/>

        <h2>🌱 Aprendizados & Inspiração</h2>
        <blockquote style={{ fontStyle: "italic", fontSize: "1.05rem", color: "#555" }}>
          “Tecnologia é ferramenta de crescimento, aprendizado e conexão de pessoas. Evoluir todo dia é parte do processo!”
        </blockquote>

        <hr style={{ margin: "32px 0" }}/>

        <h2>⚡ Links rápidos</h2>
        <ul>
          <li><a href="https://jnths.com.br/" target="_blank" rel="noopener noreferrer">Site Pessoal</a></li>
          <li><a href="https://linkedin.com/in/jonathas-lima-cunha-60070839/" target="_blank" rel="noopener noreferrer">Perfil no LinkedIn</a></li>
          <li><a href="https://www.instagram.com/jonathas.cunha/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="https://github.com/patocg" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href="https://w3schools.com/" target="_blank" rel="noopener noreferrer">Ferramentas recomendadas</a></li>
        </ul>
        <div style={{ textAlign: "center", marginTop: 32, color: "#888", fontSize: "0.95rem" }}>
          <sub>Feito com 💻 por Jonathas Cunha · Atualizado: Novembro 2025</sub>
        </div>
      </section>
    </main>
  );
}


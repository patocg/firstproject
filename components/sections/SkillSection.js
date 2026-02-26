export default function SkillsSection() {
  return (
    <section style={{ maxWidth: 900, margin: "32px auto", background: "#fff", borderRadius: 12, padding: "0 32px 32px", boxShadow: "0 0 12px #eee" }}>
      <h2>🛠️ Linguagens e Ferramentas</h2>
      
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
    </section>
  );
}

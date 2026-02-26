export default function StatsSection() {
  return (
    <section style={{ maxWidth: 900, margin: "32px auto", background: "#fff", borderRadius: 12, padding: "32px", boxShadow: "0 0 12px #eee" }}>
      <h2>Estatisticas Linguagens</h2>
      
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
        .card-3 { animation-delay: 0.3s; }
        .card-4 { animation-delay: 0.4s; }
      `}</style>
      
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", alignItems: "flex-start", padding: "0 16px" }}>
        
        {/* Card 1 */}
        <div className="card-animate card-1" style={{ display: "flex", flexDirection: "column", gap: 8, flex: "1 1 300px", minWidth: 280 }}>
          <label style={{ fontSize: "0.95rem", fontWeight: "600", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" }}>GitHub Stats</label>
          <div style={{ transition: "all 0.3s ease", cursor: "pointer", border: "3px solid #FF6B6B", borderRadius: 8, padding: 2, background: "#fff" }}
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
            <img src="https://github-readme-stats-kappa-eight-10.vercel.app/api?username=patocg&show_icons=true&count_private=true&theme=dracula" alt="GitHub Stats" style={{ maxWidth: "100%", width: "100%", borderRadius: 6, display: "block" }} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="card-animate card-2" style={{ display: "flex", flexDirection: "column", gap: 8, flex: "1 1 300px", minWidth: 280 }}>
          <label style={{ fontSize: "0.95rem", fontWeight: "600", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" }}>Top Languages</label>
          <div style={{ transition: "all 0.3s ease", cursor: "pointer", border: "3px solid #4ECDC4", borderRadius: 8, padding: 2, background: "#fff" }}
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
            <img src="https://github-readme-stats-kappa-eight-10.vercel.app/api/top-langs?username=patocg&show_icons=true&locale=pt-br&theme=dracula" alt="Top Languages" style={{ maxWidth: "100%", width: "100%", borderRadius: 6, display: "block" }} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="card-animate card-3" style={{ display: "flex", flexDirection: "column", gap: 8, flex: "1 1 300px", minWidth: 280 }}>
          <label style={{ fontSize: "0.95rem", fontWeight: "600", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" }}>Top Repository</label>
          <div style={{ transition: "all 0.3s ease", cursor: "pointer", border: "3px solid #6C5CE7", borderRadius: 8, padding: 2, background: "#fff" }}
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
            <img src="https://github-readme-stats-kappa-eight-10.vercel.app/api/pin/?username=patocg&repo=jnths&theme=dracula" alt="Top Repository" style={{ maxWidth: "100%", width: "100%", borderRadius: 6, display: "block" }} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="card-animate card-4" style={{ display: "flex", flexDirection: "column", gap: 8, flex: "1 1 300px", minWidth: 280 }}>
          <label style={{ fontSize: "0.95rem", fontWeight: "600", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" }}>Contributions</label>
          <div style={{ transition: "all 0.3s ease", cursor: "pointer", border: "3px solid #A29BFE", borderRadius: 8, padding: 2, background: "#fff" }}
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
            <img src="https://github-readme-stats-kappa-eight-10.vercel.app/api?username=patocg&theme=dracula&hide=stars,contribs&show=reviews,discussions_started,prs_merged_percentage" alt="Contributions" style={{ maxWidth: "100%", width: "100%", borderRadius: 6, display: "block" }} />
          </div>
        </div>
      </div>

      <hr style={{ margin: "32px 0" }} />
    </section>
  );
}

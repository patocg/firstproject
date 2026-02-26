import { signIn } from "next-auth/react";

export default function AlbumSection() {
  return (
    <div
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
            e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.25)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
          }}
        >
          Entrar com Google para ver álbuns
        </button>
      </div>
    </div>
  );
}

// pages/auth/error.js
import { useRouter } from "next/router";
import Link from "next/link";

export default function AuthErrorPage() {
  const { query } = useRouter();
  const error = query.error;

  let message = "Não foi possível acessar o álbum.";
  if (error === "not_allowed") {
    message =
      "Seu e-mail não está autorizado a acessar este álbum privado da família.";
  } else if (error === "no_email") {
    message =
      "Não foi possível encontrar um e-mail válido na sua conta Google.";
  }

  return (
    <div style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}>
      <h1>⚠️ Acesso restrito</h1>
      <p style={{ marginTop: 16 }}>{message}</p>
      <p style={{ marginTop: 8 }}>
        Se você acha que isso é um engano, entre em contato com o Jonathas para
        liberar o seu e-mail.
      </p>

      <div style={{ marginTop: 24 }}>
        <Link href="/">
          <a
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#111827",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Voltar para a página inicial
          </a>
        </Link>
      </div>
    </div>
  );
}

import { useRouter } from "next/router";
import Link from "next/link";

export default function AuthErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  // Mensagem padrão
  let title = "Erro na autenticação";
  let description =
    "Algo deu errado ao tentar fazer login. Tente novamente em alguns instantes.";
  let details = "";

  // Interpreta códigos do NextAuth
  switch (error) {
    case "AccessDenied":
      // Geralmente quando algum callback (ex.: signIn) retorna false
      title = "Acesso não autorizado";
      description =
        "Seu login foi realizado, mas o acesso a este sistema foi negado.";
      details =
        "Se você acha que deveria ter acesso, fale com o responsável e informe o e-mail usado no login.";
      break;

    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthAccountNotLinked":
      title = "Erro ao conectar com o Google";
      description =
        "Não foi possível completar o login com a sua conta Google.";
      details =
        "Verifique se você autorizou o acesso corretamente e tente novamente. Se o problema persistir, tente outra conta ou volte mais tarde.";
      break;

    case "Configuration":
      title = "Erro de configuração";
      description =
        "Há um problema na configuração de autenticação do sistema.";
      details =
        "O administrador deve verificar as credenciais do provedor e as variáveis de ambiente.";
      break;

    default:
      title = "Erro na autenticação";
      description =
        "Algo inesperado aconteceu durante o login. Tente novamente.";
      details = error ? `Código do erro: ${error}` : "";
      break;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
        padding: 16,
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          padding: 24,
          borderRadius: 12,
          background: "#fff",
          boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 40,
            marginBottom: 8,
            color: "#ef4444",
          }}
        >
          ✕
        </div>

        <h1
          style={{
            fontSize: "1.6rem",
            marginBottom: 8,
            color: "#111827",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            marginBottom: 12,
            color: "#4b5563",
            fontSize: "0.95rem",
          }}
        >
          {description}
        </p>

        {details && (
          <div
            style={{
              marginTop: 8,
              marginBottom: 16,
              padding: 10,
              borderRadius: 8,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "0.9rem",
              textAlign: "left",
            }}
          >
            {details}
          </div>
        )}

        <Link href="/" legacyBehavior>
          <a
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
              padding: "8px 18px",
              borderRadius: 999,
              border: "none",
              background: "#111827",
              color: "#fff",
              fontWeight: 500,
              fontSize: "0.95rem",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            ← Voltar para a Home
          </a>
        </Link>
      </div>
    </main>
  );
}

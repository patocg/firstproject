import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn() {
  const router = useRouter();

  return (
    <div style={{
      maxWidth: '600px',
      margin: '100px auto',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1>🔐 Fazer Login</h1>
      
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px' }}>
        Faça login com sua conta Google para acessar sua área privada
      </p>

      <button 
        onClick={() => signIn("google", { callbackUrl: "/album" })}
        style={{
          padding: '12px 30px',
          background: '#1f2937',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#111827';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#1f2937';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        ✓ Entrar com Google
      </button>

      <p style={{ marginTop: '20px' }}>
        <button 
          onClick={() => router.push('/')}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          ← Voltar para Home
        </button>
      </p>
    </div>
  );
}

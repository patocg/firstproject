import { useRouter } from 'next/router';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div style={{
      maxWidth: '600px',
      margin: '100px auto',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1>❌ Erro na Autenticação</h1>
      
      <p style={{ fontSize: '1.1rem', color: '#666' }}>
        Algo deu errado ao tentar fazer login com Google.
      </p>

      {error && (
        <div style={{
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          padding: '10px',
          margin: '20px 0',
          color: '#c00',
        }}>
          <strong>Erro:</strong> {error}
        </div>
      )}

      <p style={{ marginTop: '20px' }}>
        <button 
          onClick={() => router.push('/')}
          style={{
            padding: '10px 20px',
            background: '#111827',
            color: '#fff',
            border: 'none',
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

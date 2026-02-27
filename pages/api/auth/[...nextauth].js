import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Importa DynamoDB DocumentClient e GetCommand para ler whitelist
import { ddb } from "../../../lib/dynamo";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

// ✅ Rate Limiting simples
const loginAttempts = new Map();

function checkLoginRateLimit(email) {
  const now = Date.now();
  const key = email;
  
  if (!loginAttempts.has(key)) {
    loginAttempts.set(key, []);
  }
  
  const attempts = loginAttempts.get(key);
  const recentAttempts = attempts.filter(
    time => now - time < 15 * 60 * 1000 // 15 minutos
  );
  
  if (recentAttempts.length >= 5) { // Máximo 5 tentativas
    return false;
  }
  
  recentAttempts.push(now);
  loginAttempts.set(key, recentAttempts);
  return true;
}

// 🔁 Aqui só empacotamos a config em authOptions
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  
  callbacks: {
  async signIn({ user }) {
    // Se por algum motivo não houver email, bloqueia
    if (!user?.email) {
      console.warn("[NextAuth] Usuário sem email, bloqueando.");
      return false;
    }

    const email = user.email.toLowerCase();

    // Dono sempre tem acesso
    const OWNER_EMAIL = "jonathas.lima.cunha@gmail.com";
    if (email === OWNER_EMAIL.toLowerCase()) {
      return true;
    }

    try {
      // Lê diretamente na tabela whitelist se esse email existe
      const command = new GetCommand({
        TableName: process.env.DYNAMO_TABLE_WHITELIST,
        Key: {
          email, // PK da tabela whitelist
        },
      });

      const data = await ddb.send(command);

      if (!data.Item) {
        // Não está na whitelist → bloqueia login
        console.warn(`[NextAuth] Email não autorizado: ${email}`);
        // false aqui cancela o signIn
        return false;
      }

      // Está na whitelist → login permitido
      return true;
    } catch (err) {
      console.error("[NextAuth] Erro ao checar whitelist no DynamoDB:", err);
      // Em caso de erro de infra, melhor bloquear por segurança
      return false;
    }
  },

    async jwt({ token, user }) {
      if (user) token.email = user.email;
      return token;
    },
    async session({ session, token }) {
      session.user.email = token.email;
      return session;
    },
  },
};

// ✅ Export default continua igual, só usando authOptions
export default NextAuth(authOptions);

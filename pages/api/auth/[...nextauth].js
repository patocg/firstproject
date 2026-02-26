import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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

export default NextAuth({
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
      const email = user?.email?.toLowerCase();
      
      // ✅ Verificar rate limit
      if (!checkLoginRateLimit(email)) {
        console.warn(`[NextAuth] Rate limit atingido para: ${email}`);
        return "/auth/error?error=too_many_attempts";
      }
      
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(",").map(e => e.trim()) || [];
      return allowedEmails.includes(email);
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
});

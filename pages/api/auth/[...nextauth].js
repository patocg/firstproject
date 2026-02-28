import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Cliente Dynamo configurado para acessar o DynamoDB
import { ddb } from "../../../lib/dynamo";
// Comando de leitura simples (GetItem) do DynamoDB
import { GetCommand } from "@aws-sdk/lib-dynamodb";
// Função para logar tentativas de acesso negadas
import { logDeniedAccess } from "../../../lib/authLogs";

// ===================================================================
// RATE LIMIT POR E-MAIL (EM MEMÓRIA)
// ===================================================================
// Mapa em memória: email -> [timestamps das tentativas de login]
const loginAttempts = new Map();

/**
 * checkLoginRateLimit(email)
 *
 * Objetivo:
 * - Limitar o número de tentativas de login por e-mail em uma janela de tempo.
 * - Aqui estamos usando um limite simples: até 5 tentativas a cada 15 minutos.
 *
 * Como funciona:
 * - Mantém um array de timestamps (Date.now()) por email.
 * - Remove tentativas mais antigas que 15 minutos.
 * - Se ainda restarem 5 ou mais tentativas recentes, bloqueia.
 */
function checkLoginRateLimit(email) {
  const now = Date.now();
  const key = email.toLowerCase(); // normaliza para evitar duplicidade por case

  if (!loginAttempts.has(key)) {
    loginAttempts.set(key, []);
  }

  // Mantém apenas tentativas dos últimos 15 minutos
  const attempts = loginAttempts.get(key).filter(
    (time) => now - time < 15 * 60 * 1000
  );

  // Se já tem 5 ou mais tentativas recentes, bloqueia este login
  if (attempts.length >= 5) {
    console.warn("[NextAuth] Rate limit atingido para:", key);
    return false;
  }

  // Caso ainda não tenha estourado o limite, registramos esta tentativa
  attempts.push(now);
  loginAttempts.set(key, attempts);
  return true;
}

// ===================================================================
// CONFIGURAÇÃO DO NEXTAUTH
// ===================================================================
export const authOptions = {
  // Provedores de autenticação disponíveis (por enquanto, apenas Google)
  providers: [
    GoogleProvider({
      // ID e secret do app do Google (OAuth)
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // Páginas customizadas de signIn/erro (rotas do seu app)
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  // Callbacks permitem customizar o fluxo de autenticação
  callbacks: {
    /**
     * signIn({ user, account, profile })
     *
     * Objetivo:
     * - Decidir se o login pode ou não ser concluído.
     * - Aqui aplicamos:
     *   - bypass para o OWNER
     *   - rate limit por email
     *   - verificação na tabela whitelist do DynamoDB
     */
    async signIn({ user, account, profile }) {
      // 1) Sem email, não conseguimos aplicar whitelist → bloqueia
      if (!user?.email) {
        console.warn("[NextAuth] Usuário sem email, bloqueando signIn.");
        return false;
      }

      const email = user.email.toLowerCase();
      const OWNER_EMAIL = "jonathas.lima.cunha@gmail.com";

      // 2) Dono sempre tem acesso (bypass de whitelist)
      //    Isso garante que você sempre consegue entrar para manutenção,
      //    mesmo se a whitelist ou Dynamo tiverem algum problema.
      if (email === OWNER_EMAIL.toLowerCase()) {
        console.info("[NextAuth] OWNER liberado:", email);
        return true;
      }

      // 3) Aplica rate limit básico por email
      //    Se o limite for excedido, o login é negado imediatamente.
      const allowedByRateLimit = checkLoginRateLimit(email);
      if (!allowedByRateLimit) {
        // Aqui poderíamos integrar com ferramenta de observabilidade
        // para acompanhar tentativas excessivas de login.
        return false;
      }

      // 4) Garante que o nome da tabela de whitelist está definido nas envs
      const tableName = process.env.DYNAMO_TABLE_WHITELIST;
      if (!tableName) {
        console.error(
          "[NextAuth] DYNAMO_TABLE_WHITELIST não configurada nas envs."
        );
        // Em produção, isso bloqueia todo mundo que não é OWNER.
        return false;
      }

      try {
        console.info(
          "[NextAuth] Checando whitelist no DynamoDB:",
          email,
          "tabela:",
          tableName
        );

        // 5) Monta e envia um GetCommand para buscar o registro da whitelist
        //    PK = email (minúsculo, consistente com o cadastro)
        const command = new GetCommand({
          TableName: tableName,
          Key: { email },
        });

        const data = await ddb.send(command);

        console.info("[NextAuth] Resultado whitelist DynamoDB:", {
          found: !!data?.Item,
        });

        // 6) Se não encontrou item na whitelist, login é negado
        if (!data || !data.Item) {
          console.warn("[NextAuth] Email não autorizado (whitelist):", email);

          // Registra tentativa de acesso negada na tabela de logs
          logDeniedAccess(email, "NOT_IN_WHITELIST");

          return false;
        }

        // Se um dia quiser adicionar flag de ativo/inativo:
        // if (data.Item.active === false) {
        //   console.warn("[NextAuth] Email na whitelist, mas marcado como inativo:", email);
        //   return false;
        // }

        // 7) Se chegou aqui, o email está autorizado pela whitelist
        console.info("[NextAuth] Email autorizado via whitelist:", email);
        return true;
      } catch (err) {
        // 8) Qualquer erro de infra (Dynamo, credencial, rede) é tratado aqui
        //    Por segurança, preferimos negar o login em vez de abrir acesso indevido.
        console.error(
          "[NextAuth] Erro ao checar whitelist no DynamoDB:",
          err
        );
        return false;
      }
    },

    /**
     * jwt({ token, user })
     *
     * Objetivo:
     * - Customizar o conteúdo do JWT que o NextAuth mantém no cookie.
     * - Aqui garantimos que o email do usuário fique dentro de token.email.
     */
    async jwt({ token, user }) {
      // Quando o login acontece, "user" vem preenchido
      // nas requisições seguintes só temos "token".
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },

    /**
     * session({ session, token })
     *
     * Objetivo:
     * - Controlar o que vai para o objeto "session" consumido pelo front.
     * - Aqui copiamos o email do token para session.user.email.
     */
    async session({ session, token }) {
      if (token?.email) {
        session.user.email = token.email;
      }
      return session;
    },
  },
};

// Export default da configuração de autenticação
export default NextAuth(authOptions);

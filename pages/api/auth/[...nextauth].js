// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const allowedEmails =
    process.env.ALLOWED_EMAILS?.split(",").map((e) => e.trim()) || [];

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        // Opcional: se quiser uma página de erro dedicada
        error: "/auth/error",
    },
    callbacks: {
        async signIn({ user }) {
            const email = user?.email || "";
            if (!email) return "/auth/error?error=no_email";

            if (allowedEmails.includes(email)) {
                return true;
            }

            // Redireciona pra página de erro amigável
            return "/auth/error?error=not_allowed";
        },
        async jwt({ token, profile }) {
            if (profile?.email) {
                token.email = profile.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.email) {
                session.user.email = token.email;
            }
            return session;
        },
    },
});

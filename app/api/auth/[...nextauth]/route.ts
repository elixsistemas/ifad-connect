// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUserPassword } from "@/app/services/user";
import { prisma } from "@/app/lib/prisma";
import type { AppRole } from "@/types/next-auth"; 

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Informe e-mail e senha");
        }

        const user = await verifyUserPassword(
          credentials.email,
          credentials.password
        );

        if (!user) {
          throw new Error("Credenciais inválidas");
        }

        // Aqui o objeto precisa bater com o tipo User que definimos no .d.ts
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as any,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      try {
        const userId = user?.id;
        if (!userId) return true;

        await prisma.user.update({
          where: { id: userId },
          data: {
            lastLoginAt: new Date(),
            lastActivityAt: new Date(),
          },
        });
      } catch (err) {
        console.error("Erro ao registrar lastLoginAt/lastActivityAt:", err);
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        if (token.id) {
          session.user.id = token.id;
        }
        if (token.role) {
          session.user.role = token.role;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

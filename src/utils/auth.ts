import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import { compare } from "bcryptjs";

const sellerRepository = new PrismaSellerRepository();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  },
  callbacks: {
    async jwt({ token, user }) {
      // Adiciona dados do usuário ao token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Adiciona dados do token à sessão
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Buscar vendedor pelo email
          const seller = await sellerRepository.findByEmail(credentials.email);
          if (!seller) return null;

          // Verificar senha
          const passwordMatch = await compare(credentials.password, seller.password);
          if (!passwordMatch) return null;

          // Retornar dados do usuário autenticado
          return {
            id: seller.id,
            name: seller.name,
            email: seller.email,
          };
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      }
    })
  ],
};
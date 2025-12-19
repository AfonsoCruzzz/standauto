import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@stand.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await (prisma as any).user.findUnique({
            where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (isPasswordValid) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // Certifica-te que o teu schema Prisma tem este campo
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Passa a role do user para o token JWT
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      // Passa a role do token para a sessão do cliente
      if (session.user) {
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/login', // Opcional: página de login customizada
  }
}
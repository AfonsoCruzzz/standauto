import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Verifica se é uma rota de admin e se o utilizador NÃO é admin
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/login?message=NotAuthorized", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Requer que o utilizador esteja logado
    },
  }
)

export const config = { matcher: ["/admin/:path*", "/perfil/:path*"] }
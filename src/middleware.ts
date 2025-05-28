import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Buscar o token do NextAuth
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Rotas que requerem autenticação
  const protectedRoutes = ["/products", "/orders"];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  );
  
  // Se for rota protegida e usuário não estiver autenticado
  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // Rotas de autenticação (login/registro)
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Redirecionar usuários autenticados tentando acessar login/registro
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/products", request.url));
  }
  
  // Proteger rotas de API e adicionar o ID do seller no cabeçalho
  const protectedApiRoutes = ["/api/v1/orders", "/api/v1/products"];
  const isProtectedApiRoute = protectedApiRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedApiRoute) {
    if (!token) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    // Adicionar ID do seller no cabeçalho para as APIs
    const response = NextResponse.next();
    if (token.sub) {
      response.headers.set("X-User-Id", token.sub);
    }
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/products/:path*", 
    "/orders/:path*",
    "/api/v1/orders/:path*", 
    "/api/v1/products/:path*",
    "/login",
    "/register",
    "/products",
    "/orders"
  ],
};
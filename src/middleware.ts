import { NextResponse, NextRequest} from "next/server";

export function middleware(request: NextRequest) {
  const publicRoutes = [
    '/api/v1/auth/login',
    '/api/v1/auth/register',
  ];
  
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  const token = request.cookies.get("auth_token")?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized - Authentication required" },
      { status: 401 }
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/v1/:path*']
};
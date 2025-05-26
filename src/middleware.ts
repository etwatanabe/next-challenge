import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/utils/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized - Authentication required" },
      { status: 401 }
    );
  }

  try {
    const decoded = await verifyToken(token);

    const response = NextResponse.next();
    if (decoded.sub) {
      response.headers.set("X-User-Id", decoded.sub);
    }

    return response;
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/api/v1/orders/:path*",
    "/api/v1/products/:path*",
  ],
};

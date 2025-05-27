import { NextResponse } from "next/server";

// POST: Log out a seller
export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.delete("auth_token");

    return response;
  } catch (error) {
    console.error("Error logging out:", error);
    return new Response(JSON.stringify({ error: "Failed to log out" }), {
      status: 500,
    });
  }
}

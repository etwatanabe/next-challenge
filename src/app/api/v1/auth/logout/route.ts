import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// POST: Log out a seller
export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete("auth_token");

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging out:", error);
    return new Response(JSON.stringify({ error: "Failed to log out" }), {
      status: 500,
    });
  }
}

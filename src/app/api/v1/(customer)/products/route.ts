import { NextResponse } from "next/server";
import { listProductPublicUseCase } from "@/factories/productUseCaseFactory";

// GET: List all products for public use
export async function GET() {
  try {
    const products = await listProductPublicUseCase.execute();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

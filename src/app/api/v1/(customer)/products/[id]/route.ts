import { NextRequest, NextResponse } from "next/server";
import { getProductByIdUseCase } from "@/usecases/product/factory/productUseCaseFactory";

// GET: Get product by ID for public use
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const product = await getProductByIdUseCase.execute(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

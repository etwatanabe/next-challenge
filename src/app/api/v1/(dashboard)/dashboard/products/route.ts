import { NextRequest, NextResponse } from "next/server";
import {
  createProductUseCase,
  listProductBySellerIdUseCase,
} from "@/factories/productUseCaseFactory";

// GET: Fetch all products
export async function GET(request: NextRequest) {
  try {
    const sellerId = request.headers.get("X-User-Id");

    const products = await listProductBySellerIdUseCase.execute(sellerId!);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Create a new product
export async function POST(request: NextRequest) {
  try {
    const { name, description, price, imageUrl, isActive } = await request.json();

    const sellerId = request.headers.get("X-User-Id");

    const product = await createProductUseCase.execute({
      name: name,
      description: description,
      price: price,
      imageUrl: imageUrl,
      sellerId: sellerId!,
      isActive: isActive ?? true,
    });
    if (!product) {
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 400 }
      );
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

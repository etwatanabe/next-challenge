import { NextRequest, NextResponse } from "next/server";
import {
  createProductUseCase,
  listProductUseCase,
} from "@/factories/productUseCaseFactory";
import { CreateProductDTO } from "@/core/dtos/product/CreateProductDTO";

// GET: Fetch all products
export async function GET(request: NextRequest) {
  try {
    const sellerId = request.headers.get("X-User-Id");

    const useCase = listProductUseCase;

    const products = await useCase.execute(sellerId!);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST: Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const sellerId = request.headers.get("X-User-Id");

    const data: CreateProductDTO = {
      name: body.name,
      description: body.description,
      price: body.price,
      imageUrl: body.imageUrl,
      sellerId: sellerId!,
    };

    const useCase = createProductUseCase;

    const product = await useCase.execute(data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { ListProductUseCase } from "@/core/usecases/product/ListProductUseCase";
import { CreateProductUseCase } from "@/core/usecases/product/CreateProductUseCase";
import { PrismaProductRepository } from "@/infra/prisma/PrismaProductRepository";

const repository = new PrismaProductRepository();

// GET: Fetch all products
export async function GET() {
  try {
    const useCase = new ListProductUseCase(repository);

    const products = await useCase.execute();

    return NextResponse.json(products);
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
    const data = await request.json();
    const useCase = new CreateProductUseCase(repository);

    const product = await useCase.execute(data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
};

import { UpdateProductDTO } from "@/core/dtos/product/UpdateProductDTO";
import {
  getProductByIdUseCase,
  updateProductUseCase,
  deleteProductUseCase,
} from "@/factories/productUseCaseFactory";
import { NextRequest, NextResponse } from "next/server";

// GET: Get a product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const sellerId = request.headers.get("X-User-Id");

    const useCase = getProductByIdUseCase;

    const product = await useCase.execute(id, sellerId!);
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error getting product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update a product by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    

    const body = await request.json();

    const data: UpdateProductDTO = {
      id,
      name: body.name,
      description: body.description,
      price: body.price,
      imageUrl: body.imageUrl,
      sellerId: request.headers.get("X-User-Id")!,
    };

    const updateUseCase = updateProductUseCase;

    const product = await updateUseCase.execute(data);
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const sellerId = request.headers.get("X-User-Id");

    const useCase = deleteProductUseCase;

    await useCase.execute(id, sellerId!);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

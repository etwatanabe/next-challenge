import { DeleteProductDTO } from "@/core/dtos/product/DeleteProductDTO";
import { GetProductDTO } from "@/core/dtos/product/GetProductDTO";
import { UpdateProductDTO } from "@/core/dtos/product/UpdateProductDTO";
import {
  deleteProductUseCase,
  getProductByIdUseCase,
  updateProductUseCase,
} from "@/factories/productUseCaseFactory";
import { NextRequest, NextResponse } from "next/server";

// GET: Get a product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const useCase = getProductByIdUseCase;

    const data: GetProductDTO = {
      id: id,
      sellerId: request.headers.get("X-User-Id")!,
    };

    const product = await useCase.execute(data);
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error getting product:", error);
    return NextResponse.json(
      { error: "Failed to get product" },
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
      { error: "Failed to update product" },
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

    const useCase = deleteProductUseCase;

    const data: DeleteProductDTO = {
      id: id,
      sellerId: request.headers.get("X-User-Id")!,
    };

    await useCase.execute(data);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

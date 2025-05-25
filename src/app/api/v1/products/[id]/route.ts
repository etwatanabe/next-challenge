import { GetProductUseCase } from "@/core/usecases/product/GetProductUseCase";
import { UpdateProductUseCase } from "@/core/usecases/product/UpdateProductUseCase";
import { DeleteProductUseCase } from "@/core/usecases/product/DeleteProductUseCase";
import { PrismaProductRepository } from "@/infra/prisma/PrismaProductRepository";
import { NextRequest, NextResponse } from "next/server";

const repository = new PrismaProductRepository();

// GET: Get a product by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; 

    const useCase = new GetProductUseCase(repository);

    const product = await useCase.execute(id);

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
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
    const data = await request.json();
    const { id } = params;
    
    const getUseCase = new GetProductUseCase(repository);

    const product = await getUseCase.execute(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    product.name = data.name ?? product.name;
    product.description = data.description ?? product.description;
    product.price = data.price ?? product.price;
    product.imageUrl = data.imageUrl ?? product.imageUrl;

    const updateUseCase = new UpdateProductUseCase(repository);
    const updatedProduct = await updateUseCase.execute(id, product);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const useCase = new DeleteProductUseCase(repository);

    await useCase.execute(id);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

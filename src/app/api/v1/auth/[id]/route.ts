import { DeleteSellerUseCase } from "@/core/usecases/seller/DeleteSellerUseCase";
import { UpdateSellerUseCase } from "@/core/usecases/seller/UpdateSellerUseCase";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import { NextRequest, NextResponse } from "next/server";

const repository = new PrismaSellerRepository();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const useCase = new DeleteSellerUseCase(repository);

    await useCase.execute(id);

    return NextResponse.json({ message: "Seller deleted successfully" });
  } catch (error) {
    console.error("Error deleting seller:", error);
    return NextResponse.json(
      { error: "Failed to delete seller" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();

    const useCase = new UpdateSellerUseCase(repository);

    const seller = await useCase.execute(id, data);

    return NextResponse.json(seller);
  } catch (error) {
    console.error("Error updating seller:", error);
    return NextResponse.json(
      { error: "Failed to update seller" },
      { status: 500 }
    );
  }
}
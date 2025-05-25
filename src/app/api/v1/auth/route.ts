import { CreateSellerUseCase } from "@/core/usecases/seller/CreateSellerUseCase";
import { ListSellerUseCase } from "@/core/usecases/seller/ListSellerUseCase";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import { NextRequest, NextResponse } from "next/server";

const repository = new PrismaSellerRepository();

// POST: Create a new user(seller)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const useCase = new CreateSellerUseCase(repository);

    const seller = await useCase.execute(data);

    return NextResponse.json(seller);
  } catch (error) {
    console.error("Error creating seller:", error);
    return NextResponse.json(
      { error: "Failed to create seller" },
      { status: 500 }
    );
  }
}

// GET: List all users(sellers)
export async function GET() {
  try {
    const useCase = new ListSellerUseCase(repository);

    const sellers = await useCase.execute();

    return NextResponse.json(sellers);
  } catch (error) {
    console.error("Error listing sellers:", error);
    return NextResponse.json(
      { error: "Failed to list sellers" },
      { status: 500 }
    );
  }
}

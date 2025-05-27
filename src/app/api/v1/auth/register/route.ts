import { CreateSellerUseCase } from "@/core/usecases/seller/RegisterSellerUseCase";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import { NextRequest, NextResponse } from "next/server";

const repository = new PrismaSellerRepository();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const useCase = new CreateSellerUseCase(repository);

    const seller = await useCase.execute({
      name,
      email,
      password,
      products: [],
      orders: [],
    });

    return NextResponse.json(
      {
        id: seller.id,
        name: seller.name,
        email: seller.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating seller:", error);
    return NextResponse.json(
      { error: "Failed to create seller" },
      { status: 500 }
    );
  }
}

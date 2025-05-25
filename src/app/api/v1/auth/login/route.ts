import { AuthenticateSellerUseCase } from "@/core/usecases/seller/AuthenticateSellerUseCase";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import { NextRequest, NextResponse } from "next/server";

const repository = new PrismaSellerRepository();

// POST: Authenticate a seller (login)
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const useCase = new AuthenticateSellerUseCase(repository);
    
    const response = await useCase.execute({ email, password});

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating seller:", error);
    return NextResponse.json(
      { error: "Failed to create seller" },
      { status: 500 }
    );
  }
}

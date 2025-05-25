import { CreateSellerUseCase } from "@/core/usecases/seller/CreateSellerUseCase";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const repository = new PrismaSellerRepository();

// POST: Create a new seller (Register)
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const useCase = new CreateSellerUseCase(repository);

    const response = await useCase.execute({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating seller:", error);
    return NextResponse.json({
      error: "Failed to create seller",
      status: 500,
    });
  }
}

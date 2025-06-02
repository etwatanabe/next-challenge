import { registerSellerUseCase } from "@/usecases/seller/factory/sellerUseCaseFactory";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),

  email: z
    .string()
    .email("Email inválido")
    .max(100, "Email deve ter no máximo 100 caracteres"),

  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número"
    ),
});

// POST: Register a new seller
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const validatedData = result.data;

    const useCase = registerSellerUseCase;

    const seller = await useCase.execute({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
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
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

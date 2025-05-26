import { AuthenticateSellerUseCase } from "@/core/usecases/seller/AuthenticateSellerUseCase";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import { NextRequest, NextResponse } from "next/server";

const repository = new PrismaSellerRepository();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const useCase = new AuthenticateSellerUseCase(repository);
    
    const { token, seller } = await useCase.execute({ email, password });

    // Criar resposta com os dados do vendedor
    const response = NextResponse.json(
      { 
        id: seller.id,
        name: seller.name,
        email: seller.email
      },
      { status: 200 }
    );

    // Definir cookie de autenticação
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    });

    return response;
  } catch (error) {
    console.error("Error authenticating seller:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
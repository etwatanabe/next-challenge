import { NextResponse } from "next/server";
import { listProductPublicUseCase } from "@/factories/productUseCaseFactory";

// GET: List all products for public use
export async function GET() {
  try {
    const useCase = listProductPublicUseCase;

    const product = await useCase.execute();

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return NextResponse.json(
      { error: "Falha ao buscar produto" },
      { status: 500 }
    );
  }
}

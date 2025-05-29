import { NextRequest, NextResponse } from "next/server";
import { getOrderByIdPublicUseCase } from "@/factories/orderUseCaseFactory";

// GET: Get order by ID for public use
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const order = await getOrderByIdPublicUseCase.execute(id);

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return NextResponse.json(
      { error: "Falha ao buscar pedido" },
      { status: 500 }
    );
  }
}

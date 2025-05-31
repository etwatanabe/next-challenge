import { getOrderByIdUseCase } from "@/factories/orderUseCaseFactory";
import { NextRequest, NextResponse } from "next/server";

// GET: Get an order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const sellerId = request.headers.get("X-User-Id");

    const useCase = getOrderByIdUseCase;

    const order = await useCase.execute(id, sellerId!);

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error getting order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

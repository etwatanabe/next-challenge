import { listOrdersUseCase } from "@/factories/orderUseCaseFactory";
import { NextRequest, NextResponse } from "next/server";

// GET: List all orders for a seller
export async function GET(request: NextRequest) {
  try {
    const sellerId = request.headers.get("X-User-Id");

    const useCase = listOrdersUseCase;

    const orders = await useCase.execute(sellerId!);

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 }
    );
  }
}

import { getOrderByIdUseCase } from "@/usecases/order/factory/orderUseCaseFactory";
import { NextRequest, NextResponse } from "next/server";

// GET: Get an order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const sellerId = request.headers.get("X-User-Id");

    const order = await getOrderByIdUseCase.execute(id, sellerId!);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error getting order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

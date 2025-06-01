import { getOrderStatusUseCase } from "@/usecases/order/factory/orderUseCaseFactory";
import { NextRequest, NextResponse } from "next/server";

// GET: Get order status by order ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const orderStatus = await getOrderStatusUseCase.execute(id);
    if (!orderStatus) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(orderStatus, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

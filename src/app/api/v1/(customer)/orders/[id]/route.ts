import { getOrderStatusUseCase } from "@/usecases/order/factory/orderUseCaseFactory";
import { NextRequest, NextResponse } from "next/server";

// GET: Get order status by order ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    const orderStatus = await getOrderStatusUseCase.execute(orderId);
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

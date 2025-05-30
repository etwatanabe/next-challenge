import { CreateOrderDTO } from "@/core/dtos/order/CreateOrderDTO";
import {
  listOrdersUseCase,
  createOrderUseCase,
} from "@/factories/orderUseCaseFactory";
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

// POST: Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const sellerId = request.headers.get("X-User-Id");

    const data: CreateOrderDTO = {
      sellerId: sellerId!,
      items: body.items,
    };

    const useCase = createOrderUseCase;

    const order = await useCase.execute(data);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
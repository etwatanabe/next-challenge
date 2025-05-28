import {
  addItemToOrderUseCase,
  getOrderByIdUseCase,
} from "@/factories/orderUseCaseFactory";
import { NextRequest, NextResponse } from "next/server";

//PUT: Add item to an order by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const { productId, quantity } = await request.json();

    const sellerId = request.headers.get("X-User-Id");

    const useCase = addItemToOrderUseCase;

    const order = await useCase.execute(id, productId, quantity, sellerId!);

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error adding item to order:", error);
    return NextResponse.json(
      { error: "Failed to add item to order" },
      { status: 500 }
    );
  }
}

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
    return NextResponse.json({ error: "Failed to get order" }, { status: 500 });
  }
}

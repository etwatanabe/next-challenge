import { createOrderUseCase } from "@/factories/orderUseCaseFactory";
import { NextRequest, NextResponse } from "next/server";

// POST: Create a new order with a product ID
export async function POST(request: NextRequest) {
  try {
    const { productId, customerName, customerEmail, customerPhone, customerAddress } = await request.json();
    if (!productId || !customerName || !customerEmail || !customerPhone || !customerAddress) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    
    const order = await createOrderUseCase.execute({
      productId: productId,
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      customerAddress: customerAddress,
    });
    if (!order) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 400 }
      );
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

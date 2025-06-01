import { NextRequest, NextResponse } from "next/server";
import { checkoutUseCase } from "@/usecases/product/factory/productUseCaseFactory";

// POST: Create a Stripe Checkout session for a product
export async function POST(request: NextRequest) {
  try {
    const {
      productId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
    } = await request.json();

    const origin = request.headers.get("origin");

    const sessionId = await checkoutUseCase.execute(
      {
        productId,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
      },
      origin!
    );

    return NextResponse.json({ sessionId: sessionId }, { status: 200 });
  } catch (error) {
    console.error("Error creating Stripe Session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

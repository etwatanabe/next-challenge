import { NextRequest, NextResponse } from "next/server";
import { getProductByIdUseCase } from "@/factories/productUseCaseFactory";
import { getSellerByProductIdUseCase } from "@/factories/sellerUseCaseFactory";
import { createOrderUseCase } from "@/factories/orderUseCaseFactory";
import stripe from "@/utils/stripe";

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

    const product = await getProductByIdUseCase.execute(productId);
    if (!product) {
      return NextResponse.json(
        { error: `Product with ID ${productId} not found` },
        { status: 404 }
      );
    }

    const seller = await getSellerByProductIdUseCase.execute(product.id);
    if (!seller) {
      return NextResponse.json(
        { error: `Seller for product ${product.id} not found` },
        { status: 404 }
      );
    }

    if (!seller.stripeAccountId) {
      return NextResponse.json(
        { error: "Seller does not have a configured Stripe account" },
        { status: 400 }
      );
    }

    const order = await createOrderUseCase.execute({
      productId: product.id,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
    });

    if (!order) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 400 }
      );
    }

    const platformFeePercent = 10;
    const platformFee = Math.round(product.price * platformFeePercent);

    const lineItems = [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.headers.get("origin")}/confirmation/${order.id}?success=true`,
      cancel_url: `${request.headers.get("origin")}/buy/${productId}?cancelled=true`,
      metadata: { orderId: order.id },
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: seller.stripeAccountId,
        },
      }
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.error("Error creating Stripe Session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

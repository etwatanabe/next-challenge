import { NextRequest, NextResponse } from "next/server";
import { getOrderByIdPublicUseCase } from "@/factories/orderUseCaseFactory";
import stripe from "@/utils/stripe";
import { getProductByIdUseCase } from "@/factories/productUseCaseFactory";
import { getSellerByProductIdUseCase } from "@/factories/sellerUseCaseFactory";

// POST: Create a Stripe Checkout session for an order
export async function POST(request: NextRequest) {
  try {
    const { orderId, customerEmail } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await getOrderByIdPublicUseCase.execute(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const seller = await getSellerByProductIdUseCase.execute(order.product.id);
    if (!seller) {
      return NextResponse.json(
        { error: `Seller for product ID ${order.product.id} not found.` },
        { status: 404 }
      );
    }

    const product = await getProductByIdUseCase.execute(
      order.product.id,
      seller.id
    );
    if (!product) {
      return NextResponse.json(
        { error: `Product with ID ${order.product.id} not found.` },
        { status: 404 }
      );
    }

    const lineItems = [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: product.name,
            description: product.description,
            images: product.imageUrl ? [product.imageUrl] : undefined,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail || order.customerEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.headers.get("origin")}/confirmation/${
        order.id
      }?success=true`,
      cancel_url: `${request.headers.get("origin")}/buy/${
        order.product.id
      }?cancelled=true`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.error("Error creating stripe session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

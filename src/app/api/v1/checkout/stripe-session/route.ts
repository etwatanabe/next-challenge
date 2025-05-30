import { NextRequest, NextResponse } from "next/server";
import { getOrderByIdPublicUseCase } from "@/factories/orderUseCaseFactory";
import stripe from "@/utils/stripe";

export async function POST(request: NextRequest) {
  try {
    const { orderId, customerEmail } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Buscar os detalhes do pedido
    const order = await getOrderByIdPublicUseCase.execute(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Criar items line para o Stripe
    const lineItems = order.items.map(item => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: `Produto #${item.productId.substring(0, 8)}`,
          description: `Quantidade: ${item.quantity}`,
        },
        unit_amount: Math.round(item.priceAtPurchase * 100), // Stripe usa centavos
      },
      quantity: item.quantity,
    }));

    // Criar a sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/confirmation/${order.id}?success=true`,
      cancel_url: `${request.headers.get('origin')}/buy/${order.items[0].productId}?cancelled=true`,
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
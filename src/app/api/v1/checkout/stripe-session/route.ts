import { NextRequest, NextResponse } from "next/server";
import stripe from "@/utils/stripe";
import { getOrderByIdPublicUseCase } from "@/factories/orderUseCaseFactory";

export async function POST(request: NextRequest) {
  try {
    const { orderId, customerEmail } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "ID do pedido não fornecido" },
        { status: 400 }
      );
    }

    // Buscar os detalhes do pedido
    const order = await getOrderByIdPublicUseCase.execute(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Criar items line para o Stripe
    const lineItems = order.items.map(item => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: `Produto #${item.productId.substring(0, 8)}`, // Idealmente, use o nome real do produto
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
    console.error("Erro ao criar sessão do Stripe:", error);
    return NextResponse.json(
      { error: "Falha ao processar pagamento" },
      { status: 500 }
    );
  }
}
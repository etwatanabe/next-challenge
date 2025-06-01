import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatusUseCase } from "@/factories/orderUseCaseFactory";
import { OrderStatus } from "@/core/domain/enums/OrderStatus";
import { headers } from "next/headers";
import stripe from "@/utils/stripe";

// POST: Handle Stripe webhook events
export async function POST(request: NextRequest) {
  const body = await request.text();
  const head = await headers();
  const signature = head.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (!session.metadata || !session.metadata.orderId) {
      return NextResponse.json(
        { error: "Missing orderId in session metadata" },
        { status: 400 }
      );
    }
    
    const orderId = session.metadata.orderId;

    try {
      const updated = await updateOrderStatusUseCase.execute(orderId, OrderStatus.COMPLETED);
      if (updated.status !== OrderStatus.COMPLETED) {
        return NextResponse.json(
          { error: "Order status update failed" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Error processing confirmed payment:", error);
      return NextResponse.json(
        { error: "Error processing payment" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/utils/stripe";
import { updateOrderStatusUseCase } from "@/factories/orderUseCaseFactory";
import { OrderStatus } from "@/core/domain/enums/OrderStatus";

// POST: Webhook handler for Stripe events
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const head = await headers();

    const signature = head.get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Webhook signature required" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case "checkout.session.completed":
        console.log("Processing checkout.session.completed");
        const session = event.data.object;
        console.log("Session ID:", session.id);
        console.log("Metadata:", session.metadata);

        if (session.metadata && session.metadata.orderId) {
          try {
            const updated = await updateOrderStatusUseCase.execute(
              session.metadata.orderId,
              OrderStatus.COMPLETED
            );
            console.log(
              `Order ${session.metadata.orderId} updated to COMPLETED:`,
              updated
            );
          } catch (error) {
            console.error(
              `Error updating order ${session.metadata.orderId}:`,
              error
            );
          }
        }
        break;

      case "payment_intent.succeeded":
        console.log("Processing payment_intent.succeeded");
        const paymentIntent = event.data.object;
        console.log("Payment Intent ID:", paymentIntent.id);
        break;

      case "transfer.created":
        console.log("Processing transfer.created");
        const transfer = event.data.object;
        console.log("Transfer ID:", transfer.id);
        break;

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 400 }
    );
  }
}

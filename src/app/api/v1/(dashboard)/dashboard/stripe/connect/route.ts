import { NextRequest, NextResponse } from "next/server";
import {
  checkStripeConnectionStatusUseCase,
  connectStripeAccountUseCase,
} from "@/usecases/seller/factory/sellerUseCaseFactory";

// POST: Create a Stripe Connect account link for a seller
export async function POST(request: NextRequest) {
  try {
    const sellerId = request.headers.get("X-User-Id");

    const origin = request.headers.get("origin");

    const accountLink = await connectStripeAccountUseCase.execute(
      sellerId!,
      origin!
    );

    return NextResponse.json({ url: accountLink }, { status: 200 });
  } catch (error) {
    console.error("Error creating Stripe account link:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe account" },
      { status: 500 }
    );
  }
}

// GET: Check the status of a Stripe Connect account for the current seller
export async function GET(request: NextRequest) {
  try {
    const sellerId = request.headers.get("X-User-Id");

    const status = await checkStripeConnectionStatusUseCase.execute(sellerId!);

    return NextResponse.json(
      {
        status: status.status,
        accountId: status.accountId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking Stripe account status:", error);
    return NextResponse.json(
      { error: "Failed to check Stripe account" },
      { status: 500 }
    );
  }
}

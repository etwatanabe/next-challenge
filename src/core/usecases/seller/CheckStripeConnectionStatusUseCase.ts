import { ISellerInterface } from "@/core/domain/interfaces/ISellerInterface";
import stripe from "@/utils/stripe";

export class CheckStripeConnectionStatusUseCase {
  constructor(private readonly sellerRepository: ISellerInterface) {}

  async execute(
    sellerId: string
  ): Promise<{ status: string; accountId: string }> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    if (!seller.stripeAccountId) {
      return { status: "not_connected", accountId: "" };
    }

    const account = await stripe.accounts.retrieve(seller.stripeAccountId);
    if (!account) {
      throw new Error("Stripe account not found");
    }

    return {
      status: account.details_submitted ? "complete" : "pending",
      accountId: seller.stripeAccountId,
    };
  }
}

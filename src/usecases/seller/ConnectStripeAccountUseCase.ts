import { ISellerInterface } from "@/core/seller/interfaces/ISellerInterface";
import stripe from "@/utils/stripe";

export class ConnectStripeAccountUseCase {
  constructor(private SellerRepository: ISellerInterface) {}

  async execute(sellerId: string, origin: string): Promise<string> {
    const seller = await this.SellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error(`Seller with ID ${sellerId} not found`);
    }

    if (seller.stripeAccountId) {
      throw new Error("Seller already has a Stripe account connected");
    }

    const account = await stripe.accounts.create({
      type: "express",
      country: "BR",
      email: seller.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    seller.update({ stripeAccountId: account.id });

    const updatedSeller = await this.SellerRepository.update(seller);
    if (!updatedSeller || updatedSeller.stripeAccountId !== account.id) {
      throw new Error("Failed to update seller with Stripe account ID");
    }

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${origin}/dashboard/payments?refresh=true`,
      return_url: `${origin}/dashboard/payments?success=true`,
      type: "account_onboarding",
    });

    return accountLink.url;
  }
}
